import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Floating footer with a link to the developer's LinkedIn profile.
 * Renders as a small circular avatar button at the bottom-left.
 */
export default function Footer() {
  const logoSrc = `${import.meta.env.BASE_URL}logodos.png`;

  return (
    <footer className="footer fixed-bottom">
      <Link
        to="https://www.linkedin.com/in/yan-harold-muñoz-dominguez-44a2a6b9"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Perfil de LinkedIn del desarrollador"
      >
        <img className="footer-img" src={logoSrc} alt="QATOOLS Logo" />
      </Link>
    </footer>
  );
}