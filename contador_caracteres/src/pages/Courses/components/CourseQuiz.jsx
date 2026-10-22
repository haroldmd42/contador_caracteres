import React, { useState, useMemo } from 'react';

/**
 * Interactive Certification Simulator Quiz component.
 * Implements question selection, instant verification ("Comprobar respuesta"),
 * visual correct/incorrect feedback, score calculation with passing threshold,
 * and technical justification display aligned with ISTQB standards.
 */
export default function CourseQuiz({ examQuestions = [], speech, course }) {
  // Store user selections: { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Store check status: { [questionId]: boolean }
  const [checkedQuestions, setCheckedQuestions] = useState({});
  // Filter mode: 'all' | 'unanswered' | 'correct' | 'incorrect'
  const [filterMode, setFilterMode] = useState('all');

  const handleSelectOption = (questionId, optionKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleCheckQuestion = (questionId) => {
    if (!selectedAnswers[questionId]) return;
    setCheckedQuestions((prev) => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleCheckAll = () => {
    const newChecked = {};
    examQuestions.forEach((q) => {
      if (selectedAnswers[q.id]) {
        newChecked[q.id] = true;
      }
    });
    setCheckedQuestions((prev) => ({ ...prev, ...newChecked }));
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas reiniciar todas tus respuestas del simulacro?')) {
      setSelectedAnswers({});
      setCheckedQuestions({});
      if (speech?.stop) speech.stop();
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    let answeredCount = 0;
    let checkedCount = 0;
    let correctCount = 0;

    examQuestions.forEach((q) => {
      if (selectedAnswers[q.id]) answeredCount++;
      if (checkedQuestions[q.id]) {
        checkedCount++;
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    const scorePercentage = checkedCount > 0 ? Math.round((correctCount / checkedCount) * 100) : 0;
    const isPassing = scorePercentage >= 70;

    return {
      total: examQuestions.length,
      answeredCount,
      checkedCount,
      correctCount,
      scorePercentage,
      isPassing
    };
  }, [examQuestions, selectedAnswers, checkedQuestions]);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return examQuestions.filter((q) => {
      const isChecked = Boolean(checkedQuestions[q.id]);
      const isCorrect = selectedAnswers[q.id] === q.correctAnswer;

      if (filterMode === 'unanswered') return !isChecked;
      if (filterMode === 'correct') return isChecked && isCorrect;
      if (filterMode === 'incorrect') return isChecked && !isCorrect;
      return true;
    });
  }, [examQuestions, selectedAnswers, checkedQuestions, filterMode]);

  const handleListenQuestion = (q) => {
    if (!speech?.speak) return;
    const isChecked = checkedQuestions[q.id];
    let text = `Pregunta ${q.questionNumber}: ${q.question}. `;
    text += 'Opciones: ';
    q.options.forEach((opt) => {
      text += `Opción ${opt.key}: ${opt.text}. `;
    });
    if (isChecked) {
      text += `Respuesta correcta: Opción ${q.correctAnswer}. Justificación técnica: ${q.justification}`;
    }
    speech.speak(text);
  };

  const quizTitle = course?.badge
    ? `Evaluación Final de Certificación (${course.badge})`
    : 'Simulador de Certificación Oficial';

  const quizDesc = course?.title
    ? `Pon a prueba tus conocimientos sobre ${course.title}. Marca tu opción y haz clic en Comprobar respuesta para ver el veredicto y la justificación técnica razonada.`
    : 'Simulacro oficial tipo examen. Marca tu respuesta para conocer la justificación.';

  return (
    <div className="course-quiz-container">
      {/* Quiz Header & Score Dashboard */}
      <div className="quiz-header-card p-4 rounded-4 shadow-sm border bg-card mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
                <i className="bi bi-award-fill me-1"></i> Simulacro Tipo Examen
              </span>
              <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1.5 rounded-pill fw-semibold">
                {examQuestions.length} Preguntas Oficiales
              </span>
              <span className="badge bg-info-subtle text-info px-2.5 py-1.5 rounded-pill">
                Umbral de Aprobación: 70%
              </span>
            </div>
            <h3 className="quiz-main-title mt-2 mb-1 fw-bold text-contrast-primary">
              {quizTitle}
            </h3>
            <p className="text-muted small mb-0">
              {quizDesc}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              onClick={handleReset}
              title="Reiniciar respuestas"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reiniciar
            </button>
            <button
              className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm"
              onClick={handleCheckAll}
              disabled={stats.answeredCount === 0}
            >
              <i className="bi bi-check2-all me-1"></i> Comprobar todas ({stats.answeredCount})
            </button>
          </div>
        </div>

        {/* Score & Progress Bar */}
        <div className="quiz-score-bar bg-surface-elevated p-3 rounded-3 border">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-5">
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-3 fw-bold text-gradient">
                  {stats.checkedCount > 0 ? `${stats.scorePercentage}%` : '0%'}
                </span>
                <span className="text-muted small">
                  ({stats.correctCount} correctas de {stats.checkedCount} comprobadas)
                </span>
                {stats.checkedCount > 0 && (
                  <span
                    className={`badge ${
                      stats.isPassing ? 'bg-success text-white' : 'bg-warning text-dark'
                    } rounded-pill px-2.5 py-1 small fw-bold ms-auto`}
                  >
                    {stats.isPassing ? '¡Aprobado! (>= 70%)' : 'En Progreso (< 70%)'}
                  </span>
                )}
              </div>
              <div className="progress mt-2" style={{ height: '8px' }}>
                <div
                  className={`progress-bar ${stats.isPassing ? 'bg-success' : 'bg-warning'} transition-all`}
                  role="progressbar"
                  style={{ width: `${stats.scorePercentage}%` }}
                  aria-valuenow={stats.scorePercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            <div className="col-12 col-md-7">
              <div className="d-flex flex-wrap justify-content-md-end gap-2">
                <button
                  className={`btn btn-sm ${filterMode === 'all' ? 'btn-primary text-white' : 'btn-outline-secondary'} rounded-pill px-3`}
                  onClick={() => setFilterMode('all')}
                >
                  Todas ({examQuestions.length})
                </button>
                <button
                  className={`btn btn-sm ${filterMode === 'unanswered' ? 'btn-primary text-white' : 'btn-outline-secondary'} rounded-pill px-3`}
                  onClick={() => setFilterMode('unanswered')}
                >
                  Pendientes ({examQuestions.length - stats.checkedCount})
                </button>
                <button
                  className={`btn btn-sm ${filterMode === 'correct' ? 'btn-success text-white' : 'btn-outline-secondary'} rounded-pill px-3`}
                  onClick={() => setFilterMode('correct')}
                  disabled={stats.correctCount === 0}
                >
                  <i className="bi bi-check-lg me-1"></i> Correctas ({stats.correctCount})
                </button>
                <button
                  className={`btn btn-sm ${filterMode === 'incorrect' ? 'btn-danger text-white' : 'btn-outline-secondary'} rounded-pill px-3`}
                  onClick={() => setFilterMode('incorrect')}
                  disabled={stats.checkedCount - stats.correctCount === 0}
                >
                  <i className="bi bi-x-lg me-1"></i> Incorrectas ({stats.checkedCount - stats.correctCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner if all questions are checked */}
      {stats.checkedCount === examQuestions.length && examQuestions.length > 0 && (
        <div className={`p-4 rounded-4 mb-4 border shadow-sm ${stats.isPassing ? 'bg-success-subtle border-success' : 'bg-warning-subtle border-warning'}`}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <i className={`bi ${stats.isPassing ? 'bi-trophy-fill text-success fs-1' : 'bi-exclamation-triangle-fill text-warning fs-1'}`}></i>
              <div>
                <h4 className="fw-bold mb-1">
                  {stats.isPassing ? '¡Felicitaciones! Has superado el Simulacro' : 'Simulacro Finalizado'}
                </h4>
                <p className="mb-0 small">
                  Has obtenido <strong>{stats.correctCount}</strong> aciertos de <strong>{examQuestions.length}</strong> preguntas ({stats.scorePercentage}%).
                  {stats.isPassing
                    ? ' Tu puntaje califica como aprobado según los estándares de certificación ISTQB.'
                    : ' Te recomendamos repasar los módulos y glosario del curso antes de volver a intentarlo.'}
                </p>
              </div>
            </div>
            <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-semibold" onClick={handleReset}>
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reintentar Examen
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="questions-list d-flex flex-column gap-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-5 bg-card rounded-4 border">
            <i className="bi bi-check2-circle text-success fs-1"></i>
            <h5 className="mt-2 fw-bold">No hay preguntas en este filtro</h5>
            <button className="btn btn-sm btn-outline-primary mt-2 rounded-pill px-3" onClick={() => setFilterMode('all')}>
              Ver todas las preguntas
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const selectedOpt = selectedAnswers[q.id];
            const isChecked = Boolean(checkedQuestions[q.id]);
            const isCorrect = selectedOpt === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`question-card p-4 rounded-4 shadow-sm border transition-all ${
                  isChecked
                    ? isCorrect
                      ? 'border-success-subtle quiz-card-correct'
                      : 'border-danger-subtle quiz-card-incorrect'
                    : 'bg-card'
                }`}
              >
                {/* Question Header */}
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary text-white rounded-pill px-3 py-1.5 fw-bold">
                      Pregunta {q.questionNumber}
                    </span>
                    {isChecked && (
                      <span
                        className={`badge ${
                          isCorrect ? 'bg-success text-white' : 'bg-danger text-white'
                        } rounded-pill px-2.5 py-1 d-flex align-items-center gap-1 fw-semibold`}
                      >
                        <i className={`bi ${isCorrect ? 'bi-check-lg' : 'bi-x-lg'}`}></i>
                        {isCorrect ? 'Correcta' : 'Incorrecta'}
                      </span>
                    )}
                  </div>

                  <button
                    className="btn btn-sm btn-outline-secondary rounded-circle control-circle"
                    onClick={() => handleListenQuestion(q)}
                    title="Escuchar esta pregunta"
                  >
                    <i className="bi bi-volume-up"></i>
                  </button>
                </div>

                {/* Question Body */}
                <h5 className="question-text fw-semibold mb-3 lh-base text-contrast-primary">
                  {q.question}
                </h5>

                {/* Options list */}
                <div className="options-grid d-flex flex-column gap-2 mb-3">
                  {q.options.map((opt) => {
                    const isSelected = selectedOpt === opt.key;
                    const isOptionCorrect = opt.key === q.correctAnswer;

                    let optionClass = 'option-card';
                    if (isSelected) optionClass += ' selected';

                    if (isChecked) {
                      if (isOptionCorrect) {
                        optionClass += ' correct-answer-highlight';
                      } else if (isSelected && !isCorrect) {
                        optionClass += ' wrong-answer-highlight';
                      } else {
                        optionClass += ' dimmed';
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        className={`${optionClass} text-start p-3 rounded-3 border d-flex align-items-center gap-3 transition-all`}
                        onClick={() => handleSelectOption(q.id, opt.key)}
                        disabled={isChecked}
                      >
                        <span className="option-badge-key fw-bold">
                          {opt.key}
                        </span>
                        <span className="option-text flex-grow-1">
                          {opt.text}
                        </span>
                        {isChecked && isOptionCorrect && (
                          <span className="badge bg-success rounded-pill px-2.5 py-1 small fw-semibold">
                            <i className="bi bi-check2 me-1"></i> Correcta
                          </span>
                        )}
                        {isChecked && isSelected && !isCorrect && (
                          <span className="badge bg-danger rounded-pill px-2.5 py-1 small fw-semibold">
                            <i className="bi bi-x me-1"></i> Tu respuesta
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action button & Justification */}
                <div className="d-flex flex-column gap-3">
                  {!isChecked ? (
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-primary rounded-pill px-4 shadow-sm fw-semibold"
                        onClick={() => handleCheckQuestion(q.id)}
                        disabled={!selectedOpt}
                      >
                        <i className="bi bi-check-circle me-1"></i> Comprobar respuesta
                      </button>
                    </div>
                  ) : (
                    /* Checked feedback & Technical Rationale */
                    <div className={`justification-card p-3 rounded-3 ${isCorrect ? 'justification-correct' : 'justification-incorrect'}`}>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <i className={`bi ${isCorrect ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-danger'} fs-5`}></i>
                          <strong className={isCorrect ? 'text-success' : 'text-danger'}>
                            {isCorrect
                              ? '¡Excelente! Respuesta Correcta (Opción ' + q.correctAnswer + ')'
                              : 'Respuesta Incorrecta — La opción correcta es la ' + q.correctAnswer}
                          </strong>
                        </div>

                        <button
                          className="btn btn-sm btn-link text-decoration-none p-0 d-flex align-items-center gap-1"
                          onClick={() => speech?.speak && speech.speak(`Justificación técnica: ${q.justification}`)}
                          title="Escuchar justificación"
                        >
                          <i className="bi bi-volume-up-fill"></i>
                          <span className="small">Escuchar</span>
                        </button>
                      </div>

                      <div className="justification-text small lh-base">
                        <span className="fw-bold text-uppercase d-block mb-1 text-muted">
                          Justificación Técnica ({course?.badge || 'Oficial ISTQB®'}):
                        </span>
                        {q.justification}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
