import { useState, useMemo } from 'react';
import './ContrastChecker.css';

/** Calculate relative luminance of an RGB color according to WCAG 2.1 specs */
function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/** Convert HEX color to RGB object */
function hexToRgb(hex) {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num) || cleaned.length !== 6) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export default function ContrastChecker() {
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#0F172A');

  // Compute contrast ratio
  const contrastAnalysis = useMemo(() => {
    const rgbText = hexToRgb(textColor);
    const rgbBg = hexToRgb(bgColor);

    if (!rgbText || !rgbBg) {
      return { ratio: 0, error: 'Código de color HEX inválido' };
    }

    const lumText = getLuminance(rgbText.r, rgbText.g, rgbText.b);
    const lumBg = getLuminance(rgbBg.r, rgbBg.g, rgbBg.b);

    const L1 = Math.max(lumText, lumBg);
    const L2 = Math.min(lumText, lumBg);

    const ratio = (L1 + 0.05) / (L2 + 0.05);

    return {
      ratio: Math.round(ratio * 100) / 100,
      passAANormal: ratio >= 4.5,
      passAALarge: ratio >= 3.0,
      passAAANormal: ratio >= 7.0,
      passAAALarge: ratio >= 4.5,
      error: null
    };
  }, [textColor, bgColor]);

  const handleSwap = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  return (
    <div className="container py-5">
      <div className="header-section text-center mb-4">
        <h1><i className="bi bi-eye text-info me-2"></i>Contraste y Accesibilidad WCAG 2.1</h1>
        <p className="subtitle-text">Calcula el ratio de contraste entre texto y fondo para garantizar accesibilidad según normas WCAG AA y AAA.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-5">
          <div className="card custom-card p-4 border-0 shadow h-100">
            <h5 className="fw-bold mb-3"><i className="bi bi-palette me-2"></i>Selección de Colores</h5>

            <div className="mb-3">
              <label className="fw-semibold mb-1">Color de Texto (HEX):</label>
              <div className="input-group">
                <input type="color" className="form-control form-control-color" value={textColor} onChange={(e) => setTextColor(e.target.value.toUpperCase())} />
                <input type="text" className="form-control font-monospace" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
              </div>
            </div>

            <div className="mb-3">
              <label className="fw-semibold mb-1">Color de Fondo (HEX):</label>
              <div className="input-group">
                <input type="color" className="form-control form-control-color" value={bgColor} onChange={(e) => setBgColor(e.target.value.toUpperCase())} />
                <input type="text" className="form-control font-monospace" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
            </div>

            <button className="btn btn-outline-info w-100 mt-2" onClick={handleSwap}><i className="bi bi-arrow-down-up me-2"></i>Intercambiar Colores</button>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card custom-card p-4 border-0 shadow h-100 d-flex flex-column">
            <h5 className="fw-bold mb-3"><i className="bi bi-display me-2"></i>Vista Previa de Lectura</h5>

            <div className="p-4 rounded border flex-grow-1 d-flex flex-column justify-content-center" style={{ backgroundColor: bgColor, color: textColor, borderColor: 'var(--border-color)' }}>
              <p className="fs-4 fw-bold mb-2">Texto Grande (18pt+ / Bold):</p>
              <p className="fs-4 mb-3">Las pruebas de accesibilidad garantizan una experiencia inclusiva para todos los usuarios.</p>
              <p className="small mb-0">Texto Normal (14pt): La legibilidad del texto en pantalla es fundamental para el diseño web accesible según normas WCAG 2.1.</p>
            </div>
          </div>
        </div>
      </div>

      {!contrastAnalysis.error && (
        <div className="card custom-card p-4 border-0 shadow-lg">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 className="fw-bold mb-0"><i className="bi bi-speedometer2 me-2 text-warning"></i>Resultado del Ratio de Contraste</h4>
            <div className="display-6 fw-bold text-info">{contrastAnalysis.ratio}:1</div>
          </div>

          <div className="row g-3 text-center">
            <div className="col-sm-6 col-md-3">
              <div className={`p-3 rounded border ${contrastAnalysis.passAANormal ? 'bg-success bg-opacity-20 border-success' : 'bg-danger bg-opacity-20 border-danger'}`}>
                <h6 className="fw-bold mb-1">WCAG AA Normal</h6>
                <span className={`badge ${contrastAnalysis.passAANormal ? 'bg-success' : 'bg-danger'}`}>{contrastAnalysis.passAANormal ? 'APROBADO (>= 4.5:1)' : 'FALLIDO'}</span>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className={`p-3 rounded border ${contrastAnalysis.passAALarge ? 'bg-success bg-opacity-20 border-success' : 'bg-danger bg-opacity-20 border-danger'}`}>
                <h6 className="fw-bold mb-1">WCAG AA Grande</h6>
                <span className={`badge ${contrastAnalysis.passAALarge ? 'bg-success' : 'bg-danger'}`}>{contrastAnalysis.passAALarge ? 'APROBADO (>= 3.0:1)' : 'FALLIDO'}</span>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className={`p-3 rounded border ${contrastAnalysis.passAAANormal ? 'bg-success bg-opacity-20 border-success' : 'bg-danger bg-opacity-20 border-danger'}`}>
                <h6 className="fw-bold mb-1">WCAG AAA Normal</h6>
                <span className={`badge ${contrastAnalysis.passAAANormal ? 'bg-success' : 'bg-danger'}`}>{contrastAnalysis.passAAANormal ? 'APROBADO (>= 7.0:1)' : 'FALLIDO'}</span>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className={`p-3 rounded border ${contrastAnalysis.passAAALarge ? 'bg-success bg-opacity-20 border-success' : 'bg-danger bg-opacity-20 border-danger'}`}>
                <h6 className="fw-bold mb-1">WCAG AAA Grande</h6>
                <span className={`badge ${contrastAnalysis.passAAALarge ? 'bg-success' : 'bg-danger'}`}>{contrastAnalysis.passAAALarge ? 'APROBADO (>= 4.5:1)' : 'FALLIDO'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
