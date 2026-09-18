import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './NavBar.css';

/**
 * Main navigation bar with transparent white logo mark and pure white brand text.
 */
export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fontnav d-flex align-items-center gap-2" to={ROUTES.HOME}>
          <div className="navbar-logo-icon">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 3V7M18 29V33M3 18H7M29 18H33M7.39 7.39L10.22 10.22M25.78 25.78L28.61 28.61M7.39 28.61L10.22 25.78M25.78 10.22L28.61 7.39" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M11 18.5L16.5 24L25.5 12" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="brand-title-white">QATOOLS</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none text-white"
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
                <i className="bi bi-house-door me-1"></i> Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.CHARACTER_COUNTER}>
                <i className="bi bi-fonts me-1"></i> Contador de caracteres
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.HU_GHERKIN}>
                <i className="bi bi-file-code me-1"></i> Generador de casos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.FILE_LIBRARY}>
                <i className="bi bi-folder2-open me-1"></i> Biblioteca
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
                <i className="bi bi-grid-3x3-gap me-1"></i> Más herramientas
              </a>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                <span className="dropdown-header text-uppercase small text-muted fw-bold">Pruebas QA & Datos</span>
                <Link className="dropdown-item" to={ROUTES.MOCK_DATA}>
                  <i className="bi bi-person-vcard me-2 text-primary"></i> Generador Datos QA (Faker)
                </Link>
                <Link className="dropdown-item" to={ROUTES.DIFF_CHECKER}>
                  <i className="bi bi-file-diff me-2 text-warning"></i> Comparador Diff (Text/JSON)
                </Link>
                <Link className="dropdown-item" to={ROUTES.REGEX_TESTER}>
                  <i className="bi bi-regex me-2 text-info"></i> Evaluador Regex
                </Link>
                <Link className="dropdown-item" to={ROUTES.DEVICE_SIMULATOR}>
                  <i className="bi bi-phone-landscape me-2 text-primary"></i> Simulador Responsive (Pantallas)
                </Link>
                <div className="dropdown-divider"></div>
                <span className="dropdown-header text-uppercase small text-muted fw-bold">Desarrollo & Seguridad API</span>
                <Link className="dropdown-item" to={ROUTES.JWT_DECODER}>
                  <i className="bi bi-key-fill me-2 text-success"></i> Inspector JWT
                </Link>
                <Link className="dropdown-item" to={ROUTES.DATA_CONVERTER}>
                  <i className="bi bi-arrow-left-right me-2 text-primary"></i> Convertidor de Datos (JSON/XML)
                </Link>
                <Link className="dropdown-item" to={ROUTES.ENCODER}>
                  <i className="bi bi-shield-lock me-2 text-danger"></i> Encoder / Decoder
                </Link>
                <div className="dropdown-divider"></div>
                <span className="dropdown-header text-uppercase small text-muted fw-bold">Multimedia & Conversión</span>
                <Link className="dropdown-item" to={ROUTES.IMAGE_BASE64}>
                  <i className="bi bi-file-earmark-code me-2 text-warning"></i> Imagen Base64
                </Link>
                <Link className="dropdown-item" to={ROUTES.IMAGE_RESIZER}>
                  <i className="bi bi-aspect-ratio me-2 text-success"></i> Redimensionar Imagen
                </Link>
                <Link className="dropdown-item" to={ROUTES.CONTRAST_CHECKER}>
                  <i className="bi bi-eye me-2 text-info"></i> Accesibilidad WCAG
                </Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to={ROUTES.FILE_CONVERTER}>
                  <i className="bi bi-file-earmark-arrow-up me-2 text-info"></i> Convertidor de archivos
                </Link>
                <Link className="dropdown-item" to={ROUTES.IMAGE_CONVERTER}>
                  <i className="bi bi-image me-2 text-warning"></i> Convertidor de imagen
                </Link>
                <Link className="dropdown-item" to={ROUTES.VIDEO_CONVERTER}>
                  <i className="bi bi-film me-2 text-danger"></i> Convertidor de video
                </Link>
                <Link className="dropdown-item" to={ROUTES.AUDIO_CONVERTER}>
                  <i className="bi bi-music-note-beamed me-2 text-success"></i> Convertidor de audio
                </Link>
              </div>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}