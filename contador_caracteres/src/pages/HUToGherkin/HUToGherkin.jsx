import { useState } from "react";
import useGherkinGenerator from "../../hooks/useGherkinGenerator";
import "./HUToGherkin.css";
import Toast from "../../components/ui/Toast/Toast";
import useClipboard from "../../hooks/useClipboard";

export default function HUToGherkin() {
    const [userStory, setUserStory] = useState("");
    const [additionalData, setAdditionalData] = useState("");
    const [isExcelData, setIsExcelData] = useState(false);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const {
        loading,
        result,
        error,
        generate,
    } = useGherkinGenerator();

    const { copied, copyToClipboard } = useClipboard();

    const handleAdditionalPaste = (e) => {
        const text = e.clipboardData.getData("text/plain");

        setIsExcelData(text.includes("\t"));
        setAdditionalData(text);
    };

    const handleGenerate = () => {
        if (!userStory.trim()) {
            setToastMessage("Ingrese una Historia de Usuario válida.");
            setToastVisible(true);

            setTimeout(() => {
                setToastVisible(false);
            }, 3000);

            return;
        }

        generate(
            userStory,
            additionalData
        );
    };

    const renderExcelPreview = () => {
        const rows = additionalData
            .split("\n")
            .filter(row => row.includes("\t"));

        if (!rows.length) return null;

        return (
            <div className="excel-preview">
                <table>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.split("\t").map((cell, cellIndex) => (
                                    <td key={cellIndex}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="ai-container">

            <div className="ai-header mt-5">
                <h1>
                    <i className="bi bi-opencollective"></i>
                    {" "}HU → Gherkin AI
                </h1>

                <p>
                    Convierte historias de usuario en escenarios Gherkin utilizando IA.
                </p>
            </div>

            <div className="ai-workspace">

                {/* PANEL IZQUIERDO */}
                <div className="ai-panel">

                    <div className="panel-header">
                        Historia de Usuario
                    </div>

                    <textarea
                        className="hu-textarea"
                        value={userStory}
                        onChange={(e) => setUserStory(e.target.value)}
                        placeholder="Pegue aquí la Historia de Usuario..."
                    />

                    <div className="panel-header mt-3">
                        Datos Adicionales / Excel
                    </div>

                    <textarea
                        className="excel-textarea"
                        value={additionalData}
                        onPaste={handleAdditionalPaste}
                        onChange={(e) => {
                            setAdditionalData(e.target.value);
                            setIsExcelData(
                                e.target.value.includes("\t")
                            );
                        }}
                        placeholder="Pegue aquí tablas de Excel, reglas de negocio, criterios, matrices de datos, etc..."
                    />

                    {isExcelData && (
                        <>
                            <div className="excel-title">
                                Vista previa de tabla
                            </div>

                            {renderExcelPreview()}
                        </>
                    )}

                    <div className="panel-actions">

                        <button
                            className="btn-primary"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            <i className="bi bi-opencollective"></i>
                            {loading
                                ? " Generando..."
                                : " Generar"}
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                setUserStory("");
                                setAdditionalData("");
                                setIsExcelData(false);
                            }}
                        >
                            <i className="bi bi-trash"></i>
                            {" "}Limpiar
                        </button>

                    </div>

                </div>

                {/* PANEL DERECHO */}
                <div className="ai-panel">

                    <div className="panel-header">
                        Escenarios Generados
                    </div>

                    <pre className="result-panel">
                        {result ||
                            "Aquí aparecerá el resultado generado por la IA"}
                    </pre>

                    <div className="panel-actions">

                        <button
                            className="btn-success"
                            onClick={() => copyToClipboard(result)}
                            disabled={!result}
                        >
                            <i className="bi bi-copy"></i>
                            {" "}Copiar Resultado
                        </button>

                        <Toast
                            message="Texto copiado al portapapeles"
                            visible={copied}
                        />

                        <Toast
                            message={toastMessage}
                            visible={toastVisible}
                            type="error"
                        />

                    </div>

                </div>

            </div>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

        </div>
    );
}