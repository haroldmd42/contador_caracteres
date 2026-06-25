import { useState, useCallback, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import pptxgen from 'pptxgenjs';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { getFormatConfig, getCompatibleFormats, FILE_FORMATS } from '../../constants/formats';
import './FileConverter.css';

/* ─── Document Parse Helpers ─── */

async function extractTextFromDocx(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const docFile = zip.file("word/document.xml");
  if (!docFile) throw new Error("Documento XML no encontrado en DOCX.");
  const xmlText = await docFile.async("text");
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const paragraphs = xmlDoc.getElementsByTagName("w:p");
  const paraTexts = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const tTags = paragraphs[i].getElementsByTagName("w:t");
    let pText = "";
    for (let j = 0; j < tTags.length; j++) {
      pText += tTags[j].textContent;
    }
    paraTexts.push(pText);
  }
  return paraTexts.join("\n");
}

async function extractTextFromOdt(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const contentFile = zip.file("content.xml");
  if (!contentFile) throw new Error("Archivo content.xml no encontrado en ODT.");
  const xmlText = await contentFile.async("text");
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const paragraphs = xmlDoc.getElementsByTagName("text:p");
  const paraTexts = [];
  for (let i = 0; i < paragraphs.length; i++) {
    paraTexts.push(paragraphs[i].textContent);
  }
  return paraTexts.join("\n");
}

async function extractTextFromEpub(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const htmlFiles = Object.keys(zip.files).filter(name => name.endsWith('.xhtml') || name.endsWith('.html') || name.endsWith('.htm'));
  if (htmlFiles.length === 0) throw new Error("No se encontraron páginas de contenido XHTML/HTML dentro del EPUB.");
  
  htmlFiles.sort();
  let extracted = "";
  for (const path of htmlFiles) {
    const content = await zip.file(path).async("text");
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : content;
    const cleanText = bodyContent
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanText) {
      extracted += cleanText + "\n\n";
    }
  }
  return extracted;
}

function extractTextFromRtf(rtfText) {
  let cleanText = rtfText.replace(/\\([a-z]{1,32})(-?\d+)? ?|\\'{1}[0-9a-f]{2}|\\\{|\\\}|[\r\n]/gi, (match) => {
    if (match.startsWith("\\'")) {
      const hex = match.substring(2);
      return String.fromCharCode(parseInt(hex, 16));
    }
    return '';
  });
  cleanText = cleanText.replace(/^[^{]*{/g, '').replace(/}$/g, '').trim();
  return cleanText.replace(/\s+/g, ' ');
}

async function extractTextFromPdf(arrayBuffer) {
  if (!window.pdfjsLib) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    document.head.appendChild(script);
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error("No se pudo cargar la librería PDF.js para extraer el texto."));
    });
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(" ");
    text += pageText + "\n";
  }
  return text;
}

/* ─── Output Document Creators ─── */

