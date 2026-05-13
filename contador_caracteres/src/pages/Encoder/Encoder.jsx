import { useState, useCallback } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './Encoder.css';

/* ── Encoding / Decoding utilities ── */

/**
 * Encodes text based on the selected type.
 * @param {string} input - Raw text to encode.
 * @param {string} type  - One of 'base64', 'url', or 'json'.
 * @returns {string} Encoded result or error message.
 */
function encode(input, type) {
  try {
    switch (type) {
      case 'base64':
        return btoa(input);
      case 'url':
        return encodeURIComponent(input);
      case 'json':
        return JSON.stringify(JSON.parse(input), null, 2);
      default:
        return 'Tipo no soportado';
    }
  } catch {
    return 'Error al codificar';
  }
}

/**
 * Decodes text based on the selected type.
 * @param {string} input - Encoded text to decode.
 * @param {string} type  - One of 'base64', 'url', or 'json'.
 * @returns {string} Decoded result or error message.
 */
function decode(input, type) {
  try {
    switch (type) {
      case 'base64':
        return atob(input);
      case 'url':
        return decodeURIComponent(input);
      case 'json':
        return JSON.stringify(JSON.parse(input), null, 2);
      default:
        return 'Tipo no soportado';
    }
  } catch {
    return 'Error al decodificar';
  }
}

/**
 * Attempts to clean malformed JSON strings (e.g. with prefix, encoding issues).
 * @param {string} raw - Raw JSON-like string.
 * @returns {string} Formatted JSON or error message.
 */
function cleanWeirdJSON(raw) {
  try {
    let cleaned = raw.trim();

    // Strip prefix before first brace (e.g., "1: {...")
    const firstBrace = cleaned.indexOf('{');
    if (firstBrace !== -1) {
      cleaned = cleaned.substring(firstBrace);
    }

    const parsed = JSON.parse(cleaned);

    // Fix common latin1 → UTF-8 encoding artifacts
    const fixEncoding = (obj) => {
      if (typeof obj === 'string') {
        try {
          return decodeURIComponent(escape(obj));
        } catch {
          return obj;
        }
      }
      if (Array.isArray(obj)) return obj.map(fixEncoding);
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, fixEncoding(value)])
        );
      }
      return obj;
    };

    return JSON.stringify(fixEncoding(parsed), null, 2);
  } catch {
    return 'Debe ingresar un JSON válido para limpiar';
  }
}

/* ── Component ── */

/**
 * Encoder/Decoder page — Supports Base64, URL encoding, and JSON formatting.
 */
export default function EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('base64');
  const { copied, copyToClipboard } = useClipboard();

  const handleEncode = useCallback(() => setOutput(encode(input, type)), [input, type]);
  const handleDecode = useCallback(() => setOutput(decode(input, type)), [input, type]);
  const handleCleanJSON = useCallback(() => setOutput(cleanWeirdJSON(input)), [input]);

  const clear = useCallback(() => {
    setInput('');
    setOutput('');
  }, []);

  return (
    <div className="encoder-container">
      {/* Header */}
      <div className="encoder-header">
        <i className="bi bi-arrow-repeat encoder-icon-main"></i>
        <h2 className="encoder-title">Multi Encoder Tool</h2>
        <p className="encoder-subtitle">
          Codifica y decodifica datos fácilmente (Base64, URL, JSON)
        </p>
      </div>

      <div className="encoder-card">
        {/* Type selector */}
        <div className="encoder-top-bar">
          <i className="bi bi-gear"></i>
          <select
            className="encoder-selector"
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Tipo de codificación"
          >
            <option value="base64">Base64</option>
            <option value="url">URL</option>
            <option value="json">JSON Formatter</option>
          </select>
        </div>

        {/* Input textarea */}
        <div className="encoder-textarea-group">
          <label>
            <i className="bi bi-pencil-square"></i> Entrada
          </label>
          <textarea
            placeholder="Ingresa el texto..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Action buttons */}
        <div className="encoder-buttons">
          <button className="encoder-btn encoder-btn--primary" onClick={handleEncode}>
            <i className="bi bi-lock"></i> Encode
          </button>
          <button className="encoder-btn encoder-btn--warning" onClick={handleDecode}>
            <i className="bi bi-unlock"></i> Decode
          </button>
          <button className="encoder-btn encoder-btn--magic" onClick={handleCleanJSON}>
            <i className="bi bi-magic"></i> Limpiar JSON
          </button>
        </div>

        {/* Output textarea */}
        <div className="encoder-textarea-group">
          <label>
            <i className="bi bi-code-slash"></i> Resultado
          </label>
          <textarea value={output} readOnly />
        </div>

        <Toast message="Texto copiado al portapapeles" visible={copied} />

        {/* Copy & Clear */}
        <div className="encoder-buttons">
          <button
            className="encoder-btn encoder-btn--copy"
            onClick={() => copyToClipboard(output)}
            disabled={!output}
          >
            <i className="bi bi-clipboard"></i> Copiar resultado
          </button>
          <button className="encoder-btn encoder-btn--clear" onClick={clear}>
            <i className="bi bi-trash"></i> Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}