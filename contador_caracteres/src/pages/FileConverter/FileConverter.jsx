import { useState, useCallback, useMemo, useRef } from 'react';
import { saveAs } from 'file-saver';
import { getFormatConfig, getCompatibleFormats, FILE_FORMATS } from '../../constants/formats';
import { apiFileConvert } from '../../services/apiService';
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

  /** Main conversion logic using backend API */
  const convertFile = useCallback(async () => {
    if (!file || !targetFormat) return;

    setIsConverting(true);
    setConversionError(null);
    setConvertedBlob(null);

    try {
      const blob = await apiFileConvert(file, targetFormat);
      setConvertedBlob(blob);
    } catch (err) {
      console.error(err);
      setConversionError(`Error durante la conversión de archivo en el servidor: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  }, [file, targetFormat]);

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
