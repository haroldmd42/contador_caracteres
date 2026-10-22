import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getCourseById, getAllCourses } from '../../data/courses';
import { ROUTES } from '../../constants/routes';
import { useNaturalSpeech } from '../../hooks/useNaturalSpeech';
import CourseSpeechToolbar from './components/CourseSpeechToolbar';
import SectionAudioButton from './components/SectionAudioButton';
import ModuleRenderer from './components/ModuleRenderer';
import CourseGlossary from './components/CourseGlossary';
import CourseQuiz from './components/CourseQuiz';
import './Courses.css';

/**
 * CourseViewer component: The learning player environment.
 * Features natural human-voice TTS with parent/child hierarchical controls,
 * collapsible sidebar, structured lesson rendering, interactive glossary,
 * and 10-question certification exam.
 */
export default function CourseViewer() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const speech = useNaturalSpeech();

  // Find course or fallback to default
  const course = useMemo(() => {
    return getCourseById(courseId) || getAllCourses()[0];
  }, [courseId]);

  // View tabs: 'content' | 'prologue' | 'glossary' | 'exam'
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => {
    return urlTab && ['content', 'prologue', 'glossary', 'exam'].includes(urlTab)
      ? urlTab
      : 'content';
  });

  // Current active module and topic
  const [activeModuleId, setActiveModuleId] = useState(() => course.modules[0].id);
  const [activeTopicId, setActiveTopicId] = useState(() => course.modules[0].topics[0].id);
  // Sidebar collapsed state on smaller screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sync tab with URL search parameter if it changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['content', 'prologue', 'glossary', 'exam'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Reset active module, topic, and load progress when course changes
  useEffect(() => {
    if (course?.modules?.[0]) {
      setActiveModuleId(course.modules[0].id);
      setActiveTopicId(course.modules[0].topics[0].id);
    }
    try {
      const saved = localStorage.getItem(`course_progress_${course.id}`);
      setCompletedTopics(saved ? JSON.parse(saved) : {});
    } catch {
      setCompletedTopics({});
    }
  }, [course.id]);

  // Local storage for completed topics
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(`course_progress_${course.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Keep a stable ref to speech.stop to avoid infinite re-render cycles
  const stopSpeechRef = useRef(speech.stop);
  useEffect(() => {
    stopSpeechRef.current = speech.stop;
  }, [speech.stop]);

  // Stop speech only when explicitly changing lessons or tabs
  useEffect(() => {
    return () => {
      if (stopSpeechRef.current) stopSpeechRef.current();
    };
  }, [activeTopicId, activeTab]);

  // Current active module and topic objects
  const activeModule = useMemo(() => {
    return course.modules.find((m) => m.id === activeModuleId) || course.modules[0];
  }, [course, activeModuleId]);

  const activeTopic = useMemo(() => {
    return activeModule.topics.find((t) => t.id === activeTopicId) || activeModule.topics[0];
  }, [activeModule, activeTopicId]);

  // Mark current topic as read
  const handleMarkAsCompleted = (topicId) => {
    const updated = { ...completedTopics, [topicId]: true };
    setCompletedTopics(updated);
    try {
      localStorage.setItem(`course_progress_${course.id}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save progress to localStorage', e);
    }
  };

  // Calculate course completion progress
  const progressStats = useMemo(() => {
    let totalTopics = 0;
    course.modules.forEach((m) => {
      totalTopics += m.topics.length;
    });
    // Add glossary and exam as milestone units
    totalTopics += 2;

    let completedCount = Object.keys(completedTopics).length;
    const percentage = Math.min(100, Math.round((completedCount / totalTopics) * 100));

    return { totalTopics, completedCount, percentage };
  }, [course, completedTopics]);

  // Child sections queue for Parent Speech Toolbar
  const childSections = useMemo(() => {
    if (activeTab === 'prologue' && course.prologue) {
      const list = [
        {
          id: 'prologue-main',
          title: 'Manifiesto y Filosofía QA',
          speechText: `${course.prologue.title}. ${course.prologue.lead} ${course.prologue.body}`
        }
      ];
      course.prologue.transitionPoints.forEach((pt, idx) => {
        list.push({
          id: `prologue-pillar-${idx}`,
          title: `Pilar ${idx + 1}: ${pt.title}`,
          speechText: `Pilar ${idx + 1}: ${pt.title}. ${pt.desc}`
        });
      });
      return list;
    }

    if (activeTab === 'content' && activeTopic?.content) {
      const list = [];
      const c = activeTopic.content;

      if (c.type === 'concepts') {
        c.subsections.forEach((sub, idx) => {
          list.push({
            id: `concept-${idx}`,
            title: sub.subtitle,
            speechText: `${sub.subtitle}. ${sub.body || ''} ${sub.formulaExplanation || ''} ${sub.impactQA ? 'Impacto para QA: ' + sub.impactQA : ''}`
          });
          if (sub.cards) {
            sub.cards.forEach((card, cIdx) => {
              list.push({
                id: `subcard-${idx}-${cIdx}`,
                title: card.title,
                speechText: `${card.title}. ${card.description || ''}. ${card.bullets ? card.bullets.join('. ') : ''}`
              });
            });
          }
        });
      } else if (c.type === 'four_dimensions') {
        c.dimensions.forEach((dim) => {
          list.push({
            id: `dim-${dim.id}`,
            title: dim.name,
            speechText: `Dimensión de Riesgo: ${dim.name}. Defectos asociados: ${dim.defects.map(d => `${d.name}: ${d.desc}`).join('. ')}`
          });
        });
      } else if (c.type === 'deep_dive_risks') {
        c.subsections.forEach((sub, idx) => {
          list.push({
            id: `deep-dive-${idx}`,
            title: sub.title,
            speechText: `${sub.title}. ${sub.comparison ? sub.comparison.map(comp => `${comp.type}: ${comp.detail}. Estrategia: ${comp.qaTactic}`).join('. ') : ''}`
          });
        });
      } else if (c.type === 'architecture_levels') {
        c.levels.forEach((lvl) => {
          list.push({
            id: `arch-level-${lvl.level}`,
            title: `Nivel ${lvl.level}: ${lvl.name}`,
            speechText: `Nivel ${lvl.level}: ${lvl.name}. Cadena arquitectural: ${lvl.flow}. Descripción: ${lvl.description}. Puntos de inspección: ${lvl.qaChecklist.join('. ')}`
          });
        });
      } else if (c.type === 'eight_phases') {
        c.phases.forEach((ph) => {
          list.push({
            id: `phase-${ph.phase}`,
            title: `Fase ${ph.phase}: ${ph.name}`,
            speechText: `Fase ${ph.phase}: ${ph.name}. Resumen: ${ph.summary}. Detalles: ${ph.details.join('. ')}`
          });
        });
      } else if (c.type === 'prompt_engineering_full') {
        c.components.forEach((comp) => {
          list.push({
            id: `prompt-comp-${comp.num}`,
            title: `${comp.num}. ${comp.name}`,
            speechText: `Componente ${comp.num}: ${comp.name}. Enfoque: ${comp.focus}. Ejemplo: ${comp.example}`
          });
        });
        c.patterns.forEach((pat, idx) => {
          list.push({
            id: `prompt-pat-${idx}`,
            title: pat.name,
            speechText: `Patrón: ${pat.name}. ${pat.desc}`
          });
        });
      } else if (c.type === 'metrics_and_calibration') {
        c.metrics.forEach((m, idx) => {
          list.push({
            id: `metric-${idx}`,
            title: m.name,
            speechText: `Métrica: ${m.name}. Meta: ${m.target}. Definición: ${m.definition}`
          });
        });
      } else if (c.type === 'llmops_pipeline') {
        c.pipelineStages.forEach((ps, idx) => {
          list.push({
            id: `pipeline-stage-${idx}`,
            title: ps.step,
            speechText: `Paso ${idx + 1}, ${ps.step}: ${ps.detail}`
          });
        });
        c.drifts.forEach((dr, idx) => {
          list.push({
            id: `drift-${idx}`,
            title: dr.name,
            speechText: `Deriva: ${dr.name}. Detalle: ${dr.detail}. Mitigación: ${dr.mitigation}`
          });
        });
      }

      if (list.length === 0 && activeTopic.speechText) {
        list.push({
          id: `topic-${activeTopic.id}`,
          title: activeTopic.title,
          speechText: activeTopic.speechText
        });
      }

      return list;
    }

    return [];
  }, [activeTab, activeTopic, course]);

  // Next / Previous Navigation
  const flatTopics = useMemo(() => {
    const list = [];
    course.modules.forEach((m) => {
      m.topics.forEach((t) => {
        list.push({ moduleId: m.id, topicId: t.id, title: t.title });
      });
    });
    return list;
  }, [course]);

  const currentTopicIndex = flatTopics.findIndex((t) => t.topicId === activeTopicId);

  const handleNextLesson = () => {
    handleMarkAsCompleted(activeTopicId);
    if (speech.stop) speech.stop();

    if (currentTopicIndex < flatTopics.length - 1) {
      const next = flatTopics[currentTopicIndex + 1];
      setActiveModuleId(next.moduleId);
      setActiveTopicId(next.topicId);
      setActiveTab('content');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Go to glossary or exam
      setActiveTab('exam');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (speech.stop) speech.stop();
    if (currentTopicIndex > 0) {
      const prev = flatTopics[currentTopicIndex - 1];
      setActiveModuleId(prev.moduleId);
      setActiveTopicId(prev.topicId);
      setActiveTab('content');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="course-viewer-page">
      {/* Top Banner Navigation */}
      <div className="course-viewer-topbar border-bottom">
        <div className="container-fluid px-lg-4 py-2.5 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <Link to={ROUTES.COURSES} className="btn btn-outline-secondary btn-sm rounded-pill px-3 back-btn">
              <i className="bi bi-arrow-left me-1"></i> Catálogo
            </Link>

            <button
              className="btn btn-outline-secondary btn-sm rounded-pill d-lg-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Alternar temario"
            >
              <i className="bi bi-layout-sidebar-inset"></i>
            </button>

            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary text-white rounded-pill px-2.5 py-0.5 small fw-bold">
                  {course.badge}
                </span>
                <span className="course-top-title fw-bold text-truncate" style={{ maxWidth: '400px' }}>
                  {course.title}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="d-none d-md-flex align-items-center gap-3">
            <div className="d-flex flex-column align-items-end">
              <span className="small text-muted">Progreso del curso: <strong>{progressStats.percentage}%</strong></span>
              <div className="progress course-progress-bar mt-1" style={{ width: '120px', height: '6px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${progressStats.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Layout */}
      <div className="container-fluid px-lg-4 py-4">
        <div className="row g-4">
          {/* Sidebar Navigation */}
          <div className={`col-lg-3 course-sidebar-col ${!isSidebarOpen ? 'd-none d-lg-block' : ''}`}>
            <div className="course-sidebar-card p-3 rounded-4 shadow-sm border bg-card sticky-sidebar">
              <div className="sidebar-header pb-3 mb-3 border-bottom d-flex justify-content-between align-items-center">
                <span className="fw-bold small text-uppercase">
                  <i className="bi bi-list-nested me-1"></i> Contenido del Curso
                </span>
                <span className="badge bg-primary text-white small rounded-pill px-2.5 py-1">
                  {course.modules.length} Módulos
                </span>
              </div>

              {/* Modules Accordion / List */}
              <div className="modules-accordion d-flex flex-column gap-2">
                {/* Prologue Special Link at Top */}
                <button
                  className={`module-group-btn w-100 p-2.5 rounded-3 text-start border mb-2 d-flex justify-content-between align-items-center ${
                    activeTab === 'prologue' ? 'active-module' : 'bg-surface'
                  }`}
                  onClick={() => setActiveTab('prologue')}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-compass-fill text-primary"></i>
                    <span className="small fw-bold">Prólogo & Filosofía QA</span>
                  </div>
                  <span className="badge bg-primary text-white rounded-pill small">Manifiesto</span>
                </button>

                {course.modules.map((m) => {
                  const isCurrentModule = activeModuleId === m.id && activeTab === 'content';
                  const completedInModule = m.topics.filter((t) => completedTopics[t.id]).length;
                  const totalInModule = m.topics.length;
                  const isModuleFinished = completedInModule === totalInModule && totalInModule > 0;

                  return (
                    <div key={m.id} className="module-group rounded-3 border overflow-hidden">
                      <button
                        className={`module-group-btn w-100 p-2.5 text-start border-0 d-flex justify-content-between align-items-center ${
                          isCurrentModule ? 'active-module' : 'bg-surface'
                        }`}
                        onClick={() => {
                          setActiveModuleId(m.id);
                          setActiveTopicId(m.topics[0].id);
                          setActiveTab('content');
                        }}
                      >
                        <div className="d-flex align-items-center gap-2 text-truncate">
                          <i className={`bi ${m.icon || 'bi-layers'} text-primary`}></i>
                          <span className="small fw-bold text-truncate">{m.shortTitle}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1.5 ms-auto">
                          <span
                            className={`badge ${
                              isModuleFinished
                                ? 'bg-success text-white'
                                : 'bg-surface-elevated text-secondary border'
                            } rounded-pill px-2 py-0.5`}
                            style={{ fontSize: '0.72rem' }}
                            title={`${completedInModule} de ${totalInModule} temas completados`}
                          >
                            {completedInModule}/{totalInModule}
                          </span>
                          <i className={`bi ${isCurrentModule ? 'bi-chevron-down' : 'bi-chevron-right'} small text-muted`}></i>
                        </div>
                      </button>

                      {/* Topic items within module */}
                      {isCurrentModule && (
                        <div className="topics-sublist p-2 bg-surface-elevated d-flex flex-column gap-1">
                          {m.topics.map((t) => {
                            const isTopicActive = activeTopicId === t.id && activeTab === 'content';
                            const isCompleted = Boolean(completedTopics[t.id]);
                            return (
                              <button
                                key={t.id}
                                className={`topic-sub-btn w-100 text-start p-2 rounded-2 border-0 d-flex align-items-center justify-content-between ${
                                  isTopicActive ? 'active-topic' : ''
                                }`}
                                onClick={() => {
                                  setActiveTopicId(t.id);
                                  setActiveTab('content');
                                }}
                              >
                                <span className="small text-truncate me-2">{t.title}</span>
                                {isCompleted ? (
                                  <i className="bi bi-check-circle-fill text-success small"></i>
                                ) : (
                                  <i className="bi bi-circle text-muted small"></i>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Additional Sections: Glosario & Simulacro */}
                <div className="sidebar-special-links pt-2 d-flex flex-column gap-2 border-top mt-2">
                  <button
                    className={`module-group-btn w-100 p-2.5 rounded-3 text-start border d-flex justify-content-between align-items-center ${
                      activeTab === 'glossary' ? 'active-module' : 'bg-surface'
                    }`}
                    onClick={() => setActiveTab('glossary')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-book-half text-info"></i>
                      <span className="small fw-bold">Glosario Técnico ({course.glossary?.length || 0})</span>
                    </div>
                    <span className="badge bg-info-subtle text-info rounded-pill small">Syllabus</span>
                  </button>

                  <button
                    className={`module-group-btn w-100 p-2.5 rounded-3 text-start border d-flex justify-content-between align-items-center ${
                      activeTab === 'exam' ? 'active-module' : 'bg-surface'
                    }`}
                    onClick={() => setActiveTab('exam')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-award-fill text-warning"></i>
                      <span className="small fw-bold">Simulacro Examen ({course.exam?.length || 0})</span>
                    </div>
                    <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill small">Oficial</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9 course-main-col">
            {/* Nav Tabs for Current Course View */}
            <div className="course-view-tabs d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 rounded-4 bg-card border shadow-sm mb-4">
              <div className="nav nav-pills gap-2">
                <button
                  className={`nav-link rounded-pill px-3 py-1.5 small fw-semibold ${
                    activeTab === 'prologue' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('prologue')}
                >
                  <i className="bi bi-compass me-1"></i> Prólogo & Filosofía
                </button>
                <button
                  className={`nav-link rounded-pill px-3 py-1.5 small fw-semibold ${
                    activeTab === 'content' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('content')}
                >
                  <i className="bi bi-journal-text me-1"></i> Lecciones ({course.modules.length})
                </button>
                <button
                  className={`nav-link rounded-pill px-3 py-1.5 small fw-semibold ${
                    activeTab === 'glossary' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('glossary')}
                >
                  <i className="bi bi-book me-1"></i> Glosario ({course.glossary?.length || 0})
                </button>
                <button
                  className={`nav-link rounded-pill px-3 py-1.5 small fw-semibold ${
                    activeTab === 'exam' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('exam')}
                >
                  <i className="bi bi-check2-square me-1"></i> Simulacro Examen ({course.exam?.length || 0})
                </button>
              </div>

              {/* Master Parent Text-to-Speech Controller Bar */}
              <div className="flex-grow-1 flex-md-grow-0">
                <CourseSpeechToolbar
                  speech={speech}
                  childSections={childSections}
                  lessonTitle={activeTab === 'prologue' ? 'Prólogo: Manifiesto QA' : activeTopic?.title || 'Lección'}
                />
              </div>
            </div>

            {/* Active Tab View Rendering */}
            <div className="course-tab-body">
              {activeTab === 'prologue' && course.prologue && (
                <div className="prologue-container p-4 p-md-5 rounded-4 shadow-sm border bg-card mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary text-white rounded-pill px-3 py-1 fw-bold small">
                      {course.badge || 'Manifiesto de Calidad'}
                    </span>
                    <SectionAudioButton
                      sectionId="prologue-main"
                      speechText={`${course.prologue.title}. ${course.prologue.lead} ${course.prologue.body}`}
                      sectionTitle={course.prologue.title}
                      speech={speech}
                      label="Escuchar Prólogo"
                    />
                  </div>
                  <h2 className="prologue-title display-6 fw-bold mb-3">{course.prologue.title}</h2>
                  <p className="lead-subtext body-text fw-semibold mb-3">{course.prologue.lead}</p>
                  <p className="body-text mb-4">{course.prologue.body}</p>

                  <h4 className="fw-bold mb-3 text-contrast-primary">
                    Los Tres Pilares de la Transición Paradigmática:
                  </h4>
                  <div className="row g-3 mb-4">
                    {course.prologue.transitionPoints.map((pt, pIdx) => {
                      const pillarId = `prologue-pillar-${pIdx}`;
                      const isPlayingPillar = speech.activeSectionId === pillarId;
                      return (
                        <div key={pIdx} className="col-12 col-md-4">
                          <div
                            className={`p-4 rounded-4 border bg-surface-elevated h-100 d-flex flex-column justify-content-between transition-all ${
                              isPlayingPillar ? 'audio-section-playing' : ''
                            }`}
                          >
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small fw-bold">
                                  Pilar {pIdx + 1}
                                </span>
                                <SectionAudioButton
                                  sectionId={pillarId}
                                  speechText={`Pilar ${pIdx + 1}: ${pt.title}. ${pt.desc}`}
                                  sectionTitle={`Pilar ${pIdx + 1}: ${pt.title}`}
                                  speech={speech}
                                  label="Audio"
                                  size="sm"
                                />
                              </div>
                              <h5 className="fw-bold mb-2 text-contrast-primary">{pt.title}</h5>
                              <p className="body-text small mb-0">{pt.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm fw-semibold d-flex align-items-center gap-2"
                      onClick={() => {
                        setActiveTab('content');
                        setActiveModuleId(course.modules[0].id);
                        setActiveTopicId(course.modules[0].topics[0].id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <span>Iniciar Módulo 1</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <>
                  <div className="lesson-container bg-surface p-4 p-md-5 rounded-4 shadow-sm border mb-4">
                    <ModuleRenderer activeTopic={activeTopic} speech={speech} childSections={childSections} />
                  </div>

                  {/* Lesson Navigation Footer */}
                  <div className="lesson-footer-nav d-flex justify-content-between align-items-center p-3 rounded-4 bg-card border shadow-sm">
                    <button
                      className="btn btn-outline-secondary rounded-pill px-3"
                      onClick={handlePrevLesson}
                      disabled={currentTopicIndex <= 0}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Lección Anterior
                    </button>

                    <button
                      className="btn btn-outline-success rounded-pill px-3"
                      onClick={() => handleMarkAsCompleted(activeTopicId)}
                    >
                      <i className={`bi ${completedTopics[activeTopicId] ? 'bi-check2-circle text-success' : 'bi-check2'} me-1`}></i>
                      {completedTopics[activeTopicId] ? 'Completada ✓' : 'Marcar como completada'}
                    </button>

                    <button
                      className="btn btn-primary rounded-pill px-3"
                      onClick={handleNextLesson}
                    >
                      <span>Siguiente</span>
                      <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'glossary' && (
                <CourseGlossary glossary={course.glossary} speech={speech} course={course} />
              )}

              {activeTab === 'exam' && (
                <CourseQuiz examQuestions={course.exam} speech={speech} course={course} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
