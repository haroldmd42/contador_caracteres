import { useState } from "react";
import "./Encoder.css";

export default function EncoderDecoder() {

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [type, setType] = useState("base64");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      switch (type) {
        case "base64":
          setOutput(btoa(input));
          break;
        case "url":
          setOutput(encodeURIComponent(input));
          break;
        case "json":
          setOutput(JSON.stringify(JSON.parse(input), null, 2));
          break;
        default:
          setOutput("Tipo no soportado");
      }
    } catch {
      setOutput("Error al codificar");
    }
  };

  const handleDecode = () => {
    try {
      switch (type) {
        case "base64":
          setOutput(atob(input));
          break;
        case "url":
          setOutput(decodeURIComponent(input));
          break;
        case "json":
          setOutput(JSON.stringify(JSON.parse(input), null, 2));
          break;
        default:
          setOutput("Tipo no soportado");
      }
    } catch {
      setOutput("Error al decodificar");
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="encoder-container">

      <div className="encoder-header">
        <i className="bi bi-arrow-repeat icon-main"></i>
        <h2>Multi Encoder Tool</h2>
        <p className="subtitle">
          Codifica y decodifica datos fácilmente (Base64, URL, JSON)
        </p>
      </div>

      <div className="encoder-card">

        <div className="top-bar">
          <i className="bi bi-gear"></i>
          <select
            className="selector"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="base64">Base64</option>
            <option value="url">URL</option>
            <option value="json">JSON Formatter</option>
          </select>
        </div>

        <div className="textarea-group">
          <label><i className="bi bi-pencil-square"></i> Entrada</label>
          <textarea
            placeholder="Ingresa el texto..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="buttons">
          <button onClick={handleEncode}>
            <i className="bi bi-lock"></i> Encode
          </button>

          <button onClick={handleDecode}>
            <i className="bi bi-unlock"></i> Decode
          </button>

          <button className="clear" onClick={clear}>
            <i className="bi bi-trash"></i> Limpiar
          </button>
        </div>

        <div className="textarea-group">
          <label><i className="bi bi-code-slash"></i> Resultado</label>
          <textarea value={output} readOnly />
        </div>
        {copied && (
          <div className="copy-message">
            Texto copiado al portapapeles
          </div>
        )}
        <button className="copy-btn"
          onClick={copy}
          disabled={!output}>
          <i className="bi bi-clipboard"></i> Copiar resultado
        </button>

      </div>

    </div>
  );
}