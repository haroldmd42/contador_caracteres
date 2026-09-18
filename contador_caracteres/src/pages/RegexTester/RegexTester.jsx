import { useState, useMemo } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './RegexTester.css';

const QA_REGEX_PRESETS = [
  { name: '🇨🇴 NIT Colombia con DV (DIAN)', pattern: '^\\d{8,10}-\\d$', flags: 'g' },
  { name: '🇨🇴 Cédula Ciudadanía (CO)', pattern: '^\\d{7,10}$', flags: 'g' },
  { name: '🇨🇴 Celular Colombia (+57 3XX)', pattern: '^(?:\\+57\\s?)?3\\d{9}$', flags: 'g' },
  { name: '🇨🇴 Placa Vehicular (CO)', pattern: '^[A-Z]{3}\\d{3}|[A-Z]{3}\\d{2}[A-Z0-9]$', flags: 'gi' },
  { name: 'Email Estándar', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', flags: 'g' },
  { name: 'IPv4 Address', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', flags: 'g' },
  { name: 'Fecha (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', flags: 'g' },
  { name: 'Contraseña Fuerte (Min 8, 1 Num, 1 Mayus, 1 Spec)', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', flags: 'g' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('^\\d{8,10}-\\d$');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Ejemplos Colombia:\nNIT DIAN: 900123456-7, 800987654-1\nCédula: 1018456789\nCelular: +57 3001234567, 3109876543\nPlaca: BOG123, MOTO12A');
  const { copied, copyToClipboard } = useClipboard();

  const regexEvaluation = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [];
      let match;
      if (flags.includes('g')) {
        while ((match = regex.exec(testText)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          matches.push({ text: match[0], index: match.index, groups: match.slice(1) });
        }
      }
      return { matches, error: null };
    } catch (err) {
      return { matches: [], error: err.message };
    }
  }, [pattern, flags, testText]);

  return (
    <div className="container py-5">
      <Toast message="Copiado al portapapeles" visible={copied} />
      <div className="header-section text-center mb-4">
        <h1><i className="bi bi-regex text-orange me-2"></i>Evaluador de Expresiones Regulares (Regex QA Colombia)</h1>
        <p className="subtitle-text">Prueba y valida expresiones regulares en vivo con patrones de validación para Colombia (NIT DIAN, Cédula, Celulares, Placas) y universales.</p>
      </div>

      <div className="card custom-card p-4 border-0 shadow-lg mb-4">
        <h5 className="fw-bold mb-3"><i className="bi bi-bookmark-star me-2 text-warning"></i>Patrones QA Preestablecidos (Colombia & Universales):</h5>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {QA_REGEX_PRESETS.map((preset) => (
            <button key={preset.name} className="btn btn-sm btn-outline-primary" onClick={() => { setPattern(preset.pattern); setFlags(preset.flags); }}>
              <i className="bi bi-lightning me-1 text-warning"></i>{preset.name}
            </button>
          ))}
        </div>

        <div className="row g-3 align-items-center mb-3">
          <div className="col-md-9">
            <label className="fw-bold mb-1"><i className="bi bi-code-slash me-1"></i>Patrón Regex:</label>
            <input type="text" className="form-control font-monospace text-warning fw-bold" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Ej: ^[0-9]+$" />
          </div>
          <div className="col-md-3">
            <label className="fw-bold mb-1"><i className="bi bi-flag me-1"></i>Flags:</label>
            <input type="text" className="form-control font-monospace text-info fw-bold" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g, i, m..." />
          </div>
        </div>
      </div>

      {regexEvaluation.error && (
        <div className="alert alert-danger shadow border-0 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>Error de sintaxis Regex: {regexEvaluation.error}
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card custom-card p-4 border-0 shadow h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="fw-bold"><i className="bi bi-file-earmark-text me-1"></i>Texto de Prueba:</label>
              <span className="badge bg-primary">{regexEvaluation.matches.length} Coincidencias encontradas</span>
            </div>
            <textarea className="form-control font-monospace" rows={10} value={testText} onChange={(e) => setTestText(e.target.value)} placeholder="Pega el texto donde deseas buscar coincidencias..." />
          </div>
        </div>

        <div className="col-md-5">
          <div className="card custom-card p-4 border-0 shadow h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0"><i className="bi bi-list-check me-2 text-success"></i>Coincidencias Detalladas</h5>
              {regexEvaluation.matches.length > 0 && (
                <button className="btn btn-sm btn-success" onClick={() => copyToClipboard(regexEvaluation.matches.map(m => m.text).join('\n'))}><i className="bi bi-clipboard me-1"></i>Copiar Lista</button>
              )}
            </div>

            <div className="flex-grow-1 overflow-auto rounded p-3 font-monospace matches-container" style={{ maxHeight: '300px' }}>
              {regexEvaluation.matches.length === 0 ? (
                <p className="subtitle-text mb-0 small">No se encontraron coincidencias para el patrón ingresado.</p>
              ) : (
                regexEvaluation.matches.map((m, idx) => (
                  <div key={idx} className="mb-2 p-2 rounded match-item">
                    <span className="badge bg-success me-2">#{idx + 1}</span>
                    <strong className="text-warning">{m.text}</strong>
                    <div className="subtitle-text small">Posición: {m.index}</div>
                    {m.groups.length > 0 && m.groups.some(g => g !== undefined) && (
                      <div className="text-info small mt-1">Grupos: [{m.groups.filter(Boolean).join(', ')}]</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
