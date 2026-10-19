import React from 'react';
import SectionAudioButton from './SectionAudioButton';

/**
 * ModuleRenderer component:
 * Renders structured, pedagogically rich course content.
 * Integrates Child Audio Buttons (SectionAudioButton) on each individual subsection
 * allowing the student to listen to any concept or card separately.
 * Highlights the actively playing card with a luminous accent.
 */
export default function ModuleRenderer({ activeTopic, speech, childSections = [] }) {
  if (!activeTopic) {
    return (
      <div className="p-5 text-center text-muted">
        Selecciona un tema del menú lateral para comenzar a aprender.
      </div>
    );
  }

  const { content, title, speechText } = activeTopic;
  const activeSectionId = speech?.activeSectionId;
  const isPlaying = speech?.isPlaying;
  const isPaused = speech?.isPaused;

  const handleListenFullLesson = () => {
    if (!speech) return;
    if (isPlaying) {
      if (isPaused) {
        speech.resume();
      } else {
        speech.pause();
      }
    } else {
      if (childSections && childSections.length > 0) {
        speech.playFullLesson(childSections, title);
      } else if (speechText) {
        speech.playSection(`topic-${activeTopic.id}`, speechText, title);
      }
    }
  };

  return (
    <div className="module-topic-content">
      {/* Topic Header with Full Lesson Trigger */}
      <div className="topic-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="topic-title fw-bold mb-1 text-contrast-primary">{title}</h2>
          <span className="badge bg-primary text-white px-3 py-1 rounded-pill small fw-semibold">
            Lección Interactiva Profesional
          </span>
        </div>

        <button
          className={`btn ${
            isPlaying && !isPaused
              ? 'btn-warning text-dark'
              : isPaused
              ? 'btn-outline-warning'
              : 'btn-primary text-white'
          } btn-sm rounded-pill d-flex align-items-center gap-2 px-3 shadow-sm fw-semibold`}
          onClick={handleListenFullLesson}
          title={
            isPlaying && !isPaused
              ? 'Pausar audio de la lección'
              : isPaused
              ? 'Reanudar audio'
              : 'Escuchar toda esta lección completa'
          }
        >
          <i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-volume-up-fill'}`}></i>
          <span>
            {isPlaying && !isPaused ? 'Pausar Lección' : isPaused ? 'Reanudar Lección' : 'Escuchar Lección Completa'}
          </span>
        </button>
      </div>

      {/* 1. Concepts with Math & Formulas */}
      {content.type === 'concepts' && (
        <div className="concepts-wrapper d-flex flex-column gap-4">
          {content.subsections.map((sub, idx) => {
            const subId = `concept-${idx}`;
            const isPlayingSub = activeSectionId === subId;
            const subSpeechText = `${sub.subtitle}. ${sub.body || ''} ${sub.formulaExplanation || ''} ${sub.impactQA ? 'Impacto para QA: ' + sub.impactQA : ''}`;

            return (
              <div
                key={idx}
                className={`concept-card p-4 rounded-4 shadow-sm border bg-card transition-all ${
                  isPlayingSub ? 'audio-section-playing' : ''
                }`}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="section-heading fw-bold mb-0">{sub.subtitle}</h3>
                  <SectionAudioButton
                    sectionId={subId}
                    speechText={subSpeechText}
                    sectionTitle={sub.subtitle}
                    speech={speech}
                    label="Escuchar concepto"
                  />
                </div>

                {sub.body && <p className="body-text mb-3">{sub.body}</p>}

                {sub.formula && (
                  <div className="formula-container p-4 rounded-3 text-center my-3 border">
                    <span className="formula-badge d-inline-block px-3 py-1.5 rounded-pill small fw-bold mb-2">
                      Fórmula Matemática de Inferencia
                    </span>
                    <div className="math-formula-display fs-2 fw-bold">
                      {sub.formula}
                    </div>
                    {sub.formulaExplanation && (
                      <p className="formula-explanation small mt-3 mb-0 text-start">
                        {sub.formulaExplanation}
                      </p>
                    )}
                  </div>
                )}

                {sub.impactQA && (
                  <div className="qa-callout callout-warning p-3.5 rounded-3 d-flex align-items-start gap-3 mt-3">
                    <i className="bi bi-lightbulb-fill fs-4 mt-0.5 text-warning"></i>
                    <div>
                      <strong className="callout-title d-block mb-1">Impacto Metodológico para QA:</strong>
                      <span className="callout-body">{sub.impactQA}</span>
                    </div>
                  </div>
                )}

                {sub.cards && (
                  <div className="row g-3 mt-3">
                    {sub.cards.map((card, cIdx) => {
                      const cardId = `subcard-${idx}-${cIdx}`;
                      const isPlayingCard = activeSectionId === cardId;
                      const cardSpeech = `${card.title}. ${card.description}. ${card.bullets.join('. ')}`;

                      return (
                        <div key={cIdx} className="col-12 col-md-6">
                          <div
                            className={`p-4 rounded-3 border bg-surface-elevated h-100 concept-subcard transition-all ${
                              isPlayingCard ? 'audio-section-playing' : ''
                            }`}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="subcard-title fw-bold mb-0">{card.title}</h5>
                              <SectionAudioButton
                                sectionId={cardId}
                                speechText={cardSpeech}
                                sectionTitle={card.title}
                                speech={speech}
                                label="Audio"
                                size="sm"
                              />
                            </div>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-0.5 small fw-semibold mb-2 d-inline-block">
                              {card.badge}
                            </span>
                            <p className="subcard-desc mb-3">{card.description}</p>
                            <ul className="subcard-list mb-0 ps-3">
                              {card.bullets.map((b, bIdx) => (
                                <li
                                  key={bIdx}
                                  className="mb-2"
                                  dangerouslySetInnerHTML={{
                                    __html: b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  }}
                                ></li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Four Dimensions Taxonomy */}
      {content.type === 'four_dimensions' && (
        <div className="four-dimensions-wrapper d-flex flex-column gap-4">
          <p className="body-text lead-subtext mb-2">{content.description}</p>
          <div className="row g-4">
            {content.dimensions.map((dim, idx) => {
              const dimId = `dim-${dim.id}`;
              const isPlayingDim = activeSectionId === dimId;
              const dimSpeech = `Dimensión de Riesgo: ${dim.name}. Defectos asociados: ${dim.defects
                .map((d) => `${d.name}: ${d.desc}`)
                .join('. ')}`;

              return (
                <div key={dim.id} className="col-12 col-md-6">
                  <div
                    className={`dimension-card p-4 rounded-4 shadow-sm border bg-card h-100 transition-all ${
                      isPlayingDim ? 'audio-section-playing' : ''
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`dim-icon-pill bg-${dim.color}-subtle text-${dim.color}`}>
                          <i className={`bi ${dim.icon} fs-4`}></i>
                        </div>
                        <div>
                          <span className="badge bg-surface-elevated text-muted border small rounded-pill">Dimensión {idx + 1}</span>
                          <h4 className="fw-bold mb-0 text-contrast-primary">{dim.name}</h4>
                        </div>
                      </div>
                      <SectionAudioButton
                        sectionId={dimId}
                        speechText={dimSpeech}
                        sectionTitle={dim.name}
                        speech={speech}
                        label="Escuchar"
                      />
                    </div>

                    <div className="d-flex flex-column gap-2.5">
                      {dim.defects.map((def, dIdx) => (
                        <div key={dIdx} className="defect-item p-3 rounded-3 border bg-surface-elevated">
                          <strong className="defect-name d-block mb-1">{def.name}</strong>
                          <span className="defect-desc small">{def.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Deep Dive Risks */}
      {content.type === 'deep_dive_risks' && (
        <div className="deep-dive-wrapper d-flex flex-column gap-4">
          {content.subsections.map((sub, idx) => {
            const subId = `deep-dive-${idx}`;
            const isPlayingSub = activeSectionId === subId;

            return (
              <div
                key={idx}
                className={`p-4 rounded-4 shadow-sm border bg-card transition-all ${
                  isPlayingSub ? 'audio-section-playing' : ''
                }`}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="section-heading fw-bold mb-0">{sub.title}</h3>
                  <SectionAudioButton
                    sectionId={subId}
                    speechText={`${sub.title}. ${
                      sub.comparison
                        ? sub.comparison.map((c) => `${c.type}: ${c.detail}. Estrategia de prueba: ${c.qaTactic}`).join('. ')
                        : sub.card ? `${sub.card.premise}. ${sub.card.qaLesson}` : ''
                    }`}
                    sectionTitle={sub.title}
                    speech={speech}
                    label="Escuchar análisis"
                  />
                </div>

                {sub.comparison && (
                  <div className="row g-3">
                    {sub.comparison.map((item, cIdx) => (
                      <div key={cIdx} className="col-12 col-md-6">
                        <div className="p-4 rounded-3 border bg-surface-elevated h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="fw-bold mb-0 text-contrast-primary">{item.type}</h5>
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2.5 py-1 small fw-semibold">
                                {item.badge}
                              </span>
                            </div>
                            <p className="body-text mb-3">{item.detail}</p>
                          </div>
                          <div className="p-3 rounded-3 bg-primary-subtle border border-primary-subtle">
                            <strong className="text-primary small d-block mb-1">
                              <i className="bi bi-shield-check me-1"></i> Estrategia de Prueba QA:
                            </strong>
                            <span className="callout-body small">{item.qaTactic}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sub.card && (
                  <div className="paired-testing-box p-4 rounded-3 border bg-surface-elevated mt-2">
                    <p className="body-text fw-medium mb-3">{sub.card.premise}</p>

                    <div className="p-3 rounded-3 bg-surface border mb-3">
                      <span className="text-muted fw-bold d-block small mb-1">Vector Común Idéntico (Control):</span>
                      <code className="vector-code-block">{sub.card.example.commonVector}</code>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <div className="p-3 rounded-3 border bg-surface">
                          <span className="badge bg-primary text-white rounded-pill small mb-1">Variante A (Control)</span>
                          <p className="body-text fw-semibold mb-0">{sub.card.example.variantA}</p>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="p-3 rounded-3 border bg-surface">
                          <span className="badge bg-warning text-dark rounded-pill small mb-1">Variante B (Atributo Sensible)</span>
                          <p className="body-text fw-semibold mb-0">{sub.card.example.variantB}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-3 bg-success-subtle border border-success-subtle mb-3">
                      <strong className="text-success-emphasis d-block mb-1">
                        <i className="bi bi-check-circle-fill me-1"></i> Criterio de Aceptación:
                      </strong>
                      <span className="callout-body small">{sub.card.example.acceptanceCriteria}</span>
                    </div>

                    <div className="p-3 rounded-3 bg-surface border">
                      <strong className="text-primary small d-block mb-1">
                        <i className="bi bi-journal-check me-1"></i> Lección Metodológica para Auditorías:
                      </strong>
                      <span className="body-text small">{sub.card.qaLesson}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Architecture Levels */}
      {content.type === 'architecture_levels' && (
        <div className="architecture-wrapper d-flex flex-column gap-4">
          <p className="body-text lead-subtext">
            Es fundamental clasificar formalmente el sistema bajo prueba para definir los puntos de inspección y control de calidad requeridos:
          </p>
          {content.levels.map((lvl) => {
            const lvlId = `arch-level-${lvl.level}`;
            const isPlayingLvl = activeSectionId === lvlId;
            const lvlSpeech = `Nivel ${lvl.level}: ${lvl.name}. Cadena arquitectural: ${lvl.flow}. Descripción: ${lvl.description}. Puntos críticos de inspección de calidad: ${lvl.qaChecklist.join('. ')}`;

            return (
              <div
                key={lvl.level}
                className={`arch-card p-4 rounded-4 shadow-sm border bg-card transition-all ${
                  isPlayingLvl ? 'audio-section-playing' : ''
                }`}
              >
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary text-white px-3 py-1.5 rounded-pill fw-bold">
                      Nivel {lvl.level}
                    </span>
                    <h3 className="fw-bold mb-0 text-contrast-primary">{lvl.name}</h3>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-surface-elevated text-secondary border px-3 py-1.5 rounded-pill small fw-semibold">
                      {lvl.badge}
                    </span>
                    <SectionAudioButton
                      sectionId={lvlId}
                      speechText={lvlSpeech}
                      sectionTitle={`Nivel ${lvl.level}: ${lvl.name}`}
                      speech={speech}
                      label="Escuchar Nivel"
                    />
                  </div>
                </div>

                <div className="arch-flow-box p-3 rounded-3 mb-3 border">
                  <span className="flow-label d-block mb-1">Cadena Arquitectural:</span>
                  <code className="flow-code-text">{lvl.flow}</code>
                </div>

                <div className="mb-3">
                  <strong className="d-block mb-1 text-contrast-primary">Capacidad y Dinámica:</strong>
                  <p className="body-text mb-0">{lvl.description}</p>
                </div>

                <div className="p-3.5 rounded-3 bg-primary-subtle border border-primary-subtle">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-shield-check text-primary fs-5"></i>
                    <strong className="text-primary fw-bold">Puntos Críticos de Inspección QA:</strong>
                  </div>
                  <ul className="mb-0 ps-3 arch-qa-list">
                    {lvl.qaChecklist.map((item, qIdx) => (
                      <li key={qIdx} className="mb-1.5 body-text fw-medium">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Eight Phases QA Framework */}
      {content.type === 'eight_phases' && (
        <div className="eight-phases-wrapper d-flex flex-column gap-4">
          <p className="body-text lead-subtext">
            Metodología formal en 8 fases para planificar, diseñar, ejecutar y gobernar pruebas en sistemas potenciados por IA Generativa y Agentes:
          </p>

          <div className="d-flex flex-column gap-3">
            {content.phases.map((ph) => {
              const phaseId = `phase-${ph.phase}`;
              const isPlayingPhase = activeSectionId === phaseId;
              const phaseSpeech = `Fase ${ph.phase}: ${ph.name}. Resumen: ${ph.summary}. Detalles metodológicos: ${ph.details.join('. ')}`;

              return (
                <div
                  key={ph.phase}
                  className={`phase-card p-4 rounded-4 shadow-sm border bg-card transition-all ${
                    isPlayingPhase ? 'audio-section-playing' : ''
                  }`}
                >
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <span className="phase-number-badge">{ph.phase}</span>
                      <h4 className="fw-bold mb-0 text-contrast-primary">Fase {ph.phase}: {ph.name}</h4>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 small fw-semibold">
                        {ph.badge}
                      </span>
                      <SectionAudioButton
                        sectionId={phaseId}
                        speechText={phaseSpeech}
                        sectionTitle={`Fase ${ph.phase}: ${ph.name}`}
                        speech={speech}
                        label="Escuchar Fase"
                      />
                    </div>
                  </div>

                  <p className="body-text fw-semibold mb-3">{ph.summary}</p>

                  {ph.formula && (
                    <div className="formula-container p-3 rounded-3 text-center my-3 border">
                      <span className="formula-badge d-inline-block px-3 py-1 rounded-pill small fw-bold mb-1">
                        Fórmula de Criticidad
                      </span>
                      <div className="math-formula-display fs-4 fw-bold">{ph.formula}</div>
                    </div>
                  )}

                  <ul className="phase-details-list mb-0 ps-3">
                    {ph.details.map((dt, dIdx) => (
                      <li key={dIdx} className="mb-2 body-text">{dt}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Prompt Engineering Full */}
      {content.type === 'prompt_engineering_full' && (
        <div className="prompt-eng-wrapper d-flex flex-column gap-4">
          <div className="p-4 rounded-4 shadow-sm border bg-card">
            <h3 className="section-heading fw-bold mb-2">La Estructura Canónica de 6 Componentes</h3>
            <p className="body-text mb-4">
              Para garantizar que los prompts para testing sean auditables, modulares y repetibles, todo prompt profesional debe construirse bajo este estándar:
            </p>

            <div className="row g-3">
              {content.components.map((comp) => {
                const compId = `prompt-comp-${comp.num}`;
                const isPlayingComp = activeSectionId === compId;
                const compSpeech = `Componente ${comp.num}: ${comp.name}. Enfoque: ${comp.focus}. Ejemplo aplicado a QA: ${comp.example}`;

                return (
                  <div key={comp.num} className="col-12 col-md-6">
                    <div
                      className={`canonical-component-card p-4 rounded-4 border h-100 d-flex flex-column justify-content-between transition-all ${
                        isPlayingComp ? 'audio-section-playing' : ''
                      }`}
                    >
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-primary text-white rounded-pill px-3 py-1.5 small fw-bold">
                            {comp.num}. {comp.name}
                          </span>
                          <SectionAudioButton
                            sectionId={compId}
                            speechText={compSpeech}
                            sectionTitle={`${comp.num}. ${comp.name}`}
                            speech={speech}
                            label="Audio"
                            size="sm"
                          />
                        </div>
                        <p className="canonical-focus-text mb-3">{comp.focus}</p>
                      </div>
                      <div className="canonical-example-box p-3 rounded-3 border">
                        <span className="canonical-example-label d-block mb-1">
                          <i className="bi bi-code-square me-1"></i> Ejemplo aplicado a QA:
                        </span>
                        <span className="canonical-example-text">{comp.example}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-4 shadow-sm border bg-card">
            <h3 className="section-heading fw-bold mb-3">Patrones de Prompting Avanzados en Testing</h3>
            <div className="row g-3">
              {content.patterns.map((pat, pIdx) => {
                const patId = `prompt-pat-${pIdx}`;
                const isPlayingPat = activeSectionId === patId;
                const patSpeech = `Patrón de Prompting: ${pat.name}. Descripción: ${pat.desc}`;

                return (
                  <div key={pIdx} className="col-12 col-md-6">
                    <div
                      className={`p-4 rounded-4 border bg-surface-elevated h-100 transition-all ${
                        isPlayingPat ? 'audio-section-playing' : ''
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <i className={`bi ${pat.icon} fs-4 text-primary`}></i>
                          <h5 className="fw-bold mb-0 text-contrast-primary">{pat.name}</h5>
                        </div>
                        <SectionAudioButton
                          sectionId={patId}
                          speechText={patSpeech}
                          sectionTitle={pat.name}
                          speech={speech}
                          label="Audio"
                          size="sm"
                        />
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 small fw-semibold mb-2 d-inline-block">
                        {pat.badge}
                      </span>
                      <p className="body-text mb-0 mt-2">{pat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. Metrics and Calibration */}
      {content.type === 'metrics_and_calibration' && (
        <div className="metrics-wrapper d-flex flex-column gap-4">
          <div className="p-4 rounded-4 shadow-sm border bg-card">
            <h3 className="section-heading fw-bold mb-3">Catálogo de Métricas Específicas de Calidad</h3>
            <div className="row g-3">
              {content.metrics.map((m, mIdx) => {
                const metricId = `metric-${mIdx}`;
                const isPlayingMetric = activeSectionId === metricId;
                const metricSpeech = `Métrica: ${m.name}. Meta recomendada: ${m.target}. Definición: ${m.definition}`;

                return (
                  <div key={mIdx} className="col-12 col-md-6">
                    <div
                      className={`p-4 rounded-4 border bg-surface-elevated h-100 d-flex flex-column justify-content-between transition-all ${
                        isPlayingMetric ? 'audio-section-playing' : ''
                      }`}
                    >
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="fw-bold mb-0 text-contrast-primary">{m.name}</h5>
                          <SectionAudioButton
                            sectionId={metricId}
                            speechText={metricSpeech}
                            sectionTitle={m.name}
                            speech={speech}
                            label="Audio"
                            size="sm"
                          />
                        </div>
                        <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle rounded-pill px-2.5 py-1 small fw-bold mb-2 d-inline-block">
                          Meta: {m.target}
                        </span>
                        <div className="formula-container p-3 rounded-3 text-center my-3 border">
                          <div className="math-formula-display fs-5 fw-bold">{m.formula}</div>
                        </div>
                        <p className="body-text small mb-0">{m.definition}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-4 shadow-sm border bg-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="section-heading fw-bold mb-0">Rúbrica Estándar para Evaluación con LLM como Juez (1 a 5)</h3>
              <SectionAudioButton
                sectionId="rubric-all"
                speechText={`Rúbrica de evaluación con LLM como juez: ${content.rubric.map((r) => `Nivel ${r.score}: ${r.desc}`).join('. ')}`}
                sectionTitle="Rúbrica LLM-Juez"
                speech={speech}
                label="Escuchar Rúbrica"
              />
            </div>
            <div className="d-flex flex-column gap-2.5">
              {content.rubric.map((r, rIdx) => (
                <div key={rIdx} className="p-3 rounded-3 border bg-surface-elevated d-flex flex-wrap align-items-center gap-3">
                  <span className={`badge ${r.badge} px-3 py-2 rounded-pill fw-bold fs-6`}>
                    Nivel {r.score}
                  </span>
                  <span className="body-text fw-medium flex-grow-1">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-4 shadow-sm border bg-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="section-heading fw-bold mb-0">Procedimiento Formal de Calibración Humana</h3>
              <SectionAudioButton
                sectionId="calibration-all"
                speechText={`Procedimiento formal de calibración humana: ${content.calibrationSteps.join('. ')}`}
                sectionTitle="Calibración Humana"
                speech={speech}
                label="Escuchar Protocolo"
              />
            </div>
            <div className="row g-3">
              {content.calibrationSteps.map((st, sIdx) => (
                <div key={sIdx} className="col-12 col-md-6">
                  <div className="p-3.5 rounded-3 border bg-surface-elevated h-100 d-flex gap-3">
                    <div className="step-circle-small">{sIdx + 1}</div>
                    <span className="body-text fw-medium">{st}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. LLMOps Pipeline & Drift */}
      {content.type === 'llmops_pipeline' && (
        <div className="llmops-wrapper d-flex flex-column gap-4">
          <div className="p-4 rounded-4 shadow-sm border bg-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="section-heading fw-bold mb-0">Arquitectura del Pipeline de Pruebas Continuas en CI/CD</h3>
              <SectionAudioButton
                sectionId="pipeline-stages-all"
                speechText={`Pipeline de pruebas continuas en CI/CD: ${content.pipelineStages.map((ps, idx) => `Paso ${idx + 1}, ${ps.step}: ${ps.detail}`).join('. ')}`}
                sectionTitle="Pipeline CI/CD"
                speech={speech}
                label="Escuchar Pipeline"
              />
            </div>
            <div className="row g-3">
              {content.pipelineStages.map((ps, psIdx) => (
                <div key={psIdx} className="col-12 col-md-6 col-lg-3">
                  <div className="p-3.5 rounded-4 border bg-surface-elevated text-center h-100 d-flex flex-column justify-content-between">
                    <div>
                      <span className="badge bg-primary text-white rounded-pill px-3 py-1 small fw-bold mb-2">
                        Paso {psIdx + 1}
                      </span>
                      <h6 className="fw-bold mb-2 text-contrast-primary">{ps.step}</h6>
                    </div>
                    <p className="body-text small mb-0">{ps.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-4 shadow-sm border bg-card">
            <h3 className="section-heading fw-bold mb-3">Monitoreo Post-Despliegue y Detección de Deriva (Drift)</h3>
            <div className="row g-3 mb-4">
              {content.drifts.map((dr, drIdx) => {
                const driftId = `drift-${drIdx}`;
                const isPlayingDrift = activeSectionId === driftId;
                const driftSpeech = `Tipo de deriva: ${dr.name}. Detalle: ${dr.detail}. Mitigación para QA: ${dr.mitigation}`;

                return (
                  <div key={drIdx} className="col-12 col-md-6">
                    <div
                      className={`p-4 rounded-3 border bg-surface-elevated h-100 transition-all ${
                        isPlayingDrift ? 'audio-section-playing' : ''
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="fw-bold mb-0 text-contrast-primary">{dr.name}</h5>
                        <SectionAudioButton
                          sectionId={driftId}
                          speechText={driftSpeech}
                          sectionTitle={dr.name}
                          speech={speech}
                          label="Audio"
                          size="sm"
                        />
                      </div>
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2.5 py-1 small fw-semibold mb-2 d-inline-block">
                        {dr.badge}
                      </span>
                      <p className="body-text mb-3">{dr.detail}</p>
                      <div className="p-3 rounded-3 bg-surface border">
                        <strong className="text-primary small d-block mb-1">Control de Mitigación QA:</strong>
                        <span className="body-text small">{dr.mitigation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-3 bg-surface-elevated border">
              <strong className="text-contrast-primary d-block mb-2">Controles Operacionales Indispensables en Producción:</strong>
              <ul className="mb-0 ps-3">
                {content.controls.map((ctrl, cIdx) => (
                  <li key={cIdx} className="mb-1.5 body-text">{ctrl}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
