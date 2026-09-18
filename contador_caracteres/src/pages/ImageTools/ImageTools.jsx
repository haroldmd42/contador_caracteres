import { useState, useCallback } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import { apiImageBase64 } from '../../services/apiService';
import './ImageTools.css';

/**
 * Image ↔ Base64 conversion tool.
 * Upload an image to get its Base64 string from backend, or paste Base64 to preview.
 */
export default function ImageTools() {
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { copied, copyToClipboard } = useClipboard();

  /** Handle image file upload and convert to Base64 via backend */
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const b64Result = await apiImageBase64(file);
      setBase64(b64Result);
      setPreview(b64Result);
    } catch (err) {
      alert(`Error procesando la imagen en el servidor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Handle manual Base64 text input and send to backend to validate/generate data URL */
  const handleBase64Change = useCallback(async (e) => {
    const value = e.target.value;
    setBase64(value);
    if (!value) {
      setPreview(null);
      return;
    }
    if (value.startsWith('data:image')) {
      setPreview(value);
    } else {
      try {
        const b64Result = await apiImageBase64(value);
        setPreview(b64Result);
      } catch {
        setPreview(null);
      }
    }
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