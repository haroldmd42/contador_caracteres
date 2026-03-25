import { Link } from "react-router-dom";
import "./CardTool.css";

export function CardTools({ title, description, link, icon, color }) {
    return (
        <div className={`card-tool ${color}`}>

            <div className="icon">
                <i className={`bi ${icon}`}></i>
            </div>

            <div className="content">
                <h5>{title}</h5>
                <p>{description}</p>

                <Link to={link} className="btn-go">
                    Ir <i className="bi bi-arrow-right"></i>
                </Link>
            </div>

        </div>
    );
}