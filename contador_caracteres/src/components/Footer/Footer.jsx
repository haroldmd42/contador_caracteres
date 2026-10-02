import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './Footer.css';

/**
 * Floating footer branding icon.
 * Renders as a small circular avatar button at the bottom-left.
 */
export default function Footer() {
  const logoSrc = `${import.meta.env.BASE_URL}logodos.png`;

  return (
    <footer className="footer fixed-bottom">
      <Link
        to={ROUTES.HOME}
        aria-label="Ir a Inicio - QATOOLS"
        title="QATOOLS - Herramientas QA"
      >
        <img className="footer-img" src={logoSrc} alt="QATOOLS Logo" />
      </Link>
    </footer>
  );
}