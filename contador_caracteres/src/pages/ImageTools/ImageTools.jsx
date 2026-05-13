import { useState, useCallback } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './ImageTools.css';

/**
 * Image ↔ Base64 conversion tool.
 * Upload an image to get its Base64 string, or paste Base64 to preview the image.
 */
export default function ImageTools() {
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState(null);
  const { copied, copyToClipboard } = useClipboard();

  /** Handle image file upload and convert to Base64 */
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  /** Handle manual Base64 text input */
  const handleBase64Change = useCallback((e) => {
    const value = e.target.value;
    setBase64(value);
    setPreview(value.startsWith('data:image') ? value : null);
  }, []);

  /** Download the previewed image */
  const downloadImage = useCallback(() => {
    if (!preview) return;

    const link = document.createElement('a');
    link.href = preview;
    link.download = 'image.png';
    link.click();
  }, [preview]);

  /** Reset all state */
  const clearAll = useCallback(() => {
    setBase64('');
    setPreview(null);
  }, []);

  return (
    <div className="imgtools-container">
      {/* Header */}
      <div className="imgtools-header">
        <i className="bi bi-image imgtools-icon-main"></i>
        <h2 className="imgtools-title">Image ↔ Base64 Tool</h2>
        <p className="imgtools-subtitle">
          Convierte imágenes a Base64 y viceversa de forma rápida
        </p>
      </div>

      <div className="imgtools-card">
        {/* Upload */}
        <label className="imgtools-upload-box">
          <i className="bi bi-cloud-upload"></i>
          <span>Subir imagen</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </label>

        {/* Base64 textarea */}
        <div className="imgtools-textarea-group">
          <label>
            <i className="bi bi-code-slash"></i> Base64
          </label>
          <textarea
            placeholder="Pega aquí el Base64 o sube una imagen..."
            value={base64}
            onChange={handleBase64Change}
          />
        </div>

        {/* Image preview */}
        {preview && (
          <div className="imgtools-preview">
            <img src={preview} alt="Vista previa de imagen" />
          </div>
        )}

        <Toast message="Texto copiado al portapapeles" visible={copied} />

        {/* Actions */}
        <div className="imgtools-buttons">
          <button
            className="imgtools-btn imgtools-btn--copy"
            onClick={() => copyToClipboard(base64)}
            disabled={!base64}
          >
            <i className="bi bi-clipboard"></i> Copiar
          </button>

          <button
            className="imgtools-btn imgtools-btn--download"
            onClick={downloadImage}
            disabled={!preview}
          >
            <i className="bi bi-download"></i> Descargar
          </button>

          <button className="imgtools-btn imgtools-btn--clear" onClick={clearAll}>
            <i className="bi bi-trash"></i> Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}