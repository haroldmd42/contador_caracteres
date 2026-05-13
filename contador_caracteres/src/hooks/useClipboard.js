import { useState, useCallback } from 'react';

/**
 * Custom hook for clipboard operations with a temporary "copied" state.
 * @param {number} duration - How long (ms) the "copied" flag stays true. Default: 2000.
 * @returns {{ copied: boolean, copyToClipboard: (text: string) => Promise<void> }}
 */
export default function useClipboard(duration = 2000) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text) => {
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), duration);
      } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
      }
    },
    [duration]
  );

  return { copied, copyToClipboard };
}
