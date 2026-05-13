import DropFiles from '../../components/DropFiles/DropFiles';
import { FILE_CATEGORIES } from '../../constants/fileLibrary';
import './FileLibrary.css';

/**
 * File Library page — Displays downloadable test files organized by type.
 * Useful for QA testers validating upload limits and file type handling.
 */
export default function FileLibrary() {
  return (
    <div className="library-body container">
      <div className="text-center header-section">
        <h1>Biblioteca de archivos</h1>

        <p className="library-subtitle">
          Explora y descarga archivos de prueba en diferentes formatos y tamaños.
          Ideales para validar cargas, límites de peso y pruebas funcionales.
        </p>
      </div>

      <div className="row g-4 mt-3">
        {FILE_CATEGORIES.map((category) => (
          <div key={category.type} className="col-lg-3 col-md-6">
            <DropFiles
              title={category.title}
              type={category.type}
              files={category.files}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
