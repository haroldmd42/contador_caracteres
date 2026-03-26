import { useState } from "react";
import "./ImageTools.css";

export default function ImageTools() {

    const [base64, setBase64] = useState("");
    const [preview, setPreview] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setBase64(reader.result);
            setPreview(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleBase64Change = (e) => {
        const value = e.target.value;
        setBase64(value);

        if (value.startsWith("data:image")) {
            setPreview(value);
        } else {
            setPreview(null);
        }
    };

    const copyToClipboard = async () => {
        if (!base64) return;
        await navigator.clipboard.writeText(base64);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadImage = () => {
        if (!preview) return;

        const a = document.createElement("a");
        a.href = preview;
        a.download = "image.png";
        a.click();
    };

    const clearAll = () => {
        setBase64("");
        setPreview(null);
    };

    return (
        <div className="image-container">

            {/* HEADER */}
            <div className="image-header">
                <i className="bi bi-image icon-main"></i>
                <h2>Image ↔ Base64 Tool</h2>
                <p className="subtitle">
                    Convierte imágenes a Base64 y viceversa de forma rápida
                </p>
            </div>

            <div className="image-card">

                {/* UPLOAD */}
                <label className="upload-box">
                    <i className="bi bi-cloud-upload"></i>
                    <span>Subir imagen</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                    />
                </label>

                {/* TEXTAREA */}
                <div className="textarea-group">
                    <label><i className="bi bi-code-slash"></i> Base64</label>
                    <textarea
                        placeholder="Pega aquí el Base64 o sube una imagen..."
                        value={base64}
                        onChange={handleBase64Change}
                    />
                </div>

                {/* PREVIEW */}
                {preview && (
                    <div className="preview">
                        <img src={preview} alt="preview" />
                    </div>
                )}

                {/* BUTTONS */}
                {copied && (
                    <div className="copy-message">
                        Texto copiado al portapapeles
                    </div>
                )}

                <div className="buttons">
                    <button className="btn btn-success" onClick={copyToClipboard} disabled={!base64}>
                        <i className="bi bi-clipboard"></i> Copiar
                    </button>

                    <button onClick={downloadImage}>
                        <i className="bi bi-download"></i> Descargar
                    </button>

                    <button className="clear" onClick={clearAll}>
                        <i className="bi bi-trash"></i> Limpiar
                    </button>
                </div>

            </div>

        </div>
    );
}