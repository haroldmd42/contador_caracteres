import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand fontnav " to="/">
                    QATOOOLS
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Inicio
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/contador">
                                Contador de caracteres
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/generador">
                                Biblioteca de archivos
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown"  aria-expanded="false">
                                Más herramientas
                            </a>
                            <div className="dropdown-menu">
                                <Link className="dropdown-item" to={"/encoder"}>Encoder</Link>
                                <Link className="dropdown-item" to={"/image-tools"}>Imagen Base64</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}