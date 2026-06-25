import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './NavBar.css';

/**
 * Main navigation bar with responsive hamburger menu.
 * Uses Bootstrap's collapse for mobile navigation.
 */
export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fontnav" to={ROUTES.HOME}>
          QATOOLS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.HOME}>
                Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.CHARACTER_COUNTER}>
                Contador de caracteres
              </Link>
            </li>
            <li className='nav-item'>
               <Link className="nav-link" to={ROUTES.HU_GHERKIN}>
                  Generador de casos
                </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.FILE_LIBRARY}>
                Biblioteca de archivos
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Más herramientas
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <Link className="dropdown-item" to={ROUTES.ENCODER}>
                  Encoder
                </Link>
                <Link className="dropdown-item" to={ROUTES.IMAGE_BASE64}>
                  Imagen Base64
                </Link>
                <Link className="dropdown-item" to={ROUTES.IMAGE_RESIZER}>
                  Redimensionar imagen
                </Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to={ROUTES.FILE_CONVERTER}>
                  Convertidor de archivos
                </Link>
                <Link className="dropdown-item" to={ROUTES.IMAGE_CONVERTER}>
                  Convertidor de imagen
                </Link>
                <Link className="dropdown-item" to={ROUTES.VIDEO_CONVERTER}>
                  Convertidor de video
                </Link>
               
                <Link className="dropdown-item" to={ROUTES.AUDIO_CONVERTER}>
                  Convertidor de audio
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}