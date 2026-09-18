import { useState, useMemo } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './JwtDecoder.css';

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNyb25vcyBRQSIsImFkbWluIjp0cnVlLCJyb2xlcyI6WyJRVUEiLCJBVVRPTUFUSU9OIl0sImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const { copied, copyToClipboard } = useClipboard();

  const decodedJwt = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) {
        return { error: 'El token ingresado no tiene un formato válido de 3 partes (Header.Payload.Signature)' };
      }

      const decodeBase64Url = (str) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        return JSON.parse(atob(base64));
      };

      const header = decodeBase64Url(parts[0]);
      const payload = decodeBase64Url(parts[1]);
      const signature = parts[2];

      // Check expiration
      let isExpired = false;
      let expDateStr = null;
      let iatDateStr = null;

      if (payload.exp) {
        const expMs = payload.exp * 1000;
        isExpired = Date.now() > expMs;
        expDateStr = new Date(expMs).toLocaleString();
      }

      if (payload.iat) {
        iatDateStr = new Date(payload.iat * 1000).toLocaleString();
      }

      return { header, payload, signature, isExpired, expDateStr, iatDateStr, error: null };
    } catch (err) {
      return { error: `Error al decodificar JWT: ${err.message}` };
    }
  }, [token]);

  return (
    <div className="container py-5">
      <Toast message="Copiado al portapapeles" visible={copied} />
      <div className="header-section text-center mb-4">
        <h1><i className="bi bi-key-fill text-success me-2"></i>Decodificador e Inspector JWT</h1>
        <p className="subtitle-text">Inspecciona JSON Web Tokens de forma 100% segura en tu navegador. Visualiza Header, Payload y fecha de expiración.</p>
      </div>

      <div className="card custom-card p-4 border-0 shadow-lg mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <label className="fw-bold"><i className="bi bi-pencil-square me-1"></i>Pega tu Token JWT:</label>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-info" onClick={() => setToken(SAMPLE_JWT)}><i className="bi bi-magic me-1"></i>Cargar Token Ejemplo</button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => setToken('')}><i className="bi bi-eraser me-1"></i>Limpiar</button>
          </div>
        </div>
        <textarea className="form-control font-monospace" rows={4} value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
      </div>

      {decodedJwt?.error && (
        <div className="alert alert-danger shadow border-0 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{decodedJwt.error}
        </div>
      )}

      {decodedJwt && !decodedJwt.error && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card custom-card p-3 border-0 shadow h-100">
              <h5 className="fw-bold text-info"><i className="bi bi-code me-2"></i>Header (Algoritmo y Tipo)</h5>
              <pre className="jwt-box text-info p-3 rounded font-monospace flex-grow-1 overflow-auto">{JSON.stringify(decodedJwt.header, null, 2)}</pre>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card custom-card p-3 border-0 shadow h-100">
              <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <h5 className="fw-bold text-success mb-0"><i className="bi bi-file-code me-2"></i>Payload (Claims & Datos)</h5>
                <div className="d-flex align-items-center gap-2">
                  {decodedJwt.payload.exp && (
                    <span className={`badge ${decodedJwt.isExpired ? 'bg-danger' : 'bg-success'}`}>
                      <i className={`bi ${decodedJwt.isExpired ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                      {decodedJwt.isExpired ? 'TOKEN EXPIRADO' : 'TOKEN ACTIVO'}
                    </span>
                  )}
                  <button className="btn btn-sm btn-success" onClick={() => copyToClipboard(JSON.stringify(decodedJwt.payload, null, 2))}><i className="bi bi-clipboard me-1"></i>Copiar Payload</button>
                </div>
              </div>

              {(decodedJwt.expDateStr || decodedJwt.iatDateStr) && (
                <div className="p-2 mb-2 jwt-info-strip rounded small d-flex gap-3 flex-wrap">
                  {decodedJwt.iatDateStr && <span><strong>Emitido (iat):</strong> {decodedJwt.iatDateStr}</span>}
                  {decodedJwt.expDateStr && <span><strong>Expiración (exp):</strong> {decodedJwt.expDateStr}</span>}
                </div>
              )}

              <pre className="jwt-box text-success p-3 rounded font-monospace flex-grow-1 overflow-auto">{JSON.stringify(decodedJwt.payload, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
