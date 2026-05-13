import { useState, useCallback } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import { LOREM_SAMPLES, DEFAULT_MAX_CHARACTERS } from '../../constants/loremData';
import './CounterText.css';

/**
 * Character counter & text generator page.
 * Provides a textarea with character/word counting and Lorem Ipsum generation.
 */
export default function CounterText() {
  const [text, setText] = useState('');
  const [desiredCharacters, setDesiredCharacters] = useState('');
  const { copied, copyToClipboard } = useClipboard();

  /* ── Derived values ── */
  const characterCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const progress = Math.min((characterCount / DEFAULT_MAX_CHARACTERS) * 100, 100);

  /* ── Handlers ── */
  const handleChange = useCallback((e) => setText(e.target.value), []);

  const clearText = useCallback(() => setText(''), []);

  const generateText = useCallback(
    (withSpaces) => {
      const total = Number(desiredCharacters);
      if (!total || total <= 0) return;

      const suffix = `${total}`;
      const availableLength = total - suffix.length;
      if (availableLength <= 0) return;

      let baseText = LOREM_SAMPLES.map((s) => s.text).join(' ');
      if (!withSpaces) {
        baseText = baseText.replace(/\s/g, '');
      }

      let generated = '';
      while (generated.length < availableLength) {
        generated += baseText;
      }

      setText(generated.slice(0, availableLength) + suffix);
    },
    [desiredCharacters]
  );

  return (
    <section className="app-container">
      <Toast message="Texto copiado al portapapeles" visible={copied} />

      <div className="container-fluid">
        <div className="row content-wrapper g-4 align-items-stretch">

          {/* Text generator card */}
          <div className="col-lg-7 col-md-12 container-card-layout">
            <div className="card shadow-lg p-4 border-0 custom-card">

              <h4 className="mb-3 fw-bold">Generador de texto</h4>

              {/* Character amount input + generate buttons */}
              <div className="mb-3 d-flex gap-2 flex-wrap">
                <div className="input-group input-number">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Cantidad de caracteres"
                    value={desiredCharacters}
                    min={5}
                    onChange={(e) => setDesiredCharacters(e.target.value)}
                  />
                  <button
                    className="btn btn-danger btn-clear"
                    onClick={() => setDesiredCharacters('')}
                    aria-label="Limpiar cantidad"
                  >
                    <i className="bi bi-eraser"></i>
                  </button>
                </div>

                <button
                  className="btn button-generate"
                  onClick={() => generateText(true)}
                >
                  Con espacios
                </button>

                <button
                  className="btn button-generate-no-spaces"
                  onClick={() => generateText(false)}
                >
                  Sin espacios
                </button>
              </div>

              <textarea
                className="form-control custom-textarea"
                value={text}
                rows="9"
                onChange={handleChange}
                placeholder="Empieza a escribir aquí..."
              />

              <div className="mt-3">
                <div className="d-flex justify-content-end gap-2 flex-wrap">
                  <button
                    className="btn btn-success"
                    onClick={() => copyToClipboard(text)}
                    disabled={!text}
                  >
                    Copiar texto <i className="bi bi-copy"></i>
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={clearText}
                    disabled={!text}
                  >
                    Eliminar texto <i className="bi bi-trash"></i>
                  </button>
                </div>

                {/* Preset Lorem samples */}
                <div className="mt-3">
                  <label className="fw-bold mb-2">Textos de apoyo:</label>

                  <div className="d-flex flex-wrap gap-2">
                    {LOREM_SAMPLES.map((sample) => (
                      <button
                        key={sample.label}
                        className="btn btn-sm btn-caracters"
                        onClick={() => setText(sample.text)}
                      >
                        {sample.label} caracteres
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics card */}
          <div className="col-lg-5 col-md-12 container-card-stats">
            <div className="card shadow-lg p-4 border-0 custom-card stats-card">

              <h4 className="text-center mb-4 fw-bold">
                Contador de caracteres y palabras
              </h4>

              <div className="stat-box">
                <p>Caracteres</p>
                <h2>{characterCount}</h2>
              </div>

              <div className="stat-box">
                <p>Palabras</p>
                <h2>{wordCount}</h2>
              </div>

              <div className="mt-3">
                <p className="small text-muted">
                  Límite sugerido: {DEFAULT_MAX_CHARACTERS}
                </p>

                <div className="progress">
                  <div
                    className={`progress-bar ${
                      characterCount > DEFAULT_MAX_CHARACTERS
                        ? 'bg-danger'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={characterCount}
                    aria-valuemin={0}
                    aria-valuemax={DEFAULT_MAX_CHARACTERS}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}