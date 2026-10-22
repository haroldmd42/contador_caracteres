import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Natural Human Speech Synthesis Hook for QATOOLS.
 * 
 * Features:
 * 1. Warm, human-like cadence with natural breathing micro-pauses between sentences.
 * 2. Specialized text normalization for tech & QA (QA -> Q. A., LLM -> L. L. M., CI/CD, etc.).
 * 3. Automatic sentence-chunking (prevents Chromium 15s freeze & long-text cutoffs).
 * 4. Resilient pause/resume: resumes from exact sentence index, avoiding Chromium engine stalls.
 * 5. Global utterance retention: prevents V8 garbage collection dropping audio mid-phrase.
 * 6. Top-tier Human Voice Prioritization:
 *    Automatically selects "Online (Natural)", "Neural", "Google Español", "Salome", "Jorge".
 * 7. Parent / Child (Padre e Hijos) Architecture:
 *    Allows playing the full lesson sequentially OR playing individual child subsections separately.
 *    Supports next/previous section jumping from the master parent toolbar.
 */

// Global window reference to prevent garbage collection of SpeechSynthesisUtterance in V8
if (typeof window !== 'undefined') {
  window.__qaUtteranceQueue = [];
}

/**
 * Normalizes text to sound fluent, warm, and natural when spoken by a human-like voice.
 */
