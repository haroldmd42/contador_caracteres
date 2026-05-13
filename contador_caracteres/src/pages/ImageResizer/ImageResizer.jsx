import { useState, useEffect, useRef, useCallback } from 'react';
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
 * choose output format and quality, then download the result.
 */
export default function ImageResizer() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [resized, setResized] = useState(null);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState(0.9);
  const fileInputRef = useRef(null);

  /** Process uploaded image file */
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      alert('Formato no válido');
      return;
    }

    setImage(file);

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

  /** Maintain aspect ratio when width changes */
  useEffect(() => {
    if (!lockRatio || !originalSize.w || !width) return;

    const ratio = originalSize.h / originalSize.w;
    setHeight(Math.round(width * ratio));
  }, [width, lockRatio, originalSize]);

  /** Resize the image using canvas */
  const resizeImage = useCallback(() => {
    if (!preview || !width || !height) return;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      alert(`Dimensiones demasiado grandes (máximo ${MAX_DIMENSION}px)`);
      return;
    }

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      setResized(canvas.toDataURL(format, quality));
    };
  }, [preview, width, height, format, quality]);

  /** Download the resized image */
  const downloadImage = useCallback(() => {
    if (!resized) return;

    const link = document.createElement('a');
    link.href = resized;
    link.download = `resized-image.${format.split('/')[1]}`;
    link.click();
  }, [resized, format]);

  /** Reset all state */
  const reset = useCallback(() => {
    setImage(null);
    setPreview(null);
    setWidth('');
    setHeight('');
    setResized(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="resizer-container">
      <div className="card shadow p-4 resizer-card">

        <h2 className="text-center mb-4 resizer-title">
          <i className="bi bi-card-image"></i> Redimensionar imágenes
        </h2>

        {/* File upload */}
        <div className="resizer-upload-box mb-3 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="d-none"
            id="resizerFileInput"
          />
          <label htmlFor="resizerFileInput" className="resizer-upload-label">
            <i className="bi bi-arrow-bar-up"></i>
            <p>Haz clic o arrastra una imagen aquí</p>
          </label>
        </div>

        {preview && (
          <div className="row">
            {/* Left — Image previews */}
            <div className="col-md-6 text-center">
              <p className="text-muted">
                Original: {originalSize.w} × {originalSize.h}px
              </p>

              <img
                src={preview}
                alt="Vista previa original"
                className="img-fluid rounded mb-3 resizer-preview-img"
              />

              {resized && (
                <>
                  <h6>Resultado</h6>
                  <img
                    src={resized}
                    alt="Imagen redimensionada"
                    className="img-fluid rounded"
                  />
                </>
              )}
            </div>

            {/* Right — Controls */}
            <div className="col-md-6">
              <div className="mb-2">
                <label htmlFor="resizer-width">Ancho</label>
                <input
                  id="resizer-width"
                  type="number"
                  className="form-control"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>

              <div className="mb-2">
                <label htmlFor="resizer-height">Alto</label>
                <input
                  id="resizer-height"
                  type="number"
                  className="form-control"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>

              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="resizer-lock-ratio"
                  checked={lockRatio}
                  onChange={() => setLockRatio(!lockRatio)}
                />
                <label className="form-check-label" htmlFor="resizer-lock-ratio">
                  Mantener proporción
                </label>
              </div>

              <div className="mb-2">
                <label htmlFor="resizer-format">Formato</label>
                <select
                  id="resizer-format"
                  className="form-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WEBP</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="resizer-quality">Calidad: {quality}</label>
                <input
                  id="resizer-quality"
                  type="range"
                  className="form-range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
              </div>

              <div className="d-flex flex-column gap-2">
                <button className="btn btn-primary" onClick={resizeImage}>
                  Redimensionar <i className="bi bi-aspect-ratio"></i>
                </button>

                {resized && (
                  <button className="btn btn-success" onClick={downloadImage}>
                    Descargar <i className="bi bi-arrow-down-short"></i>
                  </button>
                )}

                <button className="btn btn-danger" onClick={reset}>
                  Limpiar <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}