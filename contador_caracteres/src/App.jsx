import { useState } from "react";
import "./App.css";

export default function ContadorTexto() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [desiredCharacters, setDesiredCharacters] = useState("");

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

  const generateText = (withSpaces) => {
    const total = Number(desiredCharacters);
    if (!total || total <= 0) return;
    const sufix = `${total}`;

    const availableLength = total - sufix.length;

    if (availableLength <= 0) return;
    let baseText = loremTexts.join(" ");
    if (!withSpaces) {
      baseText = baseText.replace(/\s/g, "");
    }

    let generated = "";
    while (generated.length < availableLength) {
      generated += baseText;
    }
    generated = generated.slice(0, availableLength);
    const finaltext = generated + sufix;
    setText(finaltext);
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
          <div className="col-md-7">
            <div className="card shadow-lg p-4 border-0 custom-card ">
              
              <h4 className="text-justify mb-4 fw-bold ">
                Generador de texto
              </h4>
              <div className="mb-3 d-flex gap-1 ">
                
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control input-number"
                    required
                    placeholder="Ingresa la cantidad de caracteres"
                    value={desiredCharacters}
                    min={5}
                    onChange={(e) => setDesiredCharacters(e.target.value)}
                  />

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => setDesiredCharacters("")}
                  >
                    <i className="bi bi-eraser"></i>
                  </button>
                </div>
                <button
                  className="btn button-generate"
                  onClick={() => generateText(true)}
                >
                  Generar texto con espacios
                </button>
                <button
                  className="btn button-generate1"
                  onClick={() => generateText(false)}
                >
                  Generar texto sin espacios
                </button>
              </div>
              <textarea
                className="form-control custom-textarea"
                rows="15"
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
                      Copiar texto <i class="bi bi-copy"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => insertText("")}
                      disabled={!text}
                    >
                      Eliminar texto <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  {copied && (
                    <div className="copy-message">
                      Texto copiado al portapapeles
                    </div>
                  )}
                </div>
                <div className="content-text">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label m-1 fw-bold">
                      Textos de apoyo:
                    </label>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {loremTexts.map((item, index) => (
                      <button
                        key={index}
                        className="btn btn-sm btn-caracters"
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

              <div className="stat-box box-characters">
                <p className="fw-bold">Caracteres</p>
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
