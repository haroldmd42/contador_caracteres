import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CardTools } from '../../components/CardsTools/CardTools';
import { TOOLS } from '../../constants/tools';
import { ROUTES } from '../../constants/routes';
import './Home.css';

/**
 * Filter categories for the dashboard header.
 * Academia & Cursos is placed at the end.
 */
const CATEGORIES = [
  { id: 'all', label: 'Ver Todo', icon: 'bi-grid-fill', badge: '18' },
  { id: 'ia', label: 'Inteligencia Artificial', icon: 'bi-robot', badge: 'IA' },
  { id: 'simulators', label: 'Simuladores QA', icon: 'bi-phone-landscape-fill', badge: 'Multi-device' },
  { id: 'qa', label: 'Pruebas & Datos QA', icon: 'bi-patch-check-fill', badge: 'Testing' },
  { id: 'dev', label: 'Desarrollo & APIs', icon: 'bi-code-slash', badge: 'APIs' },
  { id: 'converter', label: 'Conversión & Multimedia', icon: 'bi-arrow-repeat', badge: 'Archivos' },
  { id: 'courses', label: 'Academia & Cursos', icon: 'bi-mortarboard-fill', badge: 'ISTQB®' },
];

/**
 * Home page — Highly organized modular dashboard.
 * Order of sections:
 * 1. Inteligencia Artificial para QA
 * 2. Simuladores & Responsive Testing
 * 3. Pruebas QA & Datos de Prueba
 * 4. Desarrollo, APIs & Seguridad
 * 5. Módulos de Conversión & Multimedia
 * 6. Academia & Cursos QA (ISTQB) — At the end
 */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Map route links to custom colors and classes for core converter cards
  const getPremiumCardMeta = (link) => {
    switch (link) {
      case ROUTES.FILE_CONVERTER:
        return { styleClass: 'doc', badgeText: 'Documentos' };
      case ROUTES.IMAGE_CONVERTER:
        return { styleClass: 'img', badgeText: 'Imágenes' };
      case ROUTES.VIDEO_CONVERTER:
        return { styleClass: 'vid', badgeText: 'Video' };
      case ROUTES.AUDIO_CONVERTER:
        return { styleClass: 'aud', badgeText: 'Audio' };
      default:
        return { styleClass: 'doc', badgeText: 'Conversor' };
    }
  };

  // Group tools by categorized sections for structured display
  const toolsByCategory = useMemo(() => {
    return {
      courses: TOOLS.filter(t => t.category === 'courses'),
      ia: TOOLS.filter(t => t.category === 'ia'),
      simulators: TOOLS.filter(t => t.category === 'simulators'),
      qa: TOOLS.filter(t => t.category === 'qa'),
      dev: TOOLS.filter(t => t.category === 'dev'),
      converter: TOOLS.filter(t => t.category === 'converter'),
    };
  }, []);

  // Primary 4 converters with custom card layout
  const primaryConverters = useMemo(() => {
    return [
      ROUTES.FILE_CONVERTER,
      ROUTES.IMAGE_CONVERTER,
      ROUTES.VIDEO_CONVERTER,
      ROUTES.AUDIO_CONVERTER,
    ].map(link => TOOLS.find(t => t.link === link)).filter(Boolean);
  }, []);

  // Auxiliary media converters
  const mediaUtilities = useMemo(() => {
    return [
      ROUTES.IMAGE_RESIZER,
      ROUTES.IMAGE_BASE64,
    ].map(link => TOOLS.find(t => t.link === link)).filter(Boolean);
  }, []);

  // Filter tools based on search query and selected category tab
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const isBrowsingDefaultDashboard = useMemo(() => {
    return !searchQuery && selectedCategory === 'all';
  }, [searchQuery, selectedCategory]);

  return (
    <div className="home-dashboard">
      {/* Premium Hero Section */}
      <header className="hero-section text-center">
        <div className="container">
          <span className="hero-badge">Herramientas Profesionales para aumentar tu Productividad</span>
          <h1 className="hero-title">
            Herramientas esenciales para <span className="text-gradient">QA y desarrolladores</span>
          </h1>
          <p className="hero-subtitle">
            Optimiza tu flujo de trabajo con utilidades diseñadas para pruebas, automatización, desarrollo y productividad. Formación ISTQB, simulación responsive, IA y convertidores en tu navegador.
          </p>

          {/* Search bar */}
          <div className="search-container col-md-8 col-lg-6 mx-auto">
            <div className="search-wrapper">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Busca por nombre o función (ej: ISTQB, Faker, Regex, JWT, video)..."
                className="form-control search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar herramientas"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content & Categorized Tools */}
      <main className="container dashboard-content">
        {/* Category Filters Bar */}
        <div className="filters-container d-flex flex-wrap justify-content-center gap-2 mb-5 mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn d-flex align-items-center gap-2 ${
                selectedCategory === cat.id ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <i className={`bi ${cat.icon}`}></i>
              <span>{cat.label}</span>
              {cat.badge && <span className="filter-count-badge">{cat.badge}</span>}
            </button>
          ))}
        </div>

        {/* Dashboard layouts */}
        {isBrowsingDefaultDashboard ? (
          /* ============================================================
             PREMIUM ORGANIZED MODULAR VIEW (ALL SECTIONS)
             ============================================================ */
          <div className="d-flex flex-column gap-5">
            {/* 1. SECCIÓN: INTELIGENCIA ARTIFICIAL PARA QA */}
            <section className="dashboard-section" id="section-ia">
              <div className="section-header-box mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="section-icon-badge ai-badge">
                    <i className="bi bi-robot"></i>
                  </span>
                  <h3 className="section-title-premium mb-0">Inteligencia Artificial para QA</h3>
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill ms-2">
                    IA Engine
                  </span>
                </div>
                <p className="section-subtitle-text mb-0">
                  Generación automatizada de casos de prueba, escenarios BDD Gherkin y matrices de trazabilidad con modelos de IA.
                </p>
              </div>

              <div className="featured-showcase-card ai-showcase">
                <div className="row align-items-center g-4">
                  <div className="col-lg-8">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                      <span className="showcase-pill-badge bg-danger-subtle text-danger">
                        <i className="bi bi-file-earmark-code me-1"></i> BDD & Gherkin
                      </span>
                      <span className="showcase-pill-badge bg-warning-subtle text-warning">
                        <i className="bi bi-table me-1"></i> Matriz de Cobertura
                      </span>
                      <span className="showcase-pill-badge bg-info-subtle text-info">
                        <i className="bi bi-microsoft me-1"></i> Azure DevOps Ready
                      </span>
                    </div>

                    <h4 className="showcase-card-title mb-3">
                      Suite IA para QA: Historias de Usuario a Casos de Prueba
                    </h4>
                    <p className="showcase-card-desc mb-4">
                      Convierte cualquier requerimiento o historia de usuario en escenarios estructurados en formato Given-When-Then, matriz de pruebas de regresión con precondiciones y pasos, y scripts automatizados exportables directamente a Excel y Azure DevOps.
                    </p>

                    <div className="showcase-highlights-grid mb-4">
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-danger"></i>
                        <span>Escenarios BDD Gherkin con múltiples criterios</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-danger"></i>
                        <span>Matriz con prioridad y tipos de prueba funcionales</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-danger"></i>
                        <span>Generación de scripts Cypress y Playwright</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-danger"></i>
                        <span>Exportación directa a formato Azure DevOps (.csv/.xlsx)</span>
                      </div>
                    </div>

                    <Link to={ROUTES.HU_GHERKIN} className="btn btn-danger px-4 py-2.5 rounded-pill fw-semibold d-inline-flex align-items-center gap-2 shadow-sm">
                      <span>Generar Casos con Inteligencia Artificial</span>
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>

                  <div className="col-lg-4 text-center">
                    <div className="ai-visual-card p-4 rounded-4">
                      <div className="ai-visual-icon mb-3">
                        <i className="bi bi-cpu-fill fs-1 text-danger"></i>
                      </div>
                      <h5 className="fw-bold mb-2">Motor Gemini Generative AI</h5>
                      <p className="small text-muted mb-3">
                        Optimizado con prompts de ingeniería de calidad para máxima cobertura funcional y casos de borde.
                      </p>
                      <div className="d-flex justify-content-center gap-2">
                        <span className="badge bg-dark-subtle text-muted rounded-pill px-3 py-2">Sin Configurar API Key</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. SECCIÓN: SIMULADORES QA */}
            <section className="dashboard-section" id="section-simulators">
              <div className="section-header-box mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="section-icon-badge sim-badge">
                    <i className="bi bi-phone-landscape"></i>
                  </span>
                  <h3 className="section-title-premium mb-0">Simuladores & Responsive Testing</h3>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill ms-2">
                    Multi-Viewport
                  </span>
                </div>
                <p className="section-subtitle-text mb-0">
                  Prueba interfaces web en vivo sobre marcos reales de smartphones, tablets y escritorios con vista paralela.
                </p>
              </div>

              <div className="featured-showcase-card simulator-showcase">
                <div className="row align-items-center g-4">
                  <div className="col-lg-7">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                      <span className="showcase-pill-badge bg-primary-subtle text-primary">
                        <i className="bi bi-phone me-1"></i> iPhone, Galaxy & Pixel
                      </span>
                      <span className="showcase-pill-badge bg-info-subtle text-info">
                        <i className="bi bi-tablet me-1"></i> iPad Pro & Tablets
                      </span>
                      <span className="showcase-pill-badge bg-success-subtle text-success">
                        <i className="bi bi-columns-gap me-1"></i> Vista Paralela 3x1
                      </span>
                    </div>

                    <h4 className="showcase-card-title mb-3">
                      Simulador Responsive Multi-Pantalla en Tiempo Real
                    </h4>
                    <p className="showcase-card-desc mb-4">
                      Inspecciona cómo responde tu aplicación web en diferentes densidades de píxeles y viewports. Cambia la orientación horizontal o vertical, ajusta el nivel de zoom o activa la vista multi-dispositivo para comparar la experiencia móvil y de escritorio al mismo tiempo.
                    </p>

                    <div className="showcase-highlights-grid mb-4">
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-primary"></i>
                        <span>Más de 15 perfiles de dispositivos configurados</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-primary"></i>
                        <span>Rotación 90° portrait / landscape instantánea</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-primary"></i>
                        <span>Soporte para URLs locales y remotas</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-primary"></i>
                        <span>Modo pantalla completa para testing ágil</span>
                      </div>
                    </div>

                    <Link to={ROUTES.DEVICE_SIMULATOR} className="btn btn-primary px-4 py-2.5 rounded-pill fw-semibold d-inline-flex align-items-center gap-2 shadow-sm">
                      <span>Lanzar Simulador Responsive</span>
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>

                  <div className="col-lg-5 text-center">
                    <div className="simulator-devices-mockup p-3 rounded-4">
                      <div className="device-icons-preview d-flex justify-content-center align-items-end gap-3 py-3">
                        <div className="mock-device mobile p-2 rounded-4 shadow">
                          <i className="bi bi-phone fs-1 text-primary"></i>
                          <div className="small fw-semibold mt-1">Mobile</div>
                        </div>
                        <div className="mock-device tablet p-3 rounded-4 shadow">
                          <i className="bi bi-tablet fs-1 text-info"></i>
                          <div className="small fw-semibold mt-1">Tablet</div>
                        </div>
                        <div className="mock-device desktop p-3 rounded-4 shadow">
                          <i className="bi bi-display fs-1 text-success"></i>
                          <div className="small fw-semibold mt-1">Desktop</div>
                        </div>
                      </div>
                      <span className="small text-muted d-block mt-2">
                        Simulación precisa de viewport y CSS Media Queries
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. SECCIÓN: PRUEBAS QA & DATOS */}
            <section className="dashboard-section" id="section-qa">
              <div className="section-header-box mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="section-icon-badge qa-badge">
                    <i className="bi bi-patch-check-fill"></i>
                  </span>
                  <h3 className="section-title-premium mb-0">Pruebas QA & Datos de Prueba</h3>
                </div>
                <p className="section-subtitle-text mb-0">
                  Herramientas indispensables para simulación de datos colombianos, bancos de archivos de prueba y análisis visual.
                </p>
              </div>

              <div className="row g-4">
                {toolsByCategory.qa.map((tool) => (
                  <div key={tool.link} className="col-sm-12 col-md-6 col-lg-3">
                    <CardTools
                      title={tool.title}
                      description={tool.description}
                      link={tool.link}
                      icon={tool.icon}
                      color={tool.color}
                      badge={tool.badge}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 4. SECCIÓN: DESARROLLO, APIS & SEGURIDAD */}
            <section className="dashboard-section" id="section-dev">
              <div className="section-header-box mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="section-icon-badge dev-badge">
                    <i className="bi bi-code-slash"></i>
                  </span>
                  <h3 className="section-title-premium mb-0">Desarrollo, APIs & Seguridad</h3>
                </div>
                <p className="section-subtitle-text mb-0">
                  Inspección de tokens de sesión, conversión de formatos de datos, evaluador regex y utilidades de codificación.
                </p>
              </div>

              <div className="row g-4">
                {toolsByCategory.dev.map((tool) => (
                  <div key={tool.link} className="col-sm-12 col-md-6 col-lg-4">
                    <CardTools
                      title={tool.title}
                      description={tool.description}
                      link={tool.link}
                      icon={tool.icon}
                      color={tool.color}
                      badge={tool.badge}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 5. SECCIÓN: CONVERSIÓN & MULTIMEDIA */}
            <section className="dashboard-section" id="section-converters">
              <div className="section-header-box mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="section-icon-badge conv-badge">
                    <i className="bi bi-arrow-repeat"></i>
                  </span>
                  <h3 className="section-title-premium mb-0">Módulos de Conversión & Multimedia</h3>
                </div>
                <p className="section-subtitle-text mb-0">
                  Convertidores nativos de archivos, optimizadores de imagen y codificadores multimedia 100% privados en tu navegador.
                </p>
              </div>

              {/* 4 Core Converters Cards */}
              <div className="converters-panel mb-4">
                <div className="row g-4">
                  {primaryConverters.map((tool) => {
                    const meta = getPremiumCardMeta(tool.link);
                    return (
                      <div key={tool.link} className="col-sm-12 col-md-6 col-lg-3 premium-card-wrapper">
                        <div className={`premium-converter-card ${meta.styleClass}`}>
                          <span className="premium-card-badge">{meta.badgeText}</span>
                          <div className="premium-card-icon">
                            <i className={`bi ${tool.icon}`}></i>
                          </div>
                          <h4 className="premium-card-title">{tool.title}</h4>
                          <p className="premium-card-description">{tool.description}</p>
                          <Link to={tool.link} className="premium-card-action">
                            Iniciar Conversión <i className="bi bi-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Auxiliary Media tools (Image Resizer, Image Base64) */}
              <div className="row g-4">
                {mediaUtilities.map((tool) => (
                  <div key={tool.link} className="col-sm-12 col-md-6">
                    <CardTools
                      title={tool.title}
                      description={tool.description}
                      link={tool.link}
                      icon={tool.icon}
                      color={tool.color}
                      badge={tool.badge}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 6. SECCIÓN: ACADEMIA & CURSOS QA (ISTQB) — AL FINAL */}
            <section className="dashboard-section" id="section-courses">
              <div className="section-header-box mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="section-icon-badge courses-badge">
                    <i className="bi bi-mortarboard-fill"></i>
                  </span>
                  <h3 className="section-title-premium mb-0">Academia & Cursos QA (ISTQB®)</h3>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill ms-2">
                    Nuevo Módulo
                  </span>
                </div>
                <p className="section-subtitle-text mb-0">
                  Formación interactiva en testing de software, lectura con voz natural, glosarios bilingües y simulacros de certificación.
                </p>
              </div>

              <div className="featured-showcase-card courses-showcase">
                <div className="row align-items-center g-4">
                  <div className="col-lg-7">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                      <span className="showcase-pill-badge bg-info-subtle text-info">
                        <i className="bi bi-award-fill me-1"></i> Certificación ISTQB®
                      </span>
                      <span className="showcase-pill-badge bg-primary-subtle text-primary">
                        <i className="bi bi-volume-up-fill me-1"></i> Audio & Voz Natural
                      </span>
                      <span className="showcase-pill-badge bg-success-subtle text-success">
                        <i className="bi bi-check2-circle me-1"></i> Quizes Interactivos
                      </span>
                    </div>

                    <h4 className="showcase-card-title mb-3">
                      Aprende Testing Profesional y Prepárate para Certificarte
                    </h4>
                    <p className="showcase-card-desc mb-4">
                      Explora cursos estructurados con explicaciones claras, casos reales de la industria, glosario técnico y simulador de preguntas oficiales con retroalimentación inmediata. Avanza a tu propio ritmo con almacenamiento de progreso en tu navegador.
                    </p>

                    <div className="showcase-highlights-grid mb-4">
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>GenAI & LLMs aplicados a Testing y QA</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>Fundamentos y niveles ISTQB® Foundation</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>Narrador de audio con pausa y navegación</span>
                      </div>
                      <div className="showcase-highlight-item">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>Simulacros de examen puntuados con feedback</span>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-3">
                      <Link to={ROUTES.COURSES} className="btn btn-primary px-4 py-2.5 rounded-pill fw-semibold d-inline-flex align-items-center gap-2 shadow-sm">
                        <span>Explorar Academia de Cursos</span>
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="showcase-preview-box">
                      <div className="showcase-preview-header d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold small text-uppercase text-muted">Curso Destacado</span>
                        <span className="badge bg-success rounded-pill">Disponible</span>
                      </div>
                      <div className="showcase-course-snippet p-3 rounded-4">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div className="snippet-icon bg-info text-white rounded-3 p-2.5">
                            <i className="bi bi-robot fs-4"></i>
                          </div>
                          <div>
                            <h5 className="mb-0 fw-bold">GenAI & LLM para Testing y QA</h5>
                            <span className="small text-muted">4 Módulos • 10 Preguntas Quiz • Audio</span>
                          </div>
                        </div>
                        <p className="small text-secondary mb-3">
                          Aprende a integrar prompts, generación de pruebas con LLMs y técnicas de verificación en calidad de software.
                        </p>
                        <div className="progress course-progress-track mb-3" style={{ height: '6px' }}>
                          <div className="progress-bar bg-info" style={{ width: '100%' }}></div>
                        </div>
                        <Link to={ROUTES.COURSES} className="btn btn-sm btn-outline-info w-100 rounded-pill fw-semibold">
                          Iniciar Curso Ahora <i className="bi bi-play-fill"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ============================================================
             FILTERED / SEARCH VIEW: FOCUSED GRID
             ============================================================ */
          <div>
            <div className="results-info d-flex justify-content-between align-items-center mb-4">
              <span className="results-count">
                {searchQuery ? (
                  <>Resultados para &ldquo;<strong>{searchQuery}</strong>&rdquo;: <strong>{filteredTools.length}</strong> herramientas</>
                ) : (
                  <>Categoría &ldquo;<strong>{CATEGORIES.find(c => c.id === selectedCategory)?.label}</strong>&rdquo;: <strong>{filteredTools.length}</strong> herramientas</>
                )}
              </span>
              <button
                className="btn-reset-filters btn btn-link text-decoration-none btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Ver todas las secciones
              </button>
            </div>

            {filteredTools.length > 0 ? (
              <div className="tools-grid-redesigned row g-4">
                {filteredTools.map((tool) => (
                  <div key={tool.link} className="col-sm-12 col-md-6 col-lg-4">
                    <CardTools
                      title={tool.title}
                      description={tool.description}
                      link={tool.link}
                      icon={tool.icon}
                      color={tool.color}
                      badge={tool.badge}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="empty-state text-center py-5">
                <div className="empty-icon-wrapper mb-3 mx-auto">
                  <i className="bi bi-search-heart empty-icon"></i>
                </div>
                <h3>No se encontraron herramientas</h3>
                <p className="text-muted">
                  Prueba buscando con otros términos o cambia la categoría de filtro seleccionada.
                </p>
                <button
                  className="btn btn-primary mt-2 px-4 rounded-pill"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Ver todas las herramientas
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}