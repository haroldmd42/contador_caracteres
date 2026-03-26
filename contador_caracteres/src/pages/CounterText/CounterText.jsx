import "./CounterText.css";
import { useState } from "react";

export default function CounterText() {
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

    const wordCount =
        text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

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
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmodt",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
    ];

    const loremTexts2 = ["100", "200", "300", "400", "500"];

    return (
        <section className="app-container">
            {copied && (
                <div className="copy-message">
                    Texto copiado al portapapeles
                </div>
            )}
            <div className="container-fluid">

                <div className="row content-wrapper g-4 align-items-stretch">

                    {/* CARD GENERADOR */}
                    <div className="col-lg-7 col-md-12 container-card-layout">

                        <div className="card shadow-lg p-4 border-0 custom-card">

                            <h4 className="mb-3 fw-bold">
                                Generador de texto
                            </h4>

                            <div className="mb-3 d-flex gap-2 flex-wrap">

                                <div className="input-group input-number ">
                                    <input
                                        type="number"
                                        
                                        className="form-control"
                                        placeholder="Cantidad de caracteres"
                                        value={desiredCharacters}
                                        min={5}
                                        onChange={(e) =>
                                            setDesiredCharacters(e.target.value)
                                        }
                                    />

                                    <button
                                        className="btn btn-danger btn-clear"
                                        onClick={() => setDesiredCharacters("")}
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
                                    className="btn button-generate1"
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
                            ></textarea>

                            <div className="mt-3">

                                <div className="d-flex justify-content-end gap-2 flex-wrap">

                                    <button
                                        className="btn btn-success"
                                        onClick={copyText}
                                        disabled={!text}
                                    >
                                        Copiar texto <i className="bi bi-copy"></i>
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => insertText("")}
                                        disabled={!text}
                                    >
                                        Eliminar texto <i className="bi bi-trash"></i>
                                    </button>
                                </div>



                                <div className="mt-3">

                                    <label className="fw-bold mb-2">
                                        Textos de apoyo:
                                    </label>

                                    <div className="d-flex flex-wrap gap-2">

                                        {loremTexts.map((item, index) => (
                                            <button
                                                key={index}
                                                className="btn btn-sm btn-caracters"
                                                onClick={() => insertText(item)}
                                            >
                                                {loremTexts2[index]} caracteres
                                            </button>
                                        ))}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* CARD ESTADISTICAS */}
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
                                    Límite sugerido: {maxCharacters}
                                </p>

                                <div className="progress">

                                    <div
                                        className={`progress-bar ${characterCount > maxCharacters
                                                ? "bg-danger"
                                                : "bg-primary"
                                            }`}
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