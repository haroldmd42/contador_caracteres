import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Natural Human Speech Synthesis Hook for QATOOLS.
 * 
 * Features & Browser Hardening:
 * 1. Warm, human-like cadence with natural breathing micro-pauses between sentences.
 * 2. Specialized text normalization for tech & QA (QA -> Q. A., LLM -> L. L. M., CI/CD, etc.).
 * 3. Automatic sentence-chunking (prevents Chromium 15s freeze & long-text cutoffs).
 * 4. Safe cancel & unfreeze: resolves Chromium Issue 679437 / Issue 749007 where
 *    speechSynthesis.cancel() leaves the synthesizer in a permanently paused/dead state.
 * 5. Global Set retention: completely prevents V8 garbage collection dropping utterances mid-phrase.
 * 6. Non-cascading cancellation: guarantees that cancelled/interrupted utterances never
 *    trigger an infinite rapid-skip cascade.
 * 7. Top-tier Human Voice Prioritization:
 *    Automatically selects "Online (Natural)", "Neural", "Google Español", "Salome", "Jorge".
 * 8. Parent / Child (Padre e Hijos) Architecture:
 *    Allows playing the full lesson sequentially OR playing individual child subsections separately.
 * 9. Heartbeat watchdog & keepalive to resist browser inactivity / tab backgrounding stalls.
 */

// Global window reference to prevent garbage collection of SpeechSynthesisUtterance in V8
if (typeof window !== 'undefined') {
  if (!window.__qaSpeechUtterances) {
    window.__qaSpeechUtterances = new Set();
  }
}

/**
 * Safely cancels and unpauses the browser's speech synthesis engine.
 * Solves the critical Chromium bug where cancel() leaves the synthesizer in a permanent paused state.
 */
function safeCancelAndUnfreeze() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (err) {
    console.warn('[TTS] Unfreeze warning:', err);
  }
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

    // Keep sentences between 30 and 130 characters for natural breathing pauses
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

/**
 * Finds best available voice dynamically, avoiding stale/detached object references.
 */
