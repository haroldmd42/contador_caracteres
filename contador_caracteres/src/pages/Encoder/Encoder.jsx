import { useState, useCallback } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './Encoder.css';

/* ────────────────────────────────────────────── */
/* Utilities */
/* ────────────────────────────────────────────── */

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

function fixEncoding(obj) {
  if (typeof obj === 'string') {
    try {
      return decodeURIComponent(escape(obj));
    } catch {
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(fixEncoding);
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        fixEncoding(value),
      ])
    );
  }

  return obj;
}

function cleanWeirdJSON(raw) {
  try {
    const input = raw.trim();

    const streamPattern = /^\d+:/m;

    // Detecta respuestas tipo:
    // 0:{...}
    // 1:{...}
    if (streamPattern.test(input)) {
      const result = {};

      input
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .forEach((line) => {
          const separator = line.indexOf(':');

          if (separator === -1) return;

          const key = line.substring(0, separator).trim();
          const value = line.substring(separator + 1).trim();

          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        });

      return JSON.stringify(fixEncoding(result), null, 2);
    }

    // JSON normal
    let cleaned = input;

    const firstBrace = cleaned.indexOf('{');

    if (firstBrace > 0) {
      cleaned = cleaned.substring(firstBrace);
    }

    const parsed = JSON.parse(cleaned);

    return JSON.stringify(fixEncoding(parsed), null, 2);
  } catch {
    return 'Debe ingresar una respuesta o JSON válido';
  }
}

/* ────────────────────────────────────────────── */
/* Component */
/* ────────────────────────────────────────────── */

export default function EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('base64');

  const { copied, copyToClipboard } = useClipboard();

  const handleEncode = useCallback(() => {
    setOutput(encode(input, type));
  }, [input, type]);

  const handleDecode = useCallback(() => {
    setOutput(decode(input, type));
  }, [input, type]);

  const handleFormatResponse = useCallback(() => {
    setOutput(cleanWeirdJSON(input));
  }, [input]);

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