function normalizeForNaturalSpeech(text) {
  if (!text) return '';

  return text
    // Remove markdown code blocks & math blocks cleanly
    .replace(/```[\s\S]*?```/g, 'Fragmento de código omitido.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\$\$[\s\S]*?\$\$/g, 'Fórmula matemática de inferencia.')
    .replace(/\$([^$]+)\$/g, '$1')
    // Remove markdown symbols
    .replace(/[*_#~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[|─┌┐└┘├┤┬┴┼═║]/g, ' ')
    .replace(/\bQA-GenAI\b/gi, 'Q. A. para Inteligencia Artificial Generativa')
    .replace(/\bISTQB®?\b/gi, 'I. S. T. Q. B.')
    .replace(/\bCTFL\b/gi, 'C. T. F. L.')
    .replace(/\bQA\b/g, 'Q. A.')
    .replace(/\bQC\b/g, 'Q. C.')
    .replace(/\bSDLC\b/gi, 'S. D. L. C.')
    .replace(/\bUAT\b/gi, 'U. A. T.')
    .replace(/\bBVA\b/gi, 'Análisis de Valores Límite')
    .replace(/\bEP\b/g, 'Partición de Equivalencia')
    .replace(/\bSAST\b/gi, 'S. A. S. T.')
    .replace(/\bLLMs\b/g, 'Modelos de Lenguaje Grande')
    .replace(/\bLLM\b/g, 'L. L. M.')
    .replace(/\bRAG\b/g, 'R. A. G.')
    .replace(/\bCI\/CD\b/gi, 'C. I., C. D.')
    .replace(/\bAPIs\b/g, 'A. P. Is')
    .replace(/\bAPI\b/g, 'A. P. I.')
    .replace(/\bJSON\b/g, 'Jeison')
    .replace(/\bYAML\b/g, 'Yamel')
    .replace(/\bej\.\s*/gi, 'por ejemplo, ')
    .replace(/\bvs\.\s*/gi, 'versus ')
    .replace(/\bp95\b/gi, 'percentil 95')
    .replace(/\bp99\b/gi, 'percentil 99')
    .replace(/\bPII\b/g, 'Información personal confidencial')
    .replace(/\bDoS\b/g, 'Denegación de servicio')
    .replace(/\bBPE\b/g, 'B. P. E.')
    .replace(/\bROUGE\b/g, 'Rouch')
    .replace(/\bBLEU\b/g, 'Blú')
    .replace(/\bBERTScore\b/g, 'Bert Score')
    .replace(/\bLLMOps\b/gi, 'L. L. M. Ops')
    .replace(/P\(t_\{?k\+?1?\}?\s*\|\s*t_1[^)]*\)/g, 'Probabilidad del siguiente token dado los tokens previos')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits text into natural sentence chunks with conversational cadence.
 */
function splitIntoSentences(text) {
  const clean = normalizeForNaturalSpeech(text);
  if (!clean) return [];

  // Split on punctuation followed by space or newline
  const rawParts = clean.split(/(?<=[.?!;:\n])\s+/);
  const chunks = [];
  let buffer = '';

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Keep sentences between 30 and 150 characters for natural breathing pauses
    if ((buffer + ' ' + trimmed).length < 130) {
      buffer = buffer ? buffer + ' ' + trimmed : trimmed;
    } else {
      if (buffer) chunks.push(buffer);
      buffer = trimmed;
    }
  }

  if (buffer) chunks.push(buffer);
  return chunks.length > 0 ? chunks : [clean];
}

/**
 * Voice scoring algorithm prioritizing high-definition natural human voices.
 */
function rankVoice(v) {
  if (!v) return -100;
  const name = (v.name || '').toLowerCase();
  const lang = (v.lang || '').toLowerCase();
  let score = 0;

  // Spanish language prioritization
  if (lang.startsWith('es')) {
    score += 200;
    if (lang.includes('es-co') || lang.includes('es-mx') || lang.includes('es-us') || lang.includes('es-es')) {
      score += 30;
    }
  }

  // Tier 1: Modern Cloud Neural & High-Definition Natural Voices (Edge, Chrome, Windows 11, Mac)
  if (name.includes('natural')) score += 300;
  if (name.includes('online')) score += 150;
  if (name.includes('neural')) score += 250;
  if (name.includes('google')) score += 220; // Google español in Chrome sounds fluid and human
  if (name.includes('jorge') || name.includes('salome') || name.includes('dalia') || name.includes('elena') || name.includes('alvaro')) {
    score += 80;
  }

  // Penalize robotic legacy local desktop SAPI voices (e.g. Microsoft Raul Desktop, Sabina Desktop)
  if (name.includes('desktop') && !name.includes('natural')) {
    score -= 100;
  }

  return score;
}

export function useNaturalSpeech() {
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [activeSectionTitle, setActiveSectionTitle] = useState('');
  const [queueProgress, setQueueProgress] = useState({ current: 0, total: 0 });

  // Refs for tracking active playback without causing re-renders
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const currentSentenceIdxRef = useRef(0);
  const sentencesQueueRef = useRef([]);
  const fullLessonQueueRef = useRef([]);
  const fullLessonIdxRef = useRef(0);
  const interSentenceTimeoutRef = useRef(null);
  const watchdogTimerRef = useRef(null);
  const selectedVoiceRef = useRef(null);
  const rateRef = useRef(1);

  // Synchronize refs
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isPausedRef.current = isPaused;
  }, [isPlaying, isPaused]);

  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  // Load and rank voices with auto-upgrade when high-quality voices finish loading
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const spanishVoices = allVoices
        .filter((v) => v.lang.toLowerCase().startsWith('es'))
        .sort((a, b) => rankVoice(b) - rankVoice(a));

      const otherVoices = allVoices
        .filter((v) => !v.lang.toLowerCase().startsWith('es'))
        .sort((a, b) => rankVoice(b) - rankVoice(a));

      const ranked = [...spanishVoices, ...otherVoices];
      setVoices(ranked);

      setSelectedVoice((current) => {
        if (!current && ranked.length > 0) {
          return ranked[0];
        }
        // If current voice is a low-quality desktop voice and a natural voice just arrived, upgrade:
        if (current && ranked.length > 0) {
          const currentScore = rankVoice(current);
          const topScore = rankVoice(ranked[0]);
          if (topScore > currentScore + 100) {
            return ranked[0];
          }
        }
        return current;
      });
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (interSentenceTimeoutRef.current) {
        clearTimeout(interSentenceTimeoutRef.current);
      }
      if (watchdogTimerRef.current) {
        clearInterval(watchdogTimerRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  // Heartbeat watchdog for Chromium engine
  const startWatchdog = useCallback(() => {
    if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);

    watchdogTimerRef.current = setInterval(() => {
      if (
        supported &&
        window.speechSynthesis &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused &&
        isPlayingRef.current &&
        !isPausedRef.current
      ) {
        // Subtle pause/resume pulse to keep Chromium speech engine active
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 8000);
  }, [supported]);

  const stopWatchdog = useCallback(() => {
    if (watchdogTimerRef.current) {
      clearInterval(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  }, []);

  // Internal stop
  const stop = useCallback(() => {
    if (!supported) return;
    if (interSentenceTimeoutRef.current) {
      clearTimeout(interSentenceTimeoutRef.current);
      interSentenceTimeoutRef.current = null;
    }
    stopWatchdog();
    window.speechSynthesis.cancel();
    window.__qaUtteranceQueue = [];
    sentencesQueueRef.current = [];
    fullLessonQueueRef.current = [];
    currentSentenceIdxRef.current = 0;
    fullLessonIdxRef.current = 0;

    isPlayingRef.current = false;
    isPausedRef.current = false;

    setIsPlaying(false);
    setIsPaused(false);
    setActiveSectionId(null);
    setActiveSectionTitle('');
    setQueueProgress({ current: 0, total: 0 });
  }, [supported, stopWatchdog]);

  // Play next sentence in current queue with human-like breathing micro-pause
  const playNextSentence = useCallback(() => {
    if (!supported || !isPlayingRef.current || isPausedRef.current) return;

    const sentences = sentencesQueueRef.current;
    const idx = currentSentenceIdxRef.current;

    // If current section finished:
    if (idx >= sentences.length) {
      // If playing full lesson queue, transition to next child section
      if (fullLessonQueueRef.current.length > 0) {
        const nextSecIdx = fullLessonIdxRef.current + 1;
        if (nextSecIdx < fullLessonQueueRef.current.length) {
          fullLessonIdxRef.current = nextSecIdx;
          const nextSec = fullLessonQueueRef.current[nextSecIdx];
          setActiveSectionId(nextSec.id);
          setActiveSectionTitle(nextSec.title);
          sentencesQueueRef.current = splitIntoSentences(nextSec.speechText || nextSec.title);
          currentSentenceIdxRef.current = 0;
          setQueueProgress({ current: nextSecIdx + 1, total: fullLessonQueueRef.current.length });

          // 250ms cadence pause between sections to simulate human speaker transitioning
          interSentenceTimeoutRef.current = setTimeout(() => {
            playNextSentence();
          }, 250);
          return;
        }
      }

      // Everything finished
      stop();
      return;
    }

    const textChunk = sentences[idx];
    const utterance = new SpeechSynthesisUtterance(textChunk);

    // Keep in global array to prevent V8 garbage-collecting active utterance
    window.__qaUtteranceQueue = [utterance];

    const voice = selectedVoiceRef.current;
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'es-ES';
    }

    utterance.rate = rateRef.current;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (isPlayingRef.current && !isPausedRef.current) {
        currentSentenceIdxRef.current += 1;
        // Human breathing micro-pause (130ms) between sentences:
        interSentenceTimeoutRef.current = setTimeout(() => {
          playNextSentence();
        }, 130);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Speech error on sentence:', e);
      }
      if (isPlayingRef.current && !isPausedRef.current) {
        currentSentenceIdxRef.current += 1;
        playNextSentence();
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [supported, stop]);

  /**
   * Play an INDIVIDUAL child section (El Hijo)
   */
  const playSection = useCallback(
    (sectionId, text, title = '') => {
      if (!supported || !text) return;

      // If already playing this section: toggle pause / resume
      if (activeSectionId === sectionId && isPlayingRef.current) {
        if (isPausedRef.current) {
          // Resume
          isPausedRef.current = false;
          setIsPaused(false);
          startWatchdog();
          playNextSentence();
        } else {
          // Pause
          if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
          isPausedRef.current = true;
          setIsPaused(true);
          window.speechSynthesis.cancel();
          stopWatchdog();
        }
        return;
      }

      // Stop previous playback cleanly
      if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
      window.speechSynthesis.cancel();
      window.__qaUtteranceQueue = [];
      fullLessonQueueRef.current = [];
      fullLessonIdxRef.current = 0;

      const sentences = splitIntoSentences(text);
      if (sentences.length === 0) return;

      sentencesQueueRef.current = sentences;
      currentSentenceIdxRef.current = 0;
      setActiveSectionId(sectionId);
      setActiveSectionTitle(title || 'Sección');
      setQueueProgress({ current: 1, total: 1 });

      isPlayingRef.current = true;
      isPausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);

      startWatchdog();
      playNextSentence();
    },
    [supported, activeSectionId, startWatchdog, playNextSentence, stopWatchdog]
  );

  /**
   * Play the FULL LESSON sequentially (El Padre con todos sus hijos)
   */
  const playFullLesson = useCallback(
    (childSections = [], lessonTitle = '', startIdx = 0) => {
      if (!supported || !childSections || childSections.length === 0) return;

      // If already playing full lesson: toggle pause / resume
      if (fullLessonQueueRef.current.length > 0 && isPlayingRef.current) {
        if (isPausedRef.current) {
          isPausedRef.current = false;
          setIsPaused(false);
          startWatchdog();
          playNextSentence();
        } else {
          if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
          isPausedRef.current = true;
          setIsPaused(true);
          window.speechSynthesis.cancel();
          stopWatchdog();
        }
        return;
      }

      if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
      window.speechSynthesis.cancel();
      window.__qaUtteranceQueue = [];

      const targetIdx = Math.max(0, Math.min(startIdx, childSections.length - 1));
      fullLessonQueueRef.current = childSections;
      fullLessonIdxRef.current = targetIdx;

      const currentSec = childSections[targetIdx];
      const sentences = splitIntoSentences(currentSec.speechText || currentSec.title);
      sentencesQueueRef.current = sentences;
      currentSentenceIdxRef.current = 0;

      setActiveSectionId(currentSec.id);
      setActiveSectionTitle(currentSec.title || lessonTitle);
      setQueueProgress({ current: targetIdx + 1, total: childSections.length });

      isPlayingRef.current = true;
      isPausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);

      startWatchdog();
      playNextSentence();
    },
    [supported, startWatchdog, playNextSentence, stopWatchdog]
  );

  /**
   * Skip to Next Child Section in current queue
   */
  const skipToNextSection = useCallback(() => {
    if (fullLessonQueueRef.current.length > 0) {
      const nextIdx = fullLessonIdxRef.current + 1;
      if (nextIdx < fullLessonQueueRef.current.length) {
        playFullLesson(fullLessonQueueRef.current, activeSectionTitle, nextIdx);
      }
    }
  }, [playFullLesson, activeSectionTitle]);

  /**
   * Skip to Previous Child Section in current queue
   */
  const skipToPrevSection = useCallback(() => {
    if (fullLessonQueueRef.current.length > 0) {
      const prevIdx = fullLessonIdxRef.current - 1;
      if (prevIdx >= 0) {
        playFullLesson(fullLessonQueueRef.current, activeSectionTitle, prevIdx);
      }
    }
  }, [playFullLesson, activeSectionTitle]);

  const pause = useCallback(() => {
    if (!supported || !isPlayingRef.current || isPausedRef.current) return;
    if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
    isPausedRef.current = true;
    setIsPaused(true);
    window.speechSynthesis.cancel();
    stopWatchdog();
  }, [supported, stopWatchdog]);

  const resume = useCallback(() => {
    if (!supported || !isPlayingRef.current || !isPausedRef.current) return;
    isPausedRef.current = false;
    setIsPaused(false);
    startWatchdog();
    playNextSentence();
  }, [supported, startWatchdog, playNextSentence]);

  /**
   * Quick preview of a voice so the user can sample how pleasant it sounds
   */
  const previewVoice = useCallback(
    (voice) => {
      if (!supported || !voice) return;
      window.speechSynthesis.cancel();

      const sample = `Hola, esta es la voz natural ${voice.name.replace(/Microsoft|Google|Desktop|Online|\(Natural\)/gi, '').trim().split(' ')[0]} para tu aprendizaje en QATOOLS.`;
      const utterance = new SpeechSynthesisUtterance(sample);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.__qaUtteranceQueue = [utterance];

      window.speechSynthesis.speak(utterance);
    },
    [supported]
  );

  return {
    supported,
    voices,
    selectedVoice,
    setSelectedVoice,
    isPlaying,
    isPaused,
    rate,
    setRate,
    activeSectionId,
    activeSectionTitle,
    queueProgress,
    playSection,
    playFullLesson,
    skipToNextSection,
    skipToPrevSection,
    pause,
    resume,
    stop,
    previewVoice,
  };
}
