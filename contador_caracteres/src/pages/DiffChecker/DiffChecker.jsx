import { useState, useMemo } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './DiffChecker.css';

export default function DiffChecker() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const { copied, copyToClipboard } = useClipboard();

  // Pretty format JSON if valid
  const handleFormatJson = () => {
    try {
      if (textA.trim()) setTextA(JSON.stringify(JSON.parse(textA), null, 2));
      if (textB.trim()) setTextB(JSON.stringify(JSON.parse(textB), null, 2));
    } catch {
      // Keep raw if not valid JSON
    }
  };

  // Compute line-by-line differences
  const diffResult = useMemo(() => {
    if (!textA && !textB) return { lines: [], added: 0, removed: 0, unchanged: 0 };
    
    const linesA = textA.split(/\r?\n/);
    const linesB = textB.split(/\r?\n/);
    const maxLen = Math.max(linesA.length, linesB.length);
    const resultLines = [];
    let added = 0;
    let removed = 0;
    let unchanged = 0;

    for (let i = 0; i < maxLen; i++) {
      const lineA = linesA[i];
      const lineB = linesB[i];

      if (lineA === undefined) {
        resultLines.push({ type: 'added', lineB, lineA: '', numB: i + 1, numA: '' });
        added++;
      } else if (lineB === undefined) {
        resultLines.push({ type: 'removed', lineA, lineB: '', numA: i + 1, numB: '' });
        removed++;
      } else if (lineA === lineB) {
        resultLines.push({ type: 'unchanged', lineA, lineB, numA: i + 1, numB: i + 1 });
        unchanged++;
      } else {
        resultLines.push({ type: 'modified', lineA, lineB, numA: i + 1, numB: i + 1 });
        added++;
        removed++;
      }
    }

    return { lines: resultLines, added, removed, unchanged };
  }, [textA, textB]);

  return (
    <div className="container py-5">
      <Toast message="Copiado al portapapeles" visible={copied} />
      <div className="header-section text-center mb-4">
        <h1><i className="bi bi-file-diff text-warning me-2"></i>Comparador Diff (Text & JSON)</h1>
        <p className="subtitle-text">Compara respuestas de API, payloads o textos lado a lado e identifica adiciones y cambios al instante.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card custom-card p-3 border-0 shadow">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="fw-bold"><i className="bi bi-file-earmark-text me-1 text-primary"></i>Texto / JSON Original (A)</label>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setTextA('')}>Limpiar A</button>
            </div>
            <textarea className="form-control font-monospace" rows={8} value={textA} onChange={(e) => setTextA(e.target.value)} placeholder="Pega aquí el texto original o respuesta esperada..." />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card custom-card p-3 border-0 shadow">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="fw-bold"><i className="bi bi-file-earmark-diff me-1 text-warning"></i>Texto / JSON Modificado (B)</label>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setTextB('')}>Limpiar B</button>
            </div>
            <textarea className="form-control font-monospace" rows={8} value={textB} onChange={(e) => setTextB(e.target.value)} placeholder="Pega aquí el texto modificado o respuesta recibida..." />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button className="btn btn-primary" onClick={handleFormatJson}><i className="bi bi-magic me-2"></i>Formatear JSON en ambos campos</button>
        <button className="btn btn-danger" onClick={() => { setTextA(''); setTextB(''); }}><i className="bi bi-trash me-2"></i>Limpiar Todo</button>
      </div>

      {(textA || textB) && (
        <div className="card custom-card p-4 border-0 shadow-lg">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 className="fw-bold mb-0"><i className="bi bi-eye me-2"></i>Vista Previa de Diferencias</h4>
            <div className="d-flex gap-2">
              <span className="badge bg-success">+ {diffResult.added} Adiciones/Cambios</span>
              <span className="badge bg-danger">- {diffResult.removed} Eliminaciones</span>
              <span className="badge bg-secondary">= {diffResult.unchanged} Sin Cambios</span>
            </div>
          </div>

          <div className="diff-viewer border border-secondary rounded p-2 font-monospace overflow-auto" style={{ maxHeight: '450px' }}>
            {diffResult.lines.map((item, idx) => (
              <div key={idx} className={`d-flex diff-row ${item.type}`}>
                <span className="text-muted me-3 user-select-none" style={{ minWidth: '40px' }}>{item.numA || ' '}</span>
                <span className="text-muted me-3 user-select-none" style={{ minWidth: '40px' }}>{item.numB || ' '}</span>
                <span className="diff-content flex-grow-1">
                  {item.type === 'modified' ? (
                    <div>
                      <div className="text-danger-custom">- {item.lineA}</div>
                      <div className="text-success-custom">+ {item.lineB}</div>
                    </div>
                  ) : (
                    <span>
                      {item.type === 'added' && '+ '}
                      {item.type === 'removed' && '- '}
                      {item.type === 'unchanged' && '  '}
                      {item.type === 'added' ? item.lineB : item.lineA}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
