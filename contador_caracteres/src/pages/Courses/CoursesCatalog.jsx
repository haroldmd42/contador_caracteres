import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../../data/courses';
import { ROUTES } from '../../constants/routes';
import './Courses.css';

/**
 * CoursesCatalog component:
 * Landing hub for QA Courses and Foundational Knowledge in QATOOLS.
 * Features dynamic course cards, category filter, instant search,
 * and direct links to lessons and ISTQB certification simulators.
 */
export default function CoursesCatalog() {
  const courses = getAllCourses();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract available categories
  const categories = useMemo(() => {
    const list = [
      { id: 'all', label: 'Todos los Cursos', icon: 'bi-grid-fill' },
      { id: 'fundamentos', label: 'Fundamentos ISTQB®', icon: 'bi-patch-check-fill' },
      { id: 'ia', label: 'Inteligencia Artificial', icon: 'bi-robot' }
    ];
    return list;
  }, []);

  // Filtered courses based on category and search query
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === 'all' || course.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.subtitle.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        (course.modulesSummary &&
          course.modulesSummary.some((m) => m.title.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  // Aggregate stats
  const totalModules = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.modules?.length || 0), 0);
  }, [courses]);

  const totalQuestions = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.exam?.length || 0), 0);
  }, [courses]);

  return (
    <div className="courses-catalog-page">
      {/* Hero Section */}
      <header className="courses-hero-section text-center py-5">
        <div className="container">
          <span className="hero-badge mb-3 d-inline-block">
            <i className="bi bi-mortarboard-fill me-1"></i> Academia de Aprendizaje QA & Certificaciones
          </span>
          <h1 className="hero-title display-5 fw-bold mb-3">
            Cursos y Conocimientos Esenciales para <span className="text-gradient">Profesionales de QA</span>
          </h1>
          <p className="hero-subtitle col-lg-8 mx-auto text-secondary mb-4">
            Aprende aseguramiento de calidad de software con cursos modulares, conceptos nucleares,
            taxonomías de riesgo, glosarios técnicos y simulacros de certificación interactivos con justificación razonada y lectura en voz alta.
          </p>

          {/* Metrics Pill Counters */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-semibold">
              <i className="bi bi-collection-play-fill me-1"></i> {courses.length} Cursos Completos
            </span>
            <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3 py-2 fw-semibold">
              <i className="bi bi-layers-fill me-1"></i> {totalModules} Módulos Interactivos
            </span>
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-2 fw-semibold">
              <i className="bi bi-award-fill me-1"></i> {totalQuestions} Preguntas Examen ISTQB®
            </span>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 fw-semibold">
              <i className="bi bi-volume-up-fill me-1"></i> Audio HD en Español
            </span>
          </div>

          {/* Highlights Row */}
          <div className="row g-3 justify-content-center col-lg-10 mx-auto mt-2">
            {[
              { icon: 'bi-volume-up-fill', title: 'Lectura en Voz Alta', desc: 'Audio nativo para estudiar mientras realizas otras tareas' },
              { icon: 'bi-award-fill', title: 'Simulacros Oficiales', desc: 'Preguntas tipo examen con justificaciones técnicas ISTQB®' },
              { icon: 'bi-diagram-3-fill', title: 'Metodologías y Modelos', desc: 'Casos reales, Shift-Left, técnicas de caja negra y blanca' },
              { icon: 'bi-lightning-charge-fill', title: '100% Gratis y Local', desc: 'Sin registro ni bases de datos externas requeridas' }
            ].map((f, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-md-3">
                <div className="p-3 rounded-4 bg-card border shadow-sm h-100 text-start d-flex flex-column gap-2">
                  <div className="feature-icon-pill p-2 rounded-3 bg-primary-subtle text-primary d-inline-block align-self-start">
                    <i className={`bi ${f.icon} fs-5`}></i>
                  </div>
                  <h6 className="fw-bold mb-0 text-primary-emphasis">{f.title}</h6>
                  <span className="small text-muted">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Course Catalog */}
      <main className="container my-5">
        {/* Controls: Search and Category Pills */}
        <div className="catalog-toolbar p-3 p-md-4 rounded-4 bg-card border shadow-sm mb-4">
          <div className="row g-3 align-items-center justify-content-between">
            {/* Category Pills */}
            <div className="col-12 col-md-7">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`btn btn-sm ${
                      selectedCategory === cat.id ? 'btn-primary text-white shadow-sm' : 'btn-outline-secondary'
                    } rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 transition-all`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <i className={`bi ${cat.icon}`}></i>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="col-12 col-md-5">
              <div className="search-wrapper position-relative">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="form-control search-input rounded-pill ps-5 pe-4 py-2"
                  placeholder="Buscar temas, módulos o conceptos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    title="Limpiar búsqueda"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Cursos de Especialización Disponibles</h3>
            <span className="text-muted small">
              Mostrando {filteredCourses.length} de {courses.length} cursos formativos prácticos
            </span>
          </div>
          <span className="badge bg-primary rounded-pill px-3 py-1.5 small fw-semibold">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'Curso Disponible' : 'Cursos Disponibles'}
          </span>
        </div>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-5 bg-card rounded-4 border shadow-sm my-4">
            <i className="bi bi-search text-muted fs-1 mb-2"></i>
            <h5 className="fw-bold">No se encontraron cursos con el criterio ingresado</h5>
            <p className="text-muted small mb-3">Intenta buscar con otra palabra clave o selecciona otra categoría.</p>
            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              Ver todos los cursos
            </button>
          </div>
        ) : (
          <div className="courses-grid row g-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="col-12">
                <div className="featured-course-card p-4 p-md-5 rounded-4 border shadow-sm bg-card position-relative overflow-hidden">
                  <div className="course-card-accent-bar" style={{ background: course.bannerGradient }}></div>

                  <div className="row g-4 align-items-center">
                    <div className="col-lg-8">
                      {/* Course Meta Badges */}
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <span className="badge bg-primary text-white rounded-pill px-3 py-1 fw-bold small">
                          {course.badge}
                        </span>
                        <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2.5 py-1 small">
                          <i className="bi bi-clock me-1"></i> {course.duration}
                        </span>
                        <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1 small">
                          <i className="bi bi-star-fill text-warning me-1"></i> {course.rating} / 5.0
                        </span>
                        <span className="badge bg-info-subtle text-info rounded-pill px-2.5 py-1 small">
                          <i className="bi bi-volume-up-fill me-1"></i> Audio habilitado
                        </span>
                      </div>

                      <h2 className="course-card-title fw-bold mb-2">
                        {course.title}
                      </h2>
                      <h5 className="course-card-subtitle text-muted fw-normal mb-3 fst-italic">
                        {course.subtitle}
                      </h5>
                      <p className="course-card-description text-secondary mb-4">
                        {course.shortDescription}
                      </p>

                      {/* Modules Summary Pills */}
                      <div className="course-modules-summary mb-4">
                        <strong className="small text-muted text-uppercase d-block mb-2">
                          <i className="bi bi-layers-fill me-1"></i> Estructura del curso ({course.modules.length} Módulos + Glosario ({course.glossary?.length || 0}) + Examen ({course.exam?.length || 0} preguntas)):
                        </strong>
                        <div className="d-flex flex-wrap gap-2">
                          {course.modulesSummary.map((m, idx) => (
                            <span key={idx} className="badge bg-surface-elevated text-secondary border rounded-pill px-3 py-1.5 small">
                              {m.number}. {m.title.split(':')[1] || m.title}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="d-flex flex-wrap align-items-center gap-3">
                        <Link
                          to={`${ROUTES.COURSES}/${course.id}`}
                          className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm fw-semibold d-flex align-items-center gap-2"
                        >
                          <span>Comenzar Curso Ahora</span>
                          <i className="bi bi-arrow-right"></i>
                        </Link>

                        <Link
                          to={`${ROUTES.COURSES}/${course.id}?tab=exam`}
                          className="btn btn-outline-secondary btn-lg rounded-pill px-3 small d-flex align-items-center gap-1.5"
                        >
                          <i className="bi bi-award text-warning"></i>
                          <span>Ir directo al Simulacro ({course.exam?.length || 10} preguntas)</span>
                        </Link>
                      </div>
                    </div>

                    {/* Dynamic Graphic Preview Column */}
                    <div className="col-lg-4 text-center">
                      <div className="course-preview-graphic p-4 rounded-4 bg-surface-elevated border shadow-sm">
                        <div
                          className="graphic-icon-ring mb-3 mx-auto"
                          style={{
                            borderColor: course.accentColor || 'var(--accent-primary)',
                            boxShadow: `0 0 20px ${course.accentColor ? course.accentColor + '33' : 'rgba(79, 70, 229, 0.15)'}`
                          }}
                        >
                          <i
                            className={`bi ${course.icon || 'bi-mortarboard-fill'} fs-1`}
                            style={{ color: course.accentColor || 'var(--accent-primary)' }}
                          ></i>
                        </div>
                        <h5 className="fw-bold mb-1">{course.badge}</h5>
                        <span className="small text-muted d-block mb-3">{course.title}</span>
                        <div className="d-flex flex-column gap-2 text-start small">
                          {(course.highlights || []).map((highlight, hIdx) => (
                            <div key={hIdx} className="d-flex align-items-start gap-2 text-secondary">
                              <i className="bi bi-check2 text-success mt-0.5"></i>
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Practice Live Banner: Suite de Automatización */}
        <div className="practice-suite-banner p-4 p-lg-5 rounded-4 border mb-5 position-relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(99, 102, 241, 0.08) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.25)'
        }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold">
                  <i className="bi bi-play-circle-fill me-1"></i> Laboratorio Práctico en Vivo
                </span>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">
                  Playwright · Cypress · Selenium
                </span>
              </div>
              <h4 className="fw-bold text-primary-emphasis mb-2">
                ¿Listo para automatizar? Practica tus scripts en la Suite de Pruebas
              </h4>
              <p className="text-secondary mb-3" style={{ maxWidth: '680px' }}>
                Accede al entorno interactivo diseñado para que automatizadores practiquen con Playwright, Cypress y Selenium: selectores dinámicos, formularios con validaciones, modales, alertas y tablas paginadas.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-card text-body border px-2.5 py-1.5 small"><i className="bi bi-check2 text-success me-1"></i>Playwright Ready</span>
                <span className="badge bg-card text-body border px-2.5 py-1.5 small"><i className="bi bi-check2 text-success me-1"></i>Cypress E2E</span>
                <span className="badge bg-card text-body border px-2.5 py-1.5 small"><i className="bi bi-check2 text-success me-1"></i>Selenium WebDriver</span>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <a
                href="https://haroldmd42.github.io/automation_suite/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-lg px-4 py-2.5 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2"
              >
                <span>Abrir Suite de Pruebas</span>
                <i className="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Coming Soon Teasers for future QA Courses */}
        <div className="upcoming-courses-section mt-5 pt-4 border-top">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">Próximos Cursos en la Academia QA</h4>
              <p className="text-muted small mb-0">
                Módulos formativos avanzados en desarrollo para expandir tu especialización profesional:
              </p>
            </div>
            <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1 small">
              Roadmap 2026
            </span>
          </div>

          <div className="row g-4">
            {[
              {
                title: 'Automatización Moderna con Playwright y Cypress',
                badge: 'Test Automation',
                desc: 'Page Object Model (POM), selectores robustos, intercepción de APIs, auto-waiting y reportes CI/CD.',
                icon: 'bi-code-slash'
              },
              {
                title: 'Pruebas de Rendimiento & Carga con k6 y JMeter',
                badge: 'Performance QA',
                desc: 'Pruebas de estrés, picos y resistencia con análisis de latencias, percentiles p95/p99 y umbrales SLA.',
                icon: 'bi-speedometer'
              },
              {
                title: 'Seguridad en Aplicaciones Web & OWASP Testing',
                badge: 'Security QA',
                desc: 'Metodología OWASP Top 10, validación de autenticación JWT, inyecciones SQL/XSS y escaneos DAST/SAST.',
                icon: 'bi-shield-lock-fill'
              }
            ].map((upcoming, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="p-4 rounded-4 bg-card border shadow-sm h-100 opacity-85 transition-all hover-lift">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-secondary-subtle text-secondary rounded-pill small">Próximamente</span>
                    <i className={`bi ${upcoming.icon} text-primary fs-5`}></i>
                  </div>
                  <h6 className="fw-bold mb-1 text-primary-emphasis">{upcoming.title}</h6>
                  <span className="badge bg-surface-elevated text-primary border small mb-2">{upcoming.badge}</span>
                  <p className="small text-muted mb-0">{upcoming.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
