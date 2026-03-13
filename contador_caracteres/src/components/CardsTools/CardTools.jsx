import { Link } from "react-router-dom";
import "./CardTool.css";

export function CardTools({ title, description, link }) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text text-muted small">{description}</p>
                <Link to={link} className="btn btn-primary">Ir</Link>
            </div>
        </div>
    );
}