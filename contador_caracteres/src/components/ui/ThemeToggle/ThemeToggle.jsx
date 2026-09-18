import './ThemeToggle.css';
import { useTheme } from '../../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="theme-toggle-floating-container">
      <button
        className={`theme-toggle-btn ${isDark ? 'dark-mode' : 'light-mode'}`}
        onClick={toggleTheme}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <div className="theme-icon-wrapper">
          <i className={`bi ${isDark ? 'bi-sun-fill sun-icon' : 'bi-moon-stars-fill moon-icon'}`}></i>
        </div>
        <span className="theme-toggle-tooltip">
          {isDark ? 'Modo Claro' : 'Modo Oscuro'}
        </span>
      </button>
    </div>
  );
}
