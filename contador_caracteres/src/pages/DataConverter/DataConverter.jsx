import { useState, useCallback } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './DataConverter.css';

const SAMPLE_JSON = JSON.stringify([
  { id: 1, usuario: "admin_qa", email: "admin@test.com", rol: "Lead" },
  { id: 2, usuario: "tester_dev", email: "dev@test.com", rol: "Automation" }
], null, 2);

/** Convert JSON object to XML string */
function jsonToXml(obj) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
  const convert = (data, indent = '  ') => {
    if (Array.isArray(data)) {
      data.forEach(item => {
        xml += `${indent}<item>\n`;
        convert(item, indent + '  ');
        xml += `${indent}</item>\n`;
      });
    } else if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, val]) => {
        if (typeof val === 'object') {
          xml += `${indent}<${key}>\n`;
          convert(val, indent + '  ');
          xml += `${indent}</${key}>\n`;
        } else {
          xml += `${indent}<${key}>${val}</${key}>\n`;
        }
      });
    }
  };
  convert(obj);
  xml += '</root>';
  return xml;
}

/** Convert JSON object to CSV string */
function jsonToCsv(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  const headers = Object.keys(arr[0]);
  const rows = arr.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}

/** Simple YAML serializer */
function jsonToYaml(obj, indent = 0) {
  const spacing = ' '.repeat(indent);
  if (Array.isArray(obj)) {
    return obj.map(item => `${spacing}- \n${jsonToYaml(item, indent + 2)}`).join('\n');
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).map(([k, v]) => {
      if (typeof v === 'object') {
        return `${spacing}${k}:\n${jsonToYaml(v, indent + 2)}`;
      }
      return `${spacing}${k}: ${v}`;
    }).join('\n');
  }
  return `${spacing}${obj}`;
}

export default function DataConverter() {
  const [inputData, setInputData] = useState(SAMPLE_JSON);
  const [sourceFormat, setSourceFormat] = useState('json');
  const [targetFormat, setTargetFormat] = useState('xml');
  const [convertedOutput, setConvertedOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { copied, copyToClipboard } = useClipboard();

  const handleConvert = useCallback(() => {
    setErrorMessage('');
    if (!inputData.trim()) return;

    try {
      let parsedObj;
      if (sourceFormat === 'json') {
        parsedObj = JSON.parse(inputData);
      } else {
        throw new Error('Por ahora, introduce datos de origen en formato JSON para convertirlos a XML, YAML o CSV.');
      }

      let result = '';
      if (targetFormat === 'xml') {
        result = jsonToXml(parsedObj);
      } else if (targetFormat === 'csv') {
        result = jsonToCsv(Array.isArray(parsedObj) ? parsedObj : [parsedObj]);
      } else if (targetFormat === 'yaml') {
        result = jsonToYaml(parsedObj);
      } else if (targetFormat === 'json') {
        result = JSON.stringify(parsedObj, null, 2);
      }
      setConvertedOutput(result);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, [inputData, sourceFormat, targetFormat]);

  const handleDownload = () => {
    if (!convertedOutput) return;
    const blob = new Blob([convertedOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `convertido.${targetFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-5">
      <Toast message="Copiado al portapapeles" visible={copied} />
      <div className="header-section text-center mb-4">
        <h1><i className="bi bi-arrow-left-right text-primary me-2"></i>Convertidor de Estructuras de Datos</h1>
        <p className="subtitle-text">Transforma sets de datos al instante entre formatos JSON, XML, YAML y CSV.</p>
      </div>

      <div className="card custom-card p-4 border-0 shadow-lg mb-4">
        <div className="row g-3 align-items-center mb-3">
          <div className="col-md-5">
            <label className="fw-bold mb-1"><i className="bi bi-box-arrow-in-right me-1"></i>Formato de Origen:</label>
            <select className="form-select" value={sourceFormat} onChange={(e) => setSourceFormat(e.target.value)}>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="col-md-2 text-center pt-3">
            <i className="bi bi-arrow-right fs-3 text-primary d-none d-md-inline"></i>
          </div>

          <div className="col-md-5">
            <label className="fw-bold mb-1"><i className="bi bi-box-arrow-right me-1"></i>Formato de Destino:</label>
            <select className="form-select" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
              <option value="xml">XML Document</option>
              <option value="csv">CSV (Comma Separated)</option>
              <option value="yaml">YAML Struct</option>
              <option value="json">JSON Formatted</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 mb-3 flex-wrap">
          <button className="btn btn-primary" onClick={handleConvert}><i className="bi bi-arrow-repeat me-1"></i>Convertir Ahora</button>
          <button className="btn btn-outline-info" onClick={() => { setInputData(SAMPLE_JSON); setSourceFormat('json'); }}><i className="bi bi-magic me-1"></i>Cargar Ejemplo JSON</button>
          <button className="btn btn-outline-danger" onClick={() => { setInputData(''); setConvertedOutput(''); }}><i className="bi bi-trash me-1"></i>Limpiar</button>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger shadow border-0 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMessage}
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card custom-card p-3 border-0 shadow h-100">
            <label className="fw-bold mb-2"><i className="bi bi-pencil me-1"></i>Datos de Entrada ({sourceFormat.toUpperCase()})</label>
            <textarea className="form-control font-monospace" rows={12} value={inputData} onChange={(e) => setInputData(e.target.value)} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card custom-card p-3 border-0 shadow h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="fw-bold mb-0"><i className="bi bi-check-circle me-1 text-success"></i>Resultado ({targetFormat.toUpperCase()})</label>
              {convertedOutput && (
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-success" onClick={() => copyToClipboard(convertedOutput)}><i className="bi bi-clipboard me-1"></i>Copiar</button>
                  <button className="btn btn-sm btn-outline-success" onClick={handleDownload}><i className="bi bi-download me-1"></i>Descargar</button>
                </div>
              )}
            </div>
            <textarea className="form-control font-monospace flex-grow-1 code-output" rows={12} readOnly value={convertedOutput} placeholder="El resultado de la conversión aparecerá aquí..." />
          </div>
        </div>
      </div>
    </div>
  );
}
