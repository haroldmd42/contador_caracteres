import React from 'react';

/**
 * Master Parent Speech Toolbar (Componente Padre de Audio).
 * Controls full lesson sequential playback, child section skipping,
 * pause/stop, playback speed, and human-like natural voice selection with preview capability.
 */
export default function CourseSpeechToolbar({
  speech,
  childSections = [],
  lessonTitle = 'Lección',
}) {
  const {
    supported,
    isPlaying,
    isPaused,
    rate,
    setRate,
    voices,
    selectedVoice,
    setSelectedVoice,
    activeSectionId,
    activeSectionTitle,
    queueProgress,
    playFullLesson,
    playSection,
    skipToNextSection,
    skipToPrevSection,
    pause,
    resume,
    stop,
    previewVoice,
  } = speech;

  if (!supported) {
    return (
      <div className="speech-toolbar-unsupported p-2 rounded-3 text-muted small">
        <i className="bi bi-volume-mute me-1"></i>
        <span>Síntesis de voz no disponible en este navegador.</span>
      </div>
    );
  }

  const handleMasterToggle = () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      // Play entire lesson through all child sections sequentially
      playFullLesson(childSections, lessonTitle);
    }
  };

  const spanishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('es'));
  const otherVoices = voices.filter((v) => !v.lang.toLowerCase().startsWith('es'));

  // Voice quality badge helper
  const getVoiceBadge = (voice) => {
    const name = (voice.name || '').toLowerCase();
    if (name.includes('natural') || name.includes('online')) {
      return { text: 'Natural HD', className: 'bg-success text-white' };
    }
    if (name.includes('google')) {
      return { text: 'Google Natural', className: 'bg-info text-white' };
    }
    if (name.includes('neural')) {
      return { text: 'Neural', className: 'bg-primary text-white' };
    }
    return null;
  };

  return (
    <div className={`course-speech-toolbar ${isPlaying && !isPaused ? 'active-reading' : ''}`}>
      {/* Soundwave & Current Playing Section Info */}
      <div className="toolbar-info d-flex align-items-center gap-2">
        <div className="soundwave-container" title={isPlaying ? 'Audio activo' : 'Listo para reproducir'}>
          <span className={`wave-bar bar-1 ${isPlaying && !isPaused ? 'anim' : ''}`}></span>
          <span className={`wave-bar bar-2 ${isPlaying && !isPaused ? 'anim' : ''}`}></span>
          <span className={`wave-bar bar-3 ${isPlaying && !isPaused ? 'anim' : ''}`}></span>
        </div>

        <div className="toolbar-titles text-truncate" style={{ maxWidth: '280px' }}>
          <div className="d-flex align-items-center gap-1.5">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small px-2 py-0.5 fw-bold" style={{ fontSize: '0.68rem' }}>
              Control Padre
            </span>
            <span className="toolbar-title fw-bold text-truncate text-contrast-primary">
              {isPlaying && activeSectionTitle ? activeSectionTitle : lessonTitle}
            </span>
          </div>

          <span className="toolbar-status small d-block text-truncate text-muted">
            {isPlaying && !isPaused ? (
              queueProgress.total > 1 ? (
                `Reproduciendo hijo ${queueProgress.current} de ${queueProgress.total}`
              ) : (
                'Reproduciendo sección individual...'
              )
            ) : isPaused ? (
              'En pausa'
            ) : (
              `${childSections.length} secciones disponibles para escuchar`
            )}
          </span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="toolbar-controls d-flex align-items-center gap-1.5">
        {/* Previous Child Section Button */}
        {childSections.length > 1 && isPlaying && queueProgress.total > 1 && (
          <button
            className="btn btn-sm btn-outline-secondary rounded-circle control-circle"
            onClick={skipToPrevSection}
            disabled={queueProgress.current <= 1}
            title="Sección hijo anterior"
          >
            <i className="bi bi-skip-backward-fill"></i>
          </button>
        )}

        {/* Master Play / Pause Button */}
        <button
          className={`btn btn-sm ${
            isPlaying && !isPaused ? 'btn-warning text-dark' : 'btn-primary text-white'
          } rounded-pill d-flex align-items-center gap-1.5 px-3 py-1 fw-bold shadow-sm`}
          onClick={handleMasterToggle}
          title={
            isPlaying && !isPaused
              ? 'Pausar audio de la lección'
              : isPaused
              ? 'Reanudar audio'
              : 'Escuchar toda la lección de corrido (padre e hijos)'
          }
        >
          <i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-play-fill'} fs-6`}></i>
          <span>
            {isPlaying && !isPaused ? 'Pausar' : isPaused ? 'Reanudar' : 'Escuchar Todo'}
          </span>
        </button>

        {/* Next Child Section Button */}
        {childSections.length > 1 && isPlaying && queueProgress.total > 1 && (
          <button
            className="btn btn-sm btn-outline-secondary rounded-circle control-circle"
            onClick={skipToNextSection}
            disabled={queueProgress.current >= queueProgress.total}
            title="Siguiente sección hijo"
          >
            <i className="bi bi-skip-forward-fill"></i>
          </button>
        )}

        {/* Stop Button */}
        {isPlaying && (
          <button
            className="btn btn-sm btn-outline-danger rounded-circle control-circle"
            onClick={stop}
            title="Detener audio"
          >
            <i className="bi bi-stop-fill"></i>
          </button>
        )}

        {/* Sections Selector Dropdown (Parent Jump to Child) */}
        {childSections.length > 1 && (
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill px-2.5 py-1 d-flex align-items-center gap-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Seleccionar sección hijo específica para escuchar"
            >
              <i className="bi bi-list-nested text-primary"></i>
              <span className="small d-none d-md-inline">Secciones</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg p-2" style={{ minWidth: '260px', maxHeight: '320px', overflowY: 'auto' }}>
              <li className="dropdown-header text-uppercase small text-muted fw-bold px-2 py-1">
                Elegir Sección Hijo para Escuchar
              </li>
              {childSections.map((sec, sIdx) => {
                const isThisActive = activeSectionId === sec.id && isPlaying;
                return (
                  <li key={sec.id || sIdx} className="mb-1">
                    <button
                      className={`dropdown-item rounded-2 small text-truncate d-flex align-items-center justify-content-between p-2 ${
                        isThisActive ? 'active' : ''
                      }`}
                      onClick={() => playSection(sec.id, sec.speechText, sec.title)}
                    >
                      <span className="text-truncate me-2">{sIdx + 1}. {sec.title}</span>
                      {isThisActive && <i className="bi bi-volume-up-fill text-warning ms-1"></i>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Speed Selector */}
        <div className="dropdown">
          <button
            className="btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill px-2.5 py-1"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="Velocidad de reproducción"
          >
            <i className="bi bi-speedometer2 me-1"></i>
            {rate}x
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow">
            {[0.8, 0.9, 1, 1.15, 1.25, 1.5].map((speed) => (
              <li key={speed}>
                <button
                  className={`dropdown-item small d-flex justify-content-between align-items-center ${
                    rate === speed ? 'active' : ''
                  }`}
                  onClick={() => setRate(speed)}
                >
                  <span>{speed}x</span>
                  {speed === 1 && <span className="badge bg-secondary-subtle text-secondary small ms-2">Normal</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Natural Voice Selector Dropdown with Preview */}
        {voices.length > 0 && (
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill px-2.5 py-1 d-flex align-items-center gap-1.5 voice-selector-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Seleccionar voz natural humana"
            >
              <i className="bi bi-mic-fill text-primary"></i>
              <span className="voice-name-truncated">
                {selectedVoice
                  ? selectedVoice.name.replace(/Microsoft|Google|Desktop|Online|\(Natural\)/gi, '').trim().split(' ')[0]
                  : 'Voz'}
              </span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-lg voice-dropdown-menu p-2" style={{ minWidth: '320px', maxHeight: '380px', overflowY: 'auto' }}>
              <li className="dropdown-header text-uppercase small text-muted fw-bold px-2 py-1">
                Voces en Español (Naturales y Humanas)
              </li>

              {spanishVoices.map((voice) => {
                const badge = getVoiceBadge(voice);
                const isSelected = selectedVoice?.name === voice.name;
                return (
                  <li key={voice.name} className="mb-1">
                    <div className={`p-2 rounded-2 d-flex justify-content-between align-items-center ${isSelected ? 'bg-primary-subtle border border-primary-subtle' : 'bg-surface-elevated'}`}>
                      <button
                        className="btn btn-link text-decoration-none text-start p-0 text-truncate flex-grow-1 text-contrast-primary"
                        onClick={() => setSelectedVoice(voice)}
                        title={voice.name}
                      >
                        <div className="d-flex align-items-center gap-1.5">
                          <span className={`small fw-bold ${isSelected ? 'text-primary' : ''}`}>
                            {voice.name.replace(/Microsoft|Desktop/gi, '').trim()}
                          </span>
                          {badge && (
                            <span className={`badge ${badge.className} rounded-pill small px-1.5 py-0.5`} style={{ fontSize: '0.65rem' }}>
                              {badge.text}
                            </span>
                          )}
                        </div>
                        <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>
                          {voice.lang}
                        </span>
                      </button>

                      <button
                        className="btn btn-sm btn-outline-primary rounded-circle p-1 ms-2"
                        style={{ width: '28px', height: '28px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          previewVoice(voice);
                        }}
                        title="Escuchar muestra de esta voz"
                      >
                        <i className="bi bi-play-fill" style={{ fontSize: '0.85rem' }}></i>
                      </button>
                    </div>
                  </li>
                );
              })}

              {otherVoices.length > 0 && (
                <>
                  <li className="dropdown-divider"></li>
                  <li className="dropdown-header text-uppercase small text-muted fw-bold px-2 py-1">
                    Otras Voces Disponibles
                  </li>
                  {otherVoices.slice(0, 5).map((voice) => (
                    <li key={voice.name}>
                      <button
                        className={`dropdown-item small text-truncate ${selectedVoice?.name === voice.name ? 'active' : ''}`}
                        onClick={() => setSelectedVoice(voice)}
                      >
                        {voice.name} ({voice.lang})
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
