import React from 'react';

/**
 * Child Section Audio Button (Componente Hijo de Audio).
 * Allows listening to an individual subsection independently.
 * Displays animated soundwave when active, and toggles play/pause.
 */
export default function SectionAudioButton({
  sectionId,
  speechText,
  sectionTitle = '',
  speech,
  label = 'Escuchar sección',
  size = 'sm',
  className = '',
}) {
  if (!speech || !speech.supported) return null;

  const { isPlaying, isPaused, activeSectionId, playSection } = speech;
  const isThisSectionPlaying = activeSectionId === sectionId && isPlaying;
  const isThisSectionPaused = isThisSectionPlaying && isPaused;

  const handleClick = (e) => {
    e.stopPropagation();
    playSection(sectionId, speechText, sectionTitle);
  };

  return (
    <button
      type="button"
      className={`btn btn-${size} ${
        isThisSectionPlaying && !isThisSectionPaused
          ? 'btn-warning active-audio-btn'
          : isThisSectionPaused
          ? 'btn-outline-warning'
          : 'btn-outline-primary section-audio-btn'
      } rounded-pill d-inline-flex align-items-center gap-1.5 px-2.5 py-1 ${className}`}
      onClick={handleClick}
      title={
        isThisSectionPlaying && !isThisSectionPaused
          ? 'Pausar audio de esta sección'
          : isThisSectionPaused
          ? 'Reanudar audio'
          : `Escuchar: ${sectionTitle || label}`
      }
    >
      {isThisSectionPlaying && !isThisSectionPaused ? (
        <>
          <div className="mini-wave-container d-inline-flex align-items-end gap-0.5">
            <span className="mini-wave bar-1"></span>
            <span className="mini-wave bar-2"></span>
            <span className="mini-wave bar-3"></span>
          </div>
          <span className="small fw-bold">Pausar</span>
        </>
      ) : isThisSectionPaused ? (
        <>
          <i className="bi bi-play-fill text-warning"></i>
          <span className="small fw-bold">Reanudar</span>
        </>
      ) : (
        <>
          <i className="bi bi-volume-up-fill"></i>
          <span className="small fw-semibold">{label}</span>
        </>
      )}
    </button>
  );
}
