import { useState } from "react";
import "./App.css";

export default function ContadorTexto() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const insertText = (content) => {
    setText(content);
  };

  const characterCount = text.length;

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const maxCharacters = 500;
  const progress = Math.min((characterCount / maxCharacters) * 100, 100);
  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
  };

  const loremTexts = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labor",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut dars",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt utside win",
  ];
  const loremTexts2 = ["100", "200", "300", "400", "500"];
  return (
    <section className="app-container">
      <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
        <div className="row w-100 content-wrapper g-4">
          {/* 60% - Editor */}
          <div className="col-md-7">
            <div className="card shadow-lg p-4 border-0 custom-card">
              

              <textarea
                className="form-control custom-textarea"
                rows="12"
                value={text}
                onChange={handleChange}
                placeholder="Empieza a escribir aquí..."
              ></textarea>

              <div className="mt-4">
                <div className="content-buttons">
                  <div className="d-flex justify-content-end mt-3 gap-2">
                    
                    <button
                      className="btn btn-success "
                      onClick={copyText}
                      disabled={!text}
                    >
                      Copiar texto
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => insertText("")}
                      disabled={!text}
                    >
                      Eliminar texto
                    </button>
                  </div>
                  {
                      copied && (
                        <div className="copy-message">
                          Texto copiado al portapapeles
                        </div>
                      )
                    }
                </div>
                <div className="content-text">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label m-1 fw-bold">Textos de apoyo:</label>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {loremTexts.map((item, index) => (
                      <button
                        key={index}
                        className="btn btn-primary btn-sm"
                        onClick={() => insertText(item)}
                      >
                        {loremTexts2[index]} Caracteres
                      </button>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-lg p-4 border-0 custom-card h-100 d-flex flex-column justify-content-center">
              <h4 className="text-center mb-4 fw-bold">
                Contador de caracteres y palabras
              </h4>

              <div className="stat-box">
                <p  className="fw-bold">Caracteres</p>
                <h2>{characterCount}</h2>
              </div>

              <div className="stat-box">
                <p className="fw-bold">Palabras</p>
                <h2>{wordCount}</h2>
              </div>

              <div className="mt-4">
                <p className="small text-muted">
                  Límite sugerido: {maxCharacters} caracteres
                </p>
                <div className="progress">
                  <div
                    className={`progress-bar ${
                      characterCount > maxCharacters
                        ? "bg-danger"
                        : "bg-primary"
                    }`}
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
