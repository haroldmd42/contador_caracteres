import { CardTools } from "../../components/CardsTools/CardTools";
import "./Home.css";

export default function Home() {

    const tools = [
        {
            title: "Contador de caracteres",
            description: "Cuenta caracteres, palabras y analiza tus textos.",
            link: "/contador"
        },
        {
            title: "Biblioteca de archivos",
            description: "Encuentra archivos de prueba con diferentes tamaños.",
            link: "/generador"
        },
    ];

    return (
        <div className="home-body">

            <div className="container">

                <div className="row align-items-center">

                    {/* TEXTO */}
                    <div className="col-md-5 intro-section">

                        <h1>Bienvenido a QA Tools</h1>

                        <p>
                            Tu espacio con herramientas prácticas para testers.
                            Simplifica tus pruebas, genera datos rápidamente y optimiza
                            tu flujo de trabajo con utilidades diseñadas para QA.
                        </p>

                        <p className="text-muted">
                            Haz tus pruebas más rápidas, simples y eficientes.
                        </p>

                    </div>

                    {/* CARDS */}
                    <div className="col-md-6 offset-md-1 tools-section">

                        <div className="tools-grid">

                            {tools.map((tool, index) => (
                                <CardTools
                                    key={index}
                                    title={tool.title}
                                    description={tool.description}
                                    link={tool.link}
                                />
                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}