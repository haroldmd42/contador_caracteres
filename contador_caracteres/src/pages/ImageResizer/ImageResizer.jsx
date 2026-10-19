import { useState, useRef, useCallback, useEffect } from 'react';
import { apiImageResize } from '../../services/apiService';
import './ImageResizer.css';

/** Accepted image MIME types */
const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/jpg',
];

/** Maximum dimension allowed (width or height) */
const MAX_DIMENSION = 5000;

/**
 * Image Resizer page.
 * Upload an image, adjust dimensions (with optional aspect ratio lock),
 * choose output format and quality, then resize using backend API.
 */
export default function ImageResizer() {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [resized, setResized] = useState(null);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState(0.9);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const progressIntervalRef = useRef(null);

  /** Cleanup progress timer on unmount */
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  /** Helper to load and inspect file */
  const processFile = useCallback((file) => {
    if (!file) return;

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setError('Formato de imagen no válido. Por favor sube PNG, JPG, WEBP o GIF.');
      return;
    }

    setError(null);
    setImageFile(file);
    setResized(null);
    setProgress(0);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);

      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setOriginalSize({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
    };
    reader.readAsDataURL(file);
  }, []);

  /** Process uploaded image file */
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    processFile(file);
  }, [processFile]);

  /** Drag and Drop handlers */
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
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  /** Width change handler with aspect ratio lock */
  const handleWidthChange = useCallback((newWidth) => {
    setWidth(newWidth);
    if (lockRatio && originalSize.w && originalSize.h) {
      const ratio = originalSize.h / originalSize.w;
      setHeight(Math.round(newWidth * ratio));
    }
  }, [lockRatio, originalSize]);

  /** Height change handler with aspect ratio lock */
  const handleHeightChange = useCallback((newHeight) => {
    setHeight(newHeight);
    if (lockRatio && originalSize.w && originalSize.h) {
      const ratio = originalSize.w / originalSize.h;
      setWidth(Math.round(newHeight * ratio));
    }
  }, [lockRatio, originalSize]);

  /** Ratio lock checkbox handler */
  const handleLockRatioChange = useCallback(() => {
    const nextLock = !lockRatio;
    setLockRatio(nextLock);
    if (nextLock && originalSize.w && width) {
      const ratio = originalSize.h / originalSize.w;
      setHeight(Math.round(width * ratio));
    }
  }, [lockRatio, originalSize, width]);

  /** Resize the image using backend sharp service with visual loader and progress bar */
  const resizeImage = useCallback(async () => {
    if ((!imageFile && !preview) || !width || !height) return;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      setError(`Dimensiones demasiado grandes (máximo ${MAX_DIMENSION}px permitidos).`);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(15);
    setProgressText('Iniciando procesamiento de imagen...');

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Dynamic progress bar increments while waiting for backend
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const inc = Math.floor(Math.random() * 8) + 6;
        const next = Math.min(prev + inc, 92);
        if (next > 75) {
          setProgressText('Comprimiendo y codificando en formato ' + (format.split('/')[1]?.toUpperCase() || 'PNG') + '...');
        } else if (next > 45) {
          setProgressText('Redimensionando píxeles a ' + width + ' × ' + height + 'px...');
        } else if (next > 25) {
          setProgressText('Ajustando escala y remuestreo de alta calidad...');
        }
        return next;
      });
    }, 140);

    try {
      const inputTarget = imageFile || preview;
      const targetFormatStr = format.split('/')[1] || 'png';
      const blobResult = await apiImageResize(inputTarget, width, height, targetFormatStr, quality, lockRatio);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setProgress(100);
      setProgressText('¡Redimensión completada con éxito!');

      const url = URL.createObjectURL(blobResult);
      setResized(url);
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setError(`Error al redimensionar en el servidor: ${err.message}`);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  }, [imageFile, preview, width, height, format, quality, lockRatio]);

  /** Download the resized image */
  const downloadImage = useCallback(() => {
    if (!resized) return;

    const link = document.createElement('a');
    link.href = resized;
    link.download = `resized-${width}x${height}.${format.split('/')[1] || 'png'}`;
    link.click();
  }, [resized, format, width, height]);

  /** Reset all state */
  const reset = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setImageFile(null);
    setPreview(null);
    setWidth('');
    setHeight('');
    setResized(null);
    setError(null);
    setLoading(false);
    setProgress(0);
    setProgressText('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="resizer-container">
      <div className="card shadow p-4 resizer-card">
        <h2 className="text-center mb-4 resizer-title">
          <i className="bi bi-card-image me-2"></i> Redimensionar imágenes
        </h2>

        {/* File upload box */}
        <div
          className={`resizer-upload-box mb-3 text-center ${isDragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="d-none"
            id="resizerFileInput"
            disabled={loading}
          />
          <label htmlFor="resizerFileInput" className="resizer-upload-label">
            <i className="bi bi-arrow-bar-up"></i>
            <p>Haz clic o arrastra una imagen aquí</p>
          </label>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 py-2 px-3 animate-fade-in" role="alert">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
            <div>{error}</div>
          </div>
        )}

        {preview && (
          <div className="row g-4">
            {/* Left — Image previews */}
            <div className="col-md-6 text-center">
              <p className="text-muted mb-2">
                <strong>Original:</strong> {originalSize.w} × {originalSize.h}px
              </p>

              <div className="resizer-preview-wrapper mb-3">
                <img
                  src={preview}
                  alt="Vista previa original"
                  className="img-fluid rounded resizer-preview-img"
                />
                {loading && (
                  <div className="resizer-preview-loading-badge">
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Procesando...</span>
                  </div>
                )}
              </div>

              {/* Resized result display */}
              {resized && !loading && (
                <div className="mt-3 animate-fade-in">
                  <div className="resizer-result-badge">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Resultado: {width} × {height}px ({format.split('/')[1]?.toUpperCase()})</span>
                  </div>
                  <div>
                    <img
                      src={resized}
                      alt="Imagen redimensionada"
                      className="img-fluid rounded resizer-preview-img resizer-result-img"
                    />
                  </div>
                </div>
              )}

              {/* Skeleton/Placeholder while loading */}
              {loading && (
                <div className="resizer-processing-placeholder mt-3 text-center p-3 animate-fade-in">
                  <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                  <p className="small text-muted mb-0">
                    Generando nueva versión a {width} × {height}px...
                  </p>
                </div>
              )}
            </div>

            {/* Right — Controls & Progress */}
            <div className="col-md-6">
              <div className="mb-2">
                <label htmlFor="resizer-width" className="form-label mb-1 fw-semibold">Ancho (px)</label>
                <input
                  id="resizer-width"
                  type="number"
                  className="form-control"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  disabled={loading}
                  min="1"
                  max={MAX_DIMENSION}
                />
              </div>

              <div className="mb-2">
                <label htmlFor="resizer-height" className="form-label mb-1 fw-semibold">Alto (px)</label>
                <input
                  id="resizer-height"
                  type="number"
                  className="form-control"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  disabled={loading}
                  min="1"
                  max={MAX_DIMENSION}
                />
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="resizer-lock-ratio"
                  checked={lockRatio}
                  onChange={handleLockRatioChange}
                  disabled={loading}
                />
                <label className="form-check-label user-select-none" htmlFor="resizer-lock-ratio">
                  Mantener proporción
                </label>
              </div>

              <div className="mb-2">
                <label htmlFor="resizer-format" className="form-label mb-1 fw-semibold">Formato</label>
                <select
                  id="resizer-format"
                  className="form-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={loading}
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WEBP</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="resizer-quality" className="form-label mb-1 fw-semibold">
                  Calidad: {quality}
                </label>
                <input
                  id="resizer-quality"
                  type="range"
                  className="form-range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={loading}
                />
              </div>

              {/* Progress bar and Loader */}
              {loading && (
                <div
                  className="resizer-progress-card mb-3 animate-fade-in"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="resizer-progress-title d-flex align-items-center gap-2">
                      <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                      <span>{progressText}</span>
                    </span>
                    <span className="resizer-progress-pct fw-bold">{progress}%</span>
                  </div>
                  <div className="resizer-progress-track">
                    <div
                      className="resizer-progress-fill"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="resizer-progress-shimmer"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {resized && !loading && (
                <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-3 animate-fade-in" role="status">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <div className="small">
                    <strong>¡Redimensión completada!</strong> La imagen está lista para descargar.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2 mt-2">
                <button
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2 fw-semibold py-2"
                  onClick={resizeImage}
                  disabled={loading || !preview}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Redimensionando ({progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <span>Redimensionar</span>
                      <i className="bi bi-aspect-ratio"></i>
                    </>
                  )}
                </button>

                {resized && !loading && (
                  <button
                    className="btn btn-success d-flex align-items-center justify-content-center gap-2 fw-semibold py-2 animate-fade-in"
                    onClick={downloadImage}
                  >
                    <span>Descargar</span>
                    <i className="bi bi-download"></i>
                  </button>
                )}

                <button
                  className="btn btn-danger d-flex align-items-center justify-content-center gap-2 py-2"
                  onClick={reset}
                  disabled={loading}
                >
                  <span>Limpiar</span>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}