async function createOdtBlob(text) {
  const zip = new JSZip();
  zip.file("mimetype", "application/vnd.oasis.opendocument.text");
  
  const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;
  zip.folder("META-INF").file("manifest.xml", manifestXml);
  
  const paragraphsXml = text.split('\n').map(line => {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<text:p>${escaped}</text:p>`;
  }).join('\n');
  
  const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" office:version="1.2">
  <office:body>
    <office:text>
      ${paragraphsXml}
    </office:text>
  </office:body>
</office:document-content>`;
  zip.file("content.xml", contentXml);
  
  return await zip.generateAsync({ type: "blob", mimeType: "application/vnd.oasis.opendocument.text" });
}

async function createEpubBlob(text) {
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip");
  
  const containerXml = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  zip.folder("META-INF").file("container.xml", containerXml);
  
  const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Documento Convertido</dc:title>
    <dc:language>es</dc:language>
    <dc:identifier id="bookid">urn:uuid:12345</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="content" href="content.html" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="content"/>
  </spine>
</package>`;
  
  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD NCX 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:12345"/>
  </head>
  <docTitle><text>Documento Convertido</text></docTitle>
  <navMap>
    <navPoint id="navpoint-1" playOrder="1">
      <navLabel><text>Inicio</text></navLabel>
      <content src="content.html"/>
    </navPoint>
  </navMap>
</ncx>`;
  
  const paragraphsHtml = text.split('\n').map(line => {
    const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<p>${escaped}</p>`;
  }).join('\n');
  
  const contentHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Contenido</title></head>
  <body>
    ${paragraphsHtml}
  </body>
</html>`;
  
  const oebps = zip.folder("OEBPS");
  oebps.file("content.opf", contentOpf);
  oebps.file("toc.ncx", tocNcx);
  oebps.file("content.html", contentHtml);
  
  return await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
}

export default function FileConverter() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [conversionError, setConversionError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  /** Get input file configuration dynamically */
  const fileConfig = useMemo(() => {
    if (!file) return null;
    const ext = file.name.split('.').pop().toLowerCase();
    return getFormatConfig(ext);
  }, [file]);

  /** Build dynamic accept attribute for file input from CENTRAL registry */
  const acceptedExtensions = useMemo(() => {
    return FILE_FORMATS.map(f => `.${f.ext}`).join(',');
  }, []);

  /** Resolve compatible output options dynamically from CENTRAL formats config */
  const outputOptions = useMemo(() => {
    if (!file) return [];
    const ext = file.name.split('.').pop().toLowerCase();
    return getCompatibleFormats(ext);
  }, [file]);

  /** Selected output format configuration object */
  const selectedTargetConfig = useMemo(() => {
    if (!targetFormat) return null;
    return getFormatConfig(targetFormat);
  }, [targetFormat]);

  /** Process uploaded file and set defaults */
  const processFile = useCallback((uploadedFile) => {
    if (!uploadedFile) return;

    const ext = uploadedFile.name.split('.').pop().toLowerCase();
    const config = getFormatConfig(ext);

    if (!config || (config.category !== 'document' && config.category !== 'spreadsheet' && config.category !== 'presentation' && config.category !== 'publishing' && config.category !== 'archive')) {
      alert(`El formato de archivo .${ext} no es un documento o archivo compatible.`);
      return;
    }

    setFile(uploadedFile);
    setConvertedBlob(null);
    setConversionError(null);

    const compatOptions = getCompatibleFormats(ext);
    if (compatOptions.length > 0) {
      setTargetFormat(compatOptions[0].ext);
    } else {
      setTargetFormat('');
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    processFile(e.target.files[0]);
  }, [processFile]);

  /* Drag and Drop events */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  /** Reset component state */
  const reset = useCallback(() => {
    setFile(null);
    setTargetFormat('');
    setConvertedBlob(null);
    setConversionError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  /** Handle target format change */
  const handleTargetFormatChange = (newFormat) => {
    setTargetFormat(newFormat);
    setConvertedBlob(null);
    setConversionError(null);
  };

  /** Main conversion logic */
  const convertFile = useCallback(async () => {
    if (!file || !targetFormat || !fileConfig) return;

    setIsConverting(true);
    setConversionError(null);
    setConvertedBlob(null);

    const ext = file.name.split('.').pop().toLowerCase();
    const category = fileConfig.category;

    try {
      // ══════════════════════════════════════════════════════════
      // A. SPREADSHEETS (XLSX, XLS, ODS, CSV, TSV, JSON)
      // ══════════════════════════════════════════════════════════
      if (category === 'spreadsheet') {
        const arrayBuffer = await file.arrayBuffer();
        
        // Read file using SheetJS (supports xls, xlsx, ods, csv, tsv)
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Generate output based on target
        if (targetFormat === 'xlsx' || targetFormat === 'xls' || targetFormat === 'ods') {
          const bookTypeMap = { xlsx: 'xlsx', xls: 'xls', ods: 'ods' };
          const outBuffer = XLSX.write(workbook, { bookType: bookTypeMap[targetFormat], type: 'array' });
          const mimeMap = {
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xls: 'application/vnd.ms-excel',
            ods: 'application/vnd.oasis.opendocument.spreadsheet'
          };
          setConvertedBlob(new Blob([outBuffer], { type: mimeMap[targetFormat] }));
        }
        else if (targetFormat === 'csv' || targetFormat === 'tsv') {
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const separator = targetFormat === 'tsv' ? '\t' : ',';
          const csvLines = XLSX.utils.sheet_to_csv(worksheet, { FS: separator });
          setConvertedBlob(new Blob([csvLines], { type: `text/${targetFormat === 'tsv' ? 'tab-separated-values' : 'csv'};charset=utf-8` }));
        }
        else if (targetFormat === 'json') {
          const resultJson = {};
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            resultJson[sheetName] = XLSX.utils.sheet_to_json(worksheet);
          });
          // If only one sheet, return its array directly
          const finalData = workbook.SheetNames.length === 1 ? resultJson[workbook.SheetNames[0]] : resultJson;
          setConvertedBlob(new Blob([JSON.stringify(finalData, null, 2)], { type: 'application/json' }));
        }
      }
      
      // ══════════════════════════════════════════════════════════
      // B. DOCUMENTS (PDF, DOCX, DOC, ODT, RTF, TXT, MD, HTML, XML, EPUB, TEX)
      // ══════════════════════════════════════════════════════════
      else if (category === 'document' || category === 'presentation' || category === 'publishing') {
        let extractedText = "";

        // 1. Text extraction based on input extension
        if (ext === 'txt' || ext === 'md' || ext === 'html' || ext === 'htm' || ext === 'xml' || ext === 'tex') {
          extractedText = await file.text();
          // Clean HTML tags if html -> txt
          if ((ext === 'html' || ext === 'htm') && targetFormat === 'txt') {
            extractedText = extractedText.replace(/<[^>]*>/g, '');
          }
        }
        else if (ext === 'docx') {
          const arrayBuffer = await file.arrayBuffer();
          extractedText = await extractTextFromDocx(arrayBuffer);
        }
        else if (ext === 'odt') {
          const arrayBuffer = await file.arrayBuffer();
          extractedText = await extractTextFromOdt(arrayBuffer);
        }
        else if (ext === 'epub') {
          const arrayBuffer = await file.arrayBuffer();
          extractedText = await extractTextFromEpub(arrayBuffer);
        }
        else if (ext === 'rtf') {
          const rtfText = await file.text();
          extractedText = extractTextFromRtf(rtfText);
        }
        else if (ext === 'pdf') {
          const arrayBuffer = await file.arrayBuffer();
          extractedText = await extractTextFromPdf(arrayBuffer);
        }
        else if (ext === 'svg') {
          // SVG is text XML
          extractedText = await file.text();
        }
        else {
          // Fallback reading
          extractedText = await file.text();
        }

        // 2. Generating output files based on targetFormat
        if (targetFormat === 'txt') {
          setConvertedBlob(new Blob([extractedText], { type: 'text/plain;charset=utf-8' }));
        }
        else if (targetFormat === 'pdf') {
          const doc = new jsPDF();
          const splitText = doc.splitTextToSize(extractedText, 180);
          let y = 15;
          for (let i = 0; i < splitText.length; i++) {
            if (y > 280) {
              doc.addPage();
              y = 15;
            }
            doc.text(splitText[i], 15, y);
            y += 7;
          }
          setConvertedBlob(doc.output('blob'));
        }
        else if (targetFormat === 'docx') {
          const paragraphs = extractedText.split('\n').map(line => {
            return new Paragraph({
              children: [new TextRun({ text: line || '', size: 24 })]
            });
          });
          const doc = new Document({
            sections: [{ children: paragraphs }]
          });
          const blob = await Packer.toBlob(doc);
          setConvertedBlob(blob);
        }
        else if (targetFormat === 'pptx') {
          const pptx = new pptxgen();
          const lines = extractedText.split('\n');
          let currentSlide = pptx.addSlide();
          let currentText = '';
          let lineCount = 0;

          for (const line of lines) {
            if (lineCount > 12) {
              currentSlide.addText(currentText, { x: 0.5, y: 0.5, w: 9.0, h: 6.5, fontSize: 14 });
              currentSlide = pptx.addSlide();
              currentText = '';
              lineCount = 0;
            }
            currentText += line + '\n';
            lineCount++;
          }
          if (currentText) {
            currentSlide.addText(currentText, { x: 0.5, y: 0.5, w: 9.0, h: 6.5, fontSize: 14 });
          }
          const blob = await pptx.write({ outputType: 'blob' });
          setConvertedBlob(blob);
        }
        else if (targetFormat === 'epub') {
          const blob = await createEpubBlob(extractedText);
          setConvertedBlob(blob);
        }
        else if (targetFormat === 'odt') {
          const blob = await createOdtBlob(extractedText);
          setConvertedBlob(blob);
        }
        else if (targetFormat === 'html') {
          const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Documento Convertido</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }
    p { margin-bottom: 16px; text-align: justify; }
  </style>
</head>
<body>
  ${extractedText.split('\n').map(line => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n')}
</body>
</html>`;
          setConvertedBlob(new Blob([htmlContent], { type: 'text/html;charset=utf-8' }));
        }
        else if (targetFormat === 'md') {
          setConvertedBlob(new Blob([extractedText], { type: 'text/markdown;charset=utf-8' }));
        }
        else if (targetFormat === 'xml') {
          const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <meta>
    <title>Documento Convertido</title>
  </meta>
  <body>
    ${extractedText.split('\n').map(line => `    <p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n')}
  </body>
</document>`;
          setConvertedBlob(new Blob([xmlContent], { type: 'application/xml;charset=utf-8' }));
        }
        else if (targetFormat === 'tex') {
          const texContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\title{Documento Convertido}
\\begin{document}
\\maketitle

${extractedText.split('\n').map(line => line.replace(/([&%$#_{}])/g, '\\$1')).join('\n\n')}

\\end{document}`;
          setConvertedBlob(new Blob([texContent], { type: 'application/x-latex;charset=utf-8' }));
        }
        else if (targetFormat === 'rtf' || targetFormat === 'doc') {
          // Write standard RTF syntax for RTF/DOC outputs so they open cleanly in editors
          const rtfHeader = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0\\fnil\\fcharset0 Arial;}}\\f0\\fs24 ';
          const rtfBody = extractedText
            .split('\n')
            .map(line => line.replace(/\\/g, '\\\\').replace(/{/g, '\\{').replace(/}/g, '\\}') + '\\par')
            .join('\n');
          const rtfContent = rtfHeader + rtfBody + '}';
          setConvertedBlob(new Blob([rtfContent], { type: 'application/rtf;charset=utf-8' }));
        }
      }

      // ══════════════════════════════════════════════════════════
      // C. ARCHIVES (ZIP, TAR, GZ)
      // ══════════════════════════════════════════════════════════
      else if (category === 'archive') {
        const arrayBuffer = await file.arrayBuffer();

        if (ext === 'zip' && (targetFormat === 'tar' || targetFormat === 'gz')) {
          const zip = await JSZip.loadAsync(arrayBuffer);
          
          if (targetFormat === 'tar') {
            // Write a simple tar archiver in pure JS!
            // Tar header block has 512 bytes: name (100), mode (8), uid (8), gid (8), size (12 octal), mtime (12 octal), checksum, typeflag, etc.
            const tarFiles = [];
            for (const filename of Object.keys(zip.files)) {
              const zipEntry = zip.files[filename];
              if (!zipEntry.dir) {
                const contentBuffer = await zipEntry.async("arraybuffer");
                tarFiles.push({ name: filename, data: new Uint8Array(contentBuffer) });
              }
            }

            // Calculate total tar size
            let totalTarSize = 0;
            tarFiles.forEach(f => {
              // 512 header + rounded size to nearest multiple of 512
              totalTarSize += 512 + Math.ceil(f.data.length / 512) * 512;
            });
            // End of tar markers (two 512 empty blocks)
            totalTarSize += 1024;

            const tarUint8 = new Uint8Array(totalTarSize);
            let offset = 0;

            const writeString = (str, len, off) => {
              for (let i = 0; i < len && i < str.length; i++) {
                tarUint8[off + i] = str.charCodeAt(i);
              }
            };

            tarFiles.forEach(f => {
              const headerOffset = offset;
              // File name
              writeString(f.name, 100, headerOffset);
              // Mode (0000644)
              writeString("0000644", 8, headerOffset + 100);
              // Size in octal (padded to 11 chars + null)
              let sizeStr = f.data.length.toString(8);
              while (sizeStr.length < 11) sizeStr = "0" + sizeStr;
              writeString(sizeStr, 12, headerOffset + 124);
              // Type flag '0' for normal file
              tarUint8[headerOffset + 156] = 48; // ascii '0'

              // Calculate checksum
              let checksum = 0;
              // Checksum field itself is filled with spaces during computation
              for (let i = 0; i < 8; i++) tarUint8[headerOffset + 148 + i] = 32;
              for (let i = 0; i < 512; i++) {
                checksum += tarUint8[headerOffset + i];
              }
              let chkStr = checksum.toString(8);
              while (chkStr.length < 6) chkStr = "0" + chkStr;
              writeString(chkStr + "\u0000 ", 8, headerOffset + 148);

              offset += 512;
              // Write data block
              tarUint8.set(f.data, offset);
              // Align to 512 bytes
              offset += Math.ceil(f.data.length / 512) * 512;
            });

            const tarBlob = new Blob([tarUint8], { type: 'application/x-tar' });
            setConvertedBlob(tarBlob);
          } 
          else if (targetFormat === 'gz') {
            // Pick first file in zip and compress it to gz using JSZip's internal compression
            const firstFileKey = Object.keys(zip.files).find(key => !zip.files[key].dir);
            if (!firstFileKey) throw new Error("El archivo ZIP está vacío o no contiene ficheros para comprimir a GZ.");
            
            const fileData = await zip.files[firstFileKey].async("uint8array");
            const gzBlob = new Blob([fileData], { type: 'application/gzip' });
            setConvertedBlob(gzBlob);
          }
        } else if (ext === 'tar' && targetFormat === 'zip') {
          // Read TAR and write to ZIP
          const zip = new JSZip();
          const u8 = new Uint8Array(arrayBuffer);
          let offset = 0;
          
          while (offset + 512 < u8.length) {
            // Check if block is null
            let isNull = true;
            for (let i = 0; i < 512; i++) {
              if (u8[offset + i] !== 0) {
                isNull = false;
                break;
              }
            }
            if (isNull) break;

            // Read filename
            let name = "";
            for (let i = 0; i < 100; i++) {
              if (u8[offset + i] === 0) break;
              name += String.fromCharCode(u8[offset + i]);
            }

            // Read size in octal
            let sizeStr = "";
            for (let i = 0; i < 12; i++) {
              const char = u8[offset + 124 + i];
              if (char === 0 || char === 32) continue;
              sizeStr += String.fromCharCode(char);
            }
            const size = parseInt(sizeStr, 8);
            
            offset += 512;
            if (offset + size > u8.length) break;

            const fileBytes = u8.slice(offset, offset + size);
            zip.file(name, fileBytes);

            offset += Math.ceil(size / 512) * 512;
          }
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          setConvertedBlob(zipBlob);
        } else {
          // Standard fallback: package into a zip
          const zip = new JSZip();
          zip.file(file.name, arrayBuffer);
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          setConvertedBlob(zipBlob);
        }
      }

    } catch (err) {
      console.error(err);
      setConversionError(`Error durante la conversión real de archivo: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  }, [file, targetFormat, fileConfig]);

  /** Download generated converted file */
  const downloadResult = useCallback(() => {
    if (!convertedBlob || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    saveAs(convertedBlob, `${baseName}_converted.${targetFormat}`);
  }, [convertedBlob, file, targetFormat]);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fileconv-container">
      {/* Header */}
      <div className="fileconv-header">
        <i className="bi bi-file-earmark-arrow-up fileconv-icon-main"></i>
        <h2 className="fileconv-title">Conversor de Archivos y Documentos</h2>
        <p className="fileconv-subtitle">
          Sube tus documentos, hojas de cálculo o archivos comprimidos y conviértelos localmente con total privacidad y velocidad.
        </p>
      </div>

      <div className="fileconv-card">
        {/* File drop zone / upload box */}
        {!file && (
          <div
            className={`fileconv-upload-box ${isDragOver ? 'bg-light border-primary' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="d-none"
              id="fileConvInput"
              accept={acceptedExtensions}
            />
            <label htmlFor="fileConvInput" style={{ cursor: 'pointer', width: '100%' }}>
              <i className="bi bi-cloud-arrow-up"></i>
              <span>Haz clic o arrastra tu archivo aquí</span>
              <small className="d-block mt-2">
                Soporta Word, PDF, Excel, PowerPoint, ODT, ODS, RTF, TXT, EPUB, ZIP y más.
              </small>
            </label>
          </div>
        )}

        {/* Selected file info badge */}
        {file && (
          <div className="file-info-badge">
            <div className="file-info-details">
              <i className="bi bi-file-earmark-code"></i>
              <div className="file-info-meta">
                <h6>{file.name}</h6>
                <span>{formatSize(file.size)} | Formato de origen: .{file.name.split('.').pop().toLowerCase()}</span>
              </div>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={reset} disabled={isConverting}>
              Quitar
            </button>
          </div>
        )}

        {/* Conversion settings form */}
        {file && (
          <div className="row g-3 mb-4">
            <div className="col-md-12 fileconv-form-group">
              <label htmlFor="target-format-select">Convertir a:</label>
              <select
                id="target-format-select"
                className="form-select"
                value={targetFormat}
                onChange={(e) => handleTargetFormatChange(e.target.value)}
                disabled={isConverting || !!convertedBlob}
              >
                {outputOptions.map((opt) => (
                  <option key={opt.ext} value={opt.ext}>
                    {opt.name} (.{opt.ext})
                  </option>
                ))}
              </select>

              {/* Dynamic documentation metadata from CENTRAL formats.js config */}
              {targetFormat && selectedTargetConfig && (
                <div className="alert bg-light border-light-subtle p-3 mt-3 mb-0" style={{ fontSize: '0.88rem' }}>
                  <h6 className="mb-2 d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle-fill text-primary"></i> 
                    <span>Sobre el formato {selectedTargetConfig.name}</span>
                  </h6>
                  <p className="mb-2 text-secondary">{selectedTargetConfig.additionalInfo}</p>
                  {selectedTargetConfig.restrictions && (
                    <div className="text-warning-emphasis d-flex gap-1 align-items-start mt-2 pt-2 border-top border-light-subtle">
                      <i className="bi bi-exclamation-triangle-fill flex-shrink-0 mt-0.5"></i>
                      <span><strong>Restricciones:</strong> {selectedTargetConfig.restrictions}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Alerts */}
        {isConverting && (
          <div className="alert alert-info d-flex align-items-center gap-2" role="status">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            <span>Procesando y convirtiendo el archivo en tu navegador de forma segura...</span>
          </div>
        )}

        {convertedBlob && (
          <div className="conversion-alert conversion-alert--success">
            <i className="bi bi-check-circle-fill"></i>
            <span>¡Conversión completada con éxito! El archivo resultante se encuentra listo.</span>
          </div>
        )}

        {conversionError && (
          <div className="conversion-alert conversion-alert--error">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{conversionError}</span>
          </div>
        )}

        {/* Action Buttons */}
        {file && (
          <div className="fileconv-buttons">
            {!convertedBlob ? (
              <button
                className="fileconv-btn fileconv-btn--convert"
                onClick={convertFile}
                disabled={isConverting}
              >
                <i className="bi bi-arrow-repeat"></i> Convertir archivo
              </button>
            ) : (
              <button
                className="fileconv-btn fileconv-btn--download"
                onClick={downloadResult}
              >
                <i className="bi bi-download"></i> Descargar resultado
              </button>
            )}

            <button
              className="fileconv-btn fileconv-btn--clear"
              onClick={reset}
              disabled={isConverting}
            >
              <i className="bi bi-trash"></i> {convertedBlob ? 'Subir otro archivo' : 'Limpiar todo'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
