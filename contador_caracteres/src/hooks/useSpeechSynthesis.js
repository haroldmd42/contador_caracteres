import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to interface with the Web Speech API (speechSynthesis).
 * Provides speech playback controls, rate adjustment, voice selection,
 * and tracks speech state (playing, paused, stopped).
 */
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!supported) return;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Find Spanish voice if available (es-ES, es-MX, es-US, es-CO, etc.)
      setSelectedVoice((currentVoice) => {
        if (!currentVoice && availableVoices.length > 0) {
          return availableVoices.find((v) => v.lang.startsWith('es')) || availableVoices[0];
        }
        return currentVoice;
      });
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  const stop = useCallback(() => {
    if (supported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [supported]);

  const pause = useCallback(() => {
    if (supported && window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [supported, isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (supported && window.speechSynthesis && isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [supported, isSpeaking, isPaused]);

  const speak = useCallback((text) => {
    if (!supported || !text) return;

    // Clean text: strip markdown characters, urls, code markers for pleasant audio
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Fragmento de código omitido.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\$\$[\s\S]*?\$\$/g, 'Fórmula matemática.')
      .replace(/\$([^$]+)\$/g, '$1')
      .replace(/[|─┌┐└┘├┤┬┴┼═║]/g, ' ')
      .trim();

    if (!cleanText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'es-ES';
    }

    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e);
      }
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [supported, selectedVoice, rate]);

  return {
    supported,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    speak,
    pause,
    resume,
    stop,
  };
}
