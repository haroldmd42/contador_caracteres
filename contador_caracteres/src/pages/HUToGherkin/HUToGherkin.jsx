import { useState } from "react";
import useGherkinGenerator from "../../hooks/useGherkinGenerator";
import "./HUToGherkin.css";
import Toast from "../../components/ui/Toast/Toast";
import useClipboard from "../../hooks/useClipboard";
import { exportToExcel } from "../../utils/exportExcel";
import AzureDevOpsModal from "../../components/AzureDevOpsModal/AzureDevOpsModal";

export default function HUToGherkin() {
    const [userStory, setUserStory] = useState("");
    const [additionalData, setAdditionalData] = useState("");
    const [isExcelData, setIsExcelData] = useState(false);
    const [mode, setMode] = useState("gherkin");
    const [framework, setFramework] = useState("cypress");
    const [isAdoModalOpen, setIsAdoModalOpen] = useState(false);


    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const {
        loading,
        result,
        error,
        generate,
        clearResult,
    } = useGherkinGenerator();

    const { copied, copyToClipboard } = useClipboard();

    const handleModeChange = (newMode) => {
        setMode(newMode);
        clearResult();
    };

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
            additionalData,
            mode,
            framework
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

    const getDownloadButtonLabel = () => {
        if (mode === "automation") {
            return framework === "playwright" ? "Descargar Script (.spec.ts)" : "Descargar Script (.cy.js)";
        }
        if (mode === "matrix") {
            return "Descargar Excel (Matriz)";
        }
        return "Descargar Excel (Gherkin)";
    };

    return (
        <div className="ai-container">

            <div className="ai-header mt-4">
                <h1>
                    <i className="bi bi-robot"></i>
                    {" "}Suite IA para QA (Gherkin, Matrix & Automation)
                </h1>

                <p>
                    Genera escenarios Gherkin, matrices de prueba completas o scripts de automatización Cypress/Playwright usando IA.
                </p>
            </div>

            {/* Sub-modos Selector */}
            <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
                <button
                    className={`btn ${mode === 'gherkin' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleModeChange('gherkin')}
                >
                    <i className="bi bi-file-code me-1"></i> Escenarios Gherkin
                </button>
                <button
                    className={`btn ${mode === 'matrix' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleModeChange('matrix')}
                >
                    <i className="bi bi-table me-1"></i> Matriz de Pruebas (Excel)
                </button>
                <button
                    className={`btn ${mode === 'automation' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleModeChange('automation')}
                >
                    <i className="bi bi-cpu me-1"></i> Script Automatizado
                </button>
            </div>

            {mode === 'automation' && (
                <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                    <label className="fw-bold mb-0">Framework Target:</label>
                    <select
                        className="form-select"
                        style={{ maxWidth: '260px' }}
                        value={framework}

                        onChange={(e) => {
                            setFramework(e.target.value);
                            clearResult();
                        }}
                    >
                        <option value="cypress">Cypress (JavaScript)</option>
                        <option value="playwright">Playwright (TypeScript)</option>
                    </select>
                </div>
            )}

            <div className="ai-workspace">

                {/* PANEL IZQUIERDO */}
                <div className="ai-panel">

                    <div className="panel-content">

                        <div className="panel-header d-flex justify-content-between align-items-center">
                            <span>Historia de Usuario</span>
                            <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => setIsAdoModalOpen(true)}
                                title="Importar desde Azure DevOps API"
                            >
                                <i className="bi bi-microsoft me-1"></i> Azure DevOps
                            </button>
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
                                setIsExcelData(e.target.value.includes("\t"));
                            }}
                            placeholder="Pegue aquí tablas de Excel..."
                        />

                        {isExcelData && (
                            <>
                                <div className="excel-title">
                                    Vista previa de tabla
                                </div>

                                {renderExcelPreview()}
                            </>
                        )}

                    </div>
                    <div className="panel-actions">

                        <button
                            className="btn btn-primary"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            <i className="bi bi-cpu-fill"></i>
                            {loading
                                ? " Generando..."
                                : " Generar Con IA"}
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                setUserStory("");
                                setAdditionalData("");
                                setIsExcelData(false);
                                clearResult();
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
                        Resultado Generado ({mode.toUpperCase()})
                    </div>

                    <div className="result-container">
                        <pre className="result-panel">
                            {result || "Aquí aparecerá el resultado generado por la IA"}
                        </pre>
                    </div>
                    <div className="panel-actions">

                        <button
                            className="btn btn-success"
                            onClick={() => copyToClipboard(result)}
                            disabled={!result}
                        >
                            <i className="bi bi-copy"></i>
                            {" "}Copiar Resultado
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => exportToExcel(result, mode, framework)}
                            disabled={!result}
                        >
                            <i className={`bi ${mode === 'automation' ? 'bi-download' : 'bi-file-earmark-excel'}`}></i>
                            {" "}{getDownloadButtonLabel()}
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

            <AzureDevOpsModal
                isOpen={isAdoModalOpen}
                onClose={() => setIsAdoModalOpen(false)}
                onImportUserStory={(story, meta) => {
                    setUserStory(story);
                    if (meta) setAdditionalData(meta);
                }}
            />
        </div>
    );
}