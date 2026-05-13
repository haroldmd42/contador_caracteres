import { CardTools } from '../../components/CardsTools/CardTools';
import { TOOLS } from '../../constants/tools';
import './Home.css';

/**
 * Home page — Landing with an introduction and a grid of available tools.
 */
export default function Home() {
  return (
    <div className="home-body">
      <div className="container">
        <div className="row align-items-center">

          {/* Introduction section */}
          <div className="col-md-5 intro-section">
            <h1>
              Bienvenido a <span className="fontext">QATOOLS</span>
            </h1>

            <p>
              Tu espacio con herramientas prácticas para testers.
              Simplifica tus pruebas, genera datos rápidamente y optimiza
              tu flujo de trabajo con utilidades diseñadas para QA.
            </p>

            <p className="text-muted">
              Haz tus pruebas más rápidas, simples y eficientes.
            </p>
          </div>

          {/* Tool cards grid */}
          <div className="col-md-6 offset-md-1 tools-section">
            <div className="tools-grid">
              {TOOLS.map((tool) => (
                <CardTools
                  key={tool.link}
                  title={tool.title}
                  description={tool.description}
                  link={tool.link}
                  icon={tool.icon}
                  color={tool.color}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}