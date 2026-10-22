import { Link } from "react-router-dom";
import "./CardTool.css";

export function CardTools({ title, description, link, icon, color, badge }) {
    return (
        <div className={`card-tool ${color}`}>
            {badge && (
                <span className="tool-badge">
                    {badge}
                </span>
            )}
            <div className="icon">
                <i className={`bi ${icon}`}></i>
            </div>

            <div className="content">
                <h5>{title}</h5>
                <p>{description}</p>

                {link?.startsWith('http') ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-go"
                        title="Abrir en nueva pestaña"
                    >
                        Abrir <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                ) : (
                    <Link to={link} className="btn-go">
                        Ir <i className="bi bi-arrow-right"></i>
                    </Link>
                )}
            </div>

        </div>
    );
}