function getBestAvailableVoice(preferredVoice) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const currentVoices = window.speechSynthesis.getVoices() || [];
  if (currentVoices.length === 0) return null;

  if (preferredVoice) {
    const match = currentVoices.find(
      (v) => (v.voiceURI && v.voiceURI === preferredVoice.voiceURI) || v.name === preferredVoice.name
    );
    if (match) return match;
  }

  const spanish = currentVoices
    .filter((v) => v.lang.toLowerCase().startsWith('es'))
    .sort((a, b) => rankVoice(b) - rankVoice(a));

  if (spanish.length > 0) return spanish[0];

  const sorted = [...currentVoices].sort((a, b) => rankVoice(b) - rankVoice(a));
  return sorted[0] || null;
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
    if (window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    const t1 = setTimeout(loadVoices, 200);
    const t2 = setTimeout(loadVoices, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (window.speechSynthesis.removeEventListener) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
      if (interSentenceTimeoutRef.current) {
        clearTimeout(interSentenceTimeoutRef.current);
      }
      if (watchdogTimerRef.current) {
        clearInterval(watchdogTimerRef.current);
      }
      safeCancelAndUnfreeze();
    };
  }, [supported]);

  // Heartbeat watchdog for Chromium engine keepalive
  const startWatchdog = useCallback(() => {
    if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);

    watchdogTimerRef.current = setInterval(() => {
      if (
        !supported ||
        !window.speechSynthesis ||
        !isPlayingRef.current ||
        isPausedRef.current
      ) {
        return;
      }

      // If browser paused in background, awaken it
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (window.speechSynthesis.speaking) {
        // Prevent Chromium 15s engine stall
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);
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
    safeCancelAndUnfreeze();

    if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
      window.__qaSpeechUtterances.clear();
    }

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

          // 220ms cadence pause between sections to simulate human speaker transitioning
          interSentenceTimeoutRef.current = setTimeout(() => {
            playNextSentence();
          }, 220);
          return;
        }
      }

      // Everything finished cleanly
      stop();
      return;
    }

    const textChunk = sentences[idx];
    if (!textChunk || !textChunk.trim()) {
      currentSentenceIdxRef.current += 1;
      playNextSentence();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textChunk);

    // Retain in global Set to prevent V8 garbage-collecting active utterance
    if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
      window.__qaSpeechUtterances.add(utterance);
    }

    // Dynamic voice resolution (prevents detached voice objects after browser idle)
    const voice = getBestAvailableVoice(selectedVoiceRef.current);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'es-ES';
    }

    utterance.rate = rateRef.current || 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
        window.__qaSpeechUtterances.delete(utterance);
      }
      if (isPlayingRef.current && !isPausedRef.current) {
        currentSentenceIdxRef.current += 1;
        // Human breathing micro-pause (120ms) between sentences:
        interSentenceTimeoutRef.current = setTimeout(() => {
          playNextSentence();
        }, 120);
      }
    };

    utterance.onerror = (e) => {
      if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
        window.__qaSpeechUtterances.delete(utterance);
      }

      // CRITICAL: If intentionally canceled or interrupted, do NOT recurse or advance!
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return;
      }

      console.warn('[TTS] Speech error on sentence chunk:', e.error || e);
      if (isPlayingRef.current && !isPausedRef.current) {
        currentSentenceIdxRef.current += 1;
        interSentenceTimeoutRef.current = setTimeout(() => {
          playNextSentence();
        }, 80);
      }
    };

    // Ensure engine is unpaused before dispatching speak
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);

    // Secondary pulse for Chrome if in background
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
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
          isPausedRef.current = false;
          setIsPaused(false);
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          startWatchdog();
          setTimeout(() => {
            playNextSentence();
          }, 40);
        } else {
          if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
          isPausedRef.current = true;
          setIsPaused(true);
          stopWatchdog();
          safeCancelAndUnfreeze();
        }
        return;
      }

      // Stop previous playback cleanly
      if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
      safeCancelAndUnfreeze();

      if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
        window.__qaSpeechUtterances.clear();
      }

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

      // 60ms delay ensures Chromium cancellation message completes before new utterance
      setTimeout(() => {
        if (isPlayingRef.current && !isPausedRef.current) {
          startWatchdog();
          playNextSentence();
        }
      }, 60);
    },
    [supported, activeSectionId, startWatchdog, playNextSentence, stopWatchdog]
  );

  /**
   * Play the FULL LESSON sequentially (El Padre con todos sus hijos)
   */
  const playFullLesson = useCallback(
    (childSections = [], lessonTitle = '', startIdx = 0) => {
      if (!supported || !childSections || childSections.length === 0) return;

      const validSections = childSections.filter(
        (s) => s && ((s.speechText && s.speechText.trim()) || (s.title && s.title.trim()))
      );
      if (validSections.length === 0) return;

      // If already playing full lesson and browser is actually speaking or paused: toggle pause / resume
      const hasActiveSynthesis =
        window.speechSynthesis &&
        (window.speechSynthesis.speaking || window.speechSynthesis.pending || isPausedRef.current);

      if (fullLessonQueueRef.current.length > 0 && isPlayingRef.current && hasActiveSynthesis) {
        if (isPausedRef.current) {
          isPausedRef.current = false;
          setIsPaused(false);
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          startWatchdog();
          setTimeout(() => {
            playNextSentence();
          }, 40);
        } else {
          if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
          isPausedRef.current = true;
          setIsPaused(true);
          stopWatchdog();
          safeCancelAndUnfreeze();
        }
        return;
      }

      if (interSentenceTimeoutRef.current) clearTimeout(interSentenceTimeoutRef.current);
      safeCancelAndUnfreeze();

      if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
        window.__qaSpeechUtterances.clear();
      }

      const targetIdx = Math.max(0, Math.min(startIdx, validSections.length - 1));
      fullLessonQueueRef.current = validSections;
      fullLessonIdxRef.current = targetIdx;

      const currentSec = validSections[targetIdx];
      const sentences = splitIntoSentences(currentSec.speechText || currentSec.title);
      sentencesQueueRef.current = sentences;
      currentSentenceIdxRef.current = 0;

      setActiveSectionId(currentSec.id);
      setActiveSectionTitle(currentSec.title || lessonTitle);
      setQueueProgress({ current: targetIdx + 1, total: validSections.length });

      isPlayingRef.current = true;
      isPausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);

      // 60ms delay ensures Chromium cancellation message completes before new utterance
      setTimeout(() => {
        if (isPlayingRef.current && !isPausedRef.current) {
          startWatchdog();
          playNextSentence();
        }
      }, 60);
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
    if (interSentenceTimeoutRef.current) {
      clearTimeout(interSentenceTimeoutRef.current);
      interSentenceTimeoutRef.current = null;
    }
    isPausedRef.current = true;
    setIsPaused(true);
    stopWatchdog();
    safeCancelAndUnfreeze();
  }, [supported, stopWatchdog]);

  const resume = useCallback(() => {
    if (!supported || !isPlayingRef.current || !isPausedRef.current) return;
    isPausedRef.current = false;
    setIsPaused(false);
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    startWatchdog();
    setTimeout(() => {
      playNextSentence();
    }, 40);
  }, [supported, startWatchdog, playNextSentence]);

  /**
   * Quick preview of a voice so the user can sample how pleasant it sounds
   */
  const previewVoice = useCallback(
    (voice) => {
      if (!supported || !voice) return;
      safeCancelAndUnfreeze();

      const sample = `Hola, esta es la voz natural ${voice.name.replace(/Microsoft|Google|Desktop|Online|\(Natural\)/gi, '').trim().split(' ')[0]} para tu aprendizaje en QATOOLS.`;
      const utterance = new SpeechSynthesisUtterance(sample);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
        window.__qaSpeechUtterances.add(utterance);
      }

      utterance.onend = () => {
        if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
          window.__qaSpeechUtterances.delete(utterance);
        }
      };

      utterance.onerror = () => {
        if (typeof window !== 'undefined' && window.__qaSpeechUtterances) {
          window.__qaSpeechUtterances.delete(utterance);
        }
      };

      setTimeout(() => {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      }, 50);
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
