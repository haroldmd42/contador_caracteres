import React, { useState, useMemo } from 'react';

/**
 * Interactive technical glossary component.
 * Allows searching, category filtering, copying definitions,
 * and listening to each term definition out loud.
 */
export default function CourseGlossary({ glossary = [], speech, course }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedTerm, setCopiedTerm] = useState(null);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(glossary.map((g) => g.category));
    return ['all', ...Array.from(cats)];
  }, [glossary]);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return glossary.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.enTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [glossary, searchTerm, selectedCategory]);

  const handleListenTerm = (item) => {
    if (!speech?.speak) return;
    const text = `${item.term}. En inglés, ${item.enTerm}. Categoría: ${item.category}. Definición: ${item.definition}`;
    speech.speak(text);
  };

  const handleCopyDefinition = (item) => {
    const textToCopy = `${item.term} (${item.enTerm}) [${item.category}]: ${item.definition}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedTerm(item.term);
        setTimeout(() => setCopiedTerm(null), 2000);
      }).catch(() => {});
    }
  };

  const glossaryTitle = course?.badge
    ? `Glosario Técnico Integral (${course.badge})`
    : 'Glosario Técnico Especializado';

  const glossaryDesc = course?.title
    ? `Vocabulario técnico y definiciones canónicas alineadas al programa de ${course.title}.`
    : 'Vocabulario técnico canónico para pruebas de software y aseguramiento de calidad.';

  return (
    <div className="course-glossary-container">
      {/* Glossary Header */}
      <div className="glossary-header-card p-4 rounded-4 shadow-sm border bg-card mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <span className="badge bg-info-subtle text-info border border-info-subtle px-3 py-1.5 rounded-pill fw-semibold">
              <i className="bi bi-book-half me-1"></i> Glosario Especializado
            </span>
            <h3 className="glossary-main-title mt-2 mb-1 fw-bold text-contrast-primary">
              {glossaryTitle}
            </h3>
            <p className="text-muted small mb-0">
              {glossaryDesc}
            </p>
          </div>

          <div className="text-end text-muted small">
            <span className="badge bg-surface-elevated text-secondary border px-3 py-1.5 rounded-pill fw-semibold">
              <strong className="text-contrast-primary">{filteredTerms.length}</strong> de {glossary.length} términos
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="search-wrapper mb-3 position-relative">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control search-input rounded-pill ps-5 pe-4 py-2"
            placeholder="Buscar término (ej. QA, Testing, Límite, Regresión, Defecto, Gherkin)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${
                selectedCategory === cat ? 'btn-primary text-white shadow-sm' : 'btn-outline-secondary'
              } rounded-pill px-3 py-1 small fw-medium transition-all`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Todos los términos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="row g-3">
        {filteredTerms.length === 0 ? (
          <div className="col-12 text-center py-5 bg-card rounded-4 border">
            <i className="bi bi-search text-muted fs-1"></i>
            <h5 className="mt-2 fw-bold">No se encontraron términos coincidentes</h5>
            <p className="text-muted small">Prueba con otra palabra clave o selecciona otra categoría.</p>
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Ver todos los términos
            </button>
          </div>
        ) : (
          filteredTerms.map((item, idx) => (
            <div key={idx} className="col-12 col-md-6">
              <div className="glossary-term-card h-100 p-4 rounded-4 shadow-sm border bg-card d-flex flex-column justify-content-between transition-all hover-lift">
                <div>
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle small rounded-pill px-2.5 py-1 fw-semibold">
                      {item.category}
                    </span>
                    <div className="d-flex align-items-center gap-1.5">
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle control-circle"
                        onClick={() => handleCopyDefinition(item)}
                        title={copiedTerm === item.term ? '¡Copiado!' : 'Copiar término y definición'}
                      >
                        <i className={`bi ${copiedTerm === item.term ? 'bi-check2 text-success' : 'bi-clipboard'}`}></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary rounded-circle control-circle"
                        onClick={() => handleListenTerm(item)}
                        title={`Escuchar definición de ${item.term}`}
                      >
                        <i className="bi bi-volume-up"></i>
                      </button>
                    </div>
                  </div>

                  <h5 className="term-title fw-bold mb-1 text-contrast-primary">
                    {item.term}
                  </h5>
                  <div className="term-en-subtitle text-muted small fst-italic mb-3">
                    <i className="bi bi-translate me-1"></i> {item.enTerm}
                  </div>

                  <p className="term-definition text-secondary small lh-base mb-0">
                    {item.definition}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
