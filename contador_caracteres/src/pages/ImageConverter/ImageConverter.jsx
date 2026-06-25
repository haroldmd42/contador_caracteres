import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import heic2any from 'heic2any';
import { IMAGE_FORMATS, getFormatConfig, getCompatibleFormats } from '../../constants/formats';
import './ImageConverter.css';

/** Binary scanner to extract embedded JPEG preview from camera RAW files (CR2, CR3, NEF, ARW, DNG, RAF, RW2) */
function extractJpegFromRaw(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const length = arrayBuffer.byteLength;
  const matches = [];

  // Scan array buffer for JPEG SOI marker (0xFFD8) and EOI marker (0xFFD9)
  for (let i = 0; i < length - 4; i++) {
    if (view.getUint8(i) === 0xFF && view.getUint8(i + 1) === 0xD8) {
      let jpegEnd = -1;
      // Previews are usually at least 20KB, scan forward to find EOI
      for (let j = i + 2; j < length - 1; j++) {
        if (view.getUint8(j) === 0xFF && view.getUint8(j + 1) === 0xD9) {
          jpegEnd = j + 2;
          const size = jpegEnd - i;
          if (size > 15000) { // Limit to matches > 15KB to avoid small thumbnails
            matches.push({ start: i, end: jpegEnd, size });
          }
          break;
        }
      }
    }
  }

  if (matches.length === 0) {
    throw new Error("No se encontró ninguna imagen de previsualización JPEG incrustada en este archivo RAW.");
  }

  // Sort by size to retrieve the largest (highest resolution) embedded preview
  matches.sort((a, b) => b.size - a.size);
  const bestMatch = matches[0];
  const jpegBytes = new Uint8Array(arrayBuffer, bestMatch.start, bestMatch.size);
  return new Blob([jpegBytes], { type: "image/jpeg" });
}

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalDetails, setOriginalDetails] = useState(null);
  const [targetFormat, setTargetFormat] = useState('png');
  const [quality, setQuality] = useState(0.9);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  /** Build dynamic accept attribute for image input */
  const acceptedExtensions = useMemo(() => {
    return IMAGE_FORMATS.map(f => `.${f.ext}`).join(',');
  }, []);

  /** Resolve compatible output options dynamically based on input format */
  const outputOptions = useMemo(() => {
    if (!file) return [];
    const ext = file.name.split('.').pop().toLowerCase();
    return getCompatibleFormats(ext);
  }, [file]);

  /** Clean up Object URLs to prevent memory leaks */
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [previewUrl, convertedUrl]);

  /** Process uploaded image file */
  const handleImageUpload = useCallback(async (uploadedFile) => {
    if (!uploadedFile) return;

    const ext = uploadedFile.name.split('.').pop().toLowerCase();
    const formatConfig = getFormatConfig(ext);

    if (!formatConfig || formatConfig.category !== 'image') {
      alert(`El formato .${ext} no está soportado en este conversor de imágenes.`);
      return;
    }

    setFile(uploadedFile);
    setConvertedUrl(null);
    setError(null);
    setPreviewUrl(null);
    setOriginalDetails(null);

    // Dynamic output default
    const compat = getCompatibleFormats(ext);
    if (compat.length > 0) {
      setTargetFormat(compat[0].ext);
    } else {
      setTargetFormat('png');
    }

    try {
      let displayBlob = uploadedFile;

      // 1. Process HEIC/HEIF using heic2any
      if (ext === 'heic' || ext === 'heif') {
        const heicResult = await heic2any({
          blob: uploadedFile,
          toType: 'image/jpeg',
          quality: 0.8
        });
        displayBlob = Array.isArray(heicResult) ? heicResult[0] : heicResult;
      }
      // 2. Process Camera RAW by extracting embedded JPEG
      else if (['cr2', 'cr3', 'nef', 'arw', 'dng', 'raf', 'rw2'].includes(ext)) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        displayBlob = extractJpegFromRaw(arrayBuffer);
      }

      // Generate local preview URL
      const objUrl = URL.createObjectURL(displayBlob);
      setPreviewUrl(objUrl);

      // Extract image size and dimension
      if (ext === 'pdf') {
        // PDF metadata
        setOriginalDetails({
          width: 800,
          height: 1100,
          size: uploadedFile.size,
          type: 'application/pdf',
          isPdf: true
        });
      } else {
        const img = new Image();
        img.onload = () => {
          setOriginalDetails({
            width: img.width,
            height: img.height,
            size: uploadedFile.size,
            type: uploadedFile.type || `image/${ext}`,
          });
        };
        img.src = objUrl;
      }

    } catch (err) {
      console.error(err);
      setError(`Error al leer la imagen original: ${err.message}`);
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    handleImageUpload(e.target.files[0]);
  }, [handleImageUpload]);

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
      handleImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleImageUpload]);

  /** Reset converter state */
  const reset = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setOriginalDetails(null);
    setTargetFormat('png');
    setQuality(0.9);
    setConvertedUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  /** Handle target format changes */
  const handleTargetFormatChange = (newFormatExt) => {
    setTargetFormat(newFormatExt);
    setConvertedUrl(null);
    setError(null);
  };

  /** Perform conversion */
  const convertImage = useCallback(async () => {
    if (!file || !originalDetails) return;

    setIsConverting(true);
    setError(null);
    setConvertedUrl(null);

    const ext = file.name.split('.').pop().toLowerCase();
    const targetConfig = getFormatConfig(targetFormat);
    const targetMime = targetConfig?.mime || 'image/png';

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Helper to generate DataURL/Blob from canvas
      const finishConversion = (cvs) => {
        const resultDataUrl = cvs.toDataURL(targetMime, quality);
        setConvertedUrl(resultDataUrl);
        setIsConverting(false);
      };

      // 1. If input is PDF, render the first page onto the canvas using PDF.js
      if (ext === 'pdf') {
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
          document.head.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error("No se pudo cargar la librería PDF.js para renderizar la página."));
          });
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdfDoc.getPage(1);

        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for higher quality
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // White background for PDFs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        finishConversion(canvas);
      } 
      // 2. Regular image rendering
      else {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          // Set white background for JPEG outputs to prevent black transparencies
          if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);
          finishConversion(canvas);
        };
        img.onerror = () => {
          setError('No se pudo cargar la imagen para renderizar.');
          setIsConverting(false);
        };
        img.src = previewUrl;
      }
    } catch (err) {
      console.error(err);
      setError(`Error al convertir la imagen: ${err.message}`);
      setIsConverting(false);
    }
  }, [file, previewUrl, originalDetails, targetFormat, quality]);

  /** Trigger download of converted image */
  const downloadImage = useCallback(() => {
    if (!convertedUrl || !file) return;

    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `${baseName}_converted.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`;
    link.click();
  }, [convertedUrl, file, targetFormat]);

  const selectedTargetConfig = useMemo(() => {
    return getFormatConfig(targetFormat);
  }, [targetFormat]);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="imgconv-container">
      {/* Header */}
      <div className="imgconv-header">
        <i className="bi bi-images imgconv-icon-main"></i>
        <h2 className="imgconv-title">Conversor de Formatos de Imagen</h2>
        <p className="imgconv-subtitle">
          Carga una imagen (incluyendo formatos HEIC y RAW profesionales) y conviértela instantáneamente de forma local.
        </p>
      </div>

      <div className="imgconv-card">
        {/* Upload box */}
        {!file && (
          <div
            className={`imgconv-upload-box ${isDragOver ? 'bg-light border-primary' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="d-none"
              id="imageConvInput"
              accept={acceptedExtensions}
            />
            <label htmlFor="imageConvInput" style={{ cursor: 'pointer', width: '100%' }}>
              <i className="bi bi-cloud-arrow-up"></i>
              <span>Haz clic o arrastra tu imagen aquí</span>
              <small className="d-block mt-2">
                Soporta PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, HEIC/HEIF y formatos RAW de cámaras (CR2, CR3, NEF, DNG, etc.).
              </small>
            </label>
          </div>
        )}

        {/* Selected file view */}
        {file && (
          <div className="imgconv-grid">
            {/* Left: Previews */}
            <div className="imgconv-preview-panel">
              {convertedUrl ? (
                <>
                  <span className="badge bg-success mb-2">Resultado Convertido</span>
                  <img
                    src={convertedUrl}
                    alt="Imagen convertida"
                    className="imgconv-preview-img"
                  />
                  <div className="imgconv-preview-info">
                    Formato: {targetFormat.toUpperCase()}
                  </div>
                </>
              ) : (
                <>
                  <span className="badge bg-secondary mb-2">Imagen Original / Preview</span>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Vista previa original"
                      className="imgconv-preview-img"
                    />
                  ) : (
                    <div className="py-5 text-center text-secondary">
                      <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
                      <div>Cargando y decodificando imagen...</div>
                    </div>
                  )}
                  {originalDetails && (
                    <div className="imgconv-preview-info">
                      Dimensión original: {originalDetails.width} × {originalDetails.height}px | Peso: {formatSize(originalDetails.size)}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right: Options & Conversion Actions */}
            <div>
              <div className="imgconv-form-group">
                <label htmlFor="image-format-select">Formato destino:</label>
                <select
                  id="image-format-select"
                  className="form-select"
                  value={targetFormat}
                  onChange={(e) => handleTargetFormatChange(e.target.value)}
                  disabled={isConverting}
                >
                  {outputOptions.map((opt) => (
                    <option key={opt.ext} value={opt.ext}>
                      {opt.name} (.{opt.ext})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quality slider (JPEGs and WEBP native) */}
              {(targetFormat === 'jpg' || targetFormat === 'jpeg' || targetFormat === 'webp') && (
                <div className="imgconv-form-group">
                  <label htmlFor="image-quality-range">
                    Calidad de compresión: {Math.round(quality * 100)}%
                  </label>
                  <input
                    id="image-quality-range"
                    type="range"
                    className="form-range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => {
                      setQuality(parseFloat(e.target.value));
                      setConvertedUrl(null);
                    }}
                    disabled={isConverting}
                  />
                  <small className="text-muted d-block">
                    Una menor calidad disminuye el tamaño del archivo resultante.
                  </small>
                </div>
              )}

              {/* Dynamic metadata info box from CENTRAL formats.js config */}
              {targetFormat && selectedTargetConfig && (
                <div className="alert bg-light border-light-subtle p-3 my-3" style={{ fontSize: '0.85rem' }}>
                  <h6 className="mb-1 d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle-fill text-primary"></i> 
                    <span>Sobre {selectedTargetConfig.name}</span>
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

              {/* Status Alert */}
              {isConverting && (
                <div className="alert alert-info py-2 my-2 d-flex align-items-center gap-2" role="status">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <span>Procesando imagen localmente en tu navegador...</span>
                </div>
              )}

              {error && (
                <div className="imgconv-alert imgconv-alert--error">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              {convertedUrl && (
                <div className="imgconv-alert imgconv-alert--success">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Imagen convertida con éxito y lista para descargar.</span>
                </div>
              )}

              {/* Actions */}
              <div className="imgconv-buttons">
                {!convertedUrl ? (
                  <button
                    className="imgconv-btn imgconv-btn--convert"
                    onClick={convertImage}
                    disabled={isConverting || !previewUrl}
                  >
                    <i className="bi bi-arrow-repeat"></i> Convertir Imagen
                  </button>
                ) : (
                  <button
                    className="imgconv-btn imgconv-btn--download"
                    onClick={downloadImage}
                  >
                    <i className="bi bi-download"></i> Descargar Imagen
                  </button>
                )}

                <button
                  className="imgconv-btn imgconv-btn--clear"
                  onClick={reset}
                  disabled={isConverting}
                >
                  <i className="bi bi-trash"></i> {convertedUrl ? 'Subir otra imagen' : 'Limpiar Todo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
