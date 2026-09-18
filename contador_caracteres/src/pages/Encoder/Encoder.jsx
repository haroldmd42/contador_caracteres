import { useState, useCallback } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import { apiEncoder } from '../../services/apiService';
import './Encoder.css';

export default function EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('base64');
  const [isLoading, setIsLoading] = useState(false);

  const { copied, copyToClipboard } = useClipboard();

  const handleEncode = useCallback(async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      const res = await apiEncoder(input, type, 'encode');
      setOutput(res);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, type]);

  const handleDecode = useCallback(async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      const res = await apiEncoder(input, type, 'decode');
      setOutput(res);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, type]);

  const handleFormatResponse = useCallback(async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      const res = await apiEncoder(input, type, 'format');
      setOutput(res);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, type]);

  const clear = useCallback(() => {
    setInput('');
    setOutput('');
  }, []);

  return (
    <div className="encoder-container">
      {/* Header */}
      <div className="encoder-header">
        <i className="bi bi-arrow-repeat encoder-icon-main"></i>

        <h2 className="encoder-title">
          Multi Encoder Tool
        </h2>

        <p className="encoder-subtitle">
          Codifica, decodifica y formatea respuestas de APIs fácilmente.
        </p>
      </div>

      <div className="encoder-card">
        {/* Selector */}
        <div className="encoder-top-bar">
          <i className="bi bi-gear"></i>

          <select
            className="encoder-selector"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="base64">Base64</option>
            <option value="url">URL</option>
            <option value="json">JSON Formatter</option>
          </select>
        </div>

        {/* Entrada */}
        <div className="encoder-textarea-group">
          <label>
            <i className="bi bi-pencil-square"></i>
            Entrada
          </label>

          <textarea
            placeholder="Pega una respuesta de API, JSON o texto a procesar..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Botones principales */}
        <div className="encoder-buttons">
          <button
            className="encoder-btn encoder-btn--primary"
            onClick={handleEncode}
          >
            <i className="bi bi-lock"></i>
            Encode
          </button>

          <button
            className="encoder-btn encoder-btn--warning"
            onClick={handleDecode}
          >
            <i className="bi bi-unlock"></i>
            Decode
          </button>

          <button
            className="encoder-btn encoder-btn--magic"
            onClick={handleFormatResponse}
          >
            <i className="bi bi-magic"></i>
            Formatear respuesta
          </button>
        </div>

        {/* Resultado */}
        <div className="encoder-textarea-group">
          <label>
            <i className="bi bi-code-slash"></i>
            Resultado
          </label>

          <textarea
            value={output}
            readOnly
          />
        </div>

        <Toast
          message="Texto copiado al portapapeles"
          visible={copied}
        />

        {/* Botones inferiores */}
        <div className="encoder-buttons">
          <button
            className="encoder-btn encoder-btn--copy"
            onClick={() => copyToClipboard(output)}
            disabled={!output}
          >
            <i className="bi bi-clipboard"></i>
            Copiar resultado
          </button>

          <button
            className="encoder-btn encoder-btn--clear"
            onClick={clear}
          >
            <i className="bi bi-trash"></i>
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}