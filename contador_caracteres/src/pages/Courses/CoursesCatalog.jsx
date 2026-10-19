import React from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../../data/courses';
import { ROUTES } from '../../constants/routes';
import './Courses.css';

/**
 * CoursesCatalog component:
 * Landing hub for QA Courses and Foundational Knowledge in QATOOLS.
 */
export default function CoursesCatalog() {
  const courses = getAllCourses();

  return (
    <div className="courses-catalog-page">
      {/* Hero Section */}
      <header className="courses-hero-section text-center py-5">
        <div className="container">
          <span className="hero-badge mb-3 d-inline-block">
            <i className="bi bi-mortarboard-fill me-1"></i> Academia de Aprendizaje QA
          </span>
          <h1 className="hero-title display-5 fw-bold mb-3">
            Cursos y Conocimientos Esenciales para <span className="text-gradient">Profesionales de QA</span>
          </h1>
          <p className="hero-subtitle col-lg-8 mx-auto text-secondary mb-4">
            Aprende aseguramiento de calidad de software con cursos modulares, conceptos nucleares,
            taxonomías de riesgo, glosarios técnicos y simulacros de certificación interactivos con justificación razonada y lectura en voz alta.
          </p>

          {/* Highlights Row */}
          <div className="row g-3 justify-content-center col-lg-10 mx-auto mt-2">
            {[
              { icon: 'bi-volume-up-fill', title: 'Lectura en Voz Alta', desc: 'Audio nativo para estudiar mientras realizas otras tareas' },
              { icon: 'bi-award-fill', title: 'Simulacros Oficiales', desc: 'Preguntas tipo examen con justificaciones técnicas ISTQB®' },
              { icon: 'bi-diagram-3-fill', title: 'Modelos en 8 Pasos', desc: 'Casos reales, prompts canónicos y pipelines LLMOps' },
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Cursos de Especialización Disponibles</h3>
            <span className="text-muted small">Selecciona un curso para iniciar tu formación práctica</span>
          </div>
          <span className="badge bg-primary rounded-pill px-3 py-1.5 small">
            {courses.length} Curso {courses.length === 1 ? 'Activo' : 'Activos'}
          </span>
        </div>

        <div className="courses-grid row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-12">
              <div className="featured-course-card p-4 p-md-5 rounded-4 border shadow-sm bg-card position-relative overflow-hidden">
                <div className="course-card-accent-bar" style={{ background: course.bannerGradient }}></div>

                <div className="row g-4 align-items-center">
                  <div className="col-lg-8">
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
                        <i className="bi bi-layers-fill me-1"></i> Estructura del curso ({course.modules.length} Módulos + Glosario + Examen):
                      </strong>
                      <div className="d-flex flex-wrap gap-2">
                        {course.modulesSummary.map((m, idx) => (
                          <span key={idx} className="badge bg-surface-elevated text-secondary border rounded-pill px-3 py-1.5 small">
                            {m.number}. {m.title.split(':')[1] || m.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <Link
                        to={`${ROUTES.COURSES}/${course.id}`}
                        className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm fw-semibold d-flex align-items-center gap-2"
                      >
                        <span>Comenzar Curso Ahora</span>
                        <i className="bi bi-arrow-right"></i>
                      </Link>

                      <Link
                        to={`${ROUTES.COURSES}/${course.id}`}
                        className="btn btn-outline-secondary btn-lg rounded-pill px-3 small"
                        onClick={() => {
                          // Quick jump to exam
                        }}
                      >
                        <i className="bi bi-award me-1"></i> Ir directo al Simulacro (10 preguntas)
                      </Link>
                    </div>
                  </div>

                  <div className="col-lg-4 text-center">
                    <div className="course-preview-graphic p-4 rounded-4 bg-surface-elevated border shadow-sm">
                      <div className="graphic-icon-ring mb-3 mx-auto">
                        <i className="bi bi-robot fs-1 text-primary"></i>
                      </div>
                      <h5 className="fw-bold mb-1">QA-GenAI v1.1</h5>
                      <span className="small text-muted d-block mb-3">Aseguramiento de Calidad para IA y Agentes</span>
                      <div className="d-flex flex-column gap-2 text-start small">
                        <div className="d-flex align-items-center gap-2 text-secondary">
                          <i className="bi bi-check2 text-success"></i> Metodología integral en 8 fases (RAG y Agentes)
                        </div>
                        <div className="d-flex align-items-center gap-2 text-secondary">
                          <i className="bi bi-check2 text-success"></i> Taxonomía en 4 dimensiones de riesgo
                        </div>
                        <div className="d-flex align-items-center gap-2 text-secondary">
                          <i className="bi bi-check2 text-success"></i> Estructura canónica y patrones de prompts QA
                        </div>
                        <div className="d-flex align-items-center gap-2 text-secondary">
                          <i className="bi bi-check2 text-success"></i> Oráculos LLM-as-a-judge y calibración Kappa
                        </div>
                        <div className="d-flex align-items-center gap-2 text-secondary">
                          <i className="bi bi-check2 text-success"></i> LLMOps, detección de drift y CI/CD
                        </div>
                        <div className="d-flex align-items-center gap-2 text-secondary">
                          <i className="bi bi-check2 text-success"></i> 10 preguntas oficiales con justificaciones razonadas
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Teasers for future QA Courses */}
        <div className="upcoming-courses-section mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-2">Próximos Cursos en la Academia QA</h4>
          <p className="text-muted small mb-4">
            Estamos preparando más módulos formativos locales para fortalecer el perfil de los testers:
          </p>
          <div className="row g-4">
            {[
              {
                title: 'Fundamentos de Testing y Aseguramiento de Calidad',
                badge: 'ISTQB Foundation (CTFL 4.0)',
                desc: 'Principios de prueba, análisis de valores límite, partición de equivalencia y ciclo de vida de defectos.',
                icon: 'bi-patch-check-fill'
              },
              {
                title: 'Automatización Moderna con Playwright y Cypress',
                badge: 'Test Automation',
                desc: 'Page Object Model (POM), selectores robustos, intercepción de APIs y reportes CI/CD.',
                icon: 'bi-code-slash'
              },
              {
                title: 'Pruebas de Rendimiento & Carga con k6 y JMeter',
                badge: 'Performance QA',
                desc: 'Pruebas de estrés, picos y resistencia con análisis de percentiles p95 y p99.',
                icon: 'bi-speedometer'
              }
            ].map((upcoming, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="p-4 rounded-4 bg-card border shadow-sm h-100 opacity-75">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-secondary-subtle text-secondary rounded-pill small">Próximamente</span>
                    <i className={`bi ${upcoming.icon} text-muted fs-5`}></i>
                  </div>
                  <h6 className="fw-bold mb-1">{upcoming.title}</h6>
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
