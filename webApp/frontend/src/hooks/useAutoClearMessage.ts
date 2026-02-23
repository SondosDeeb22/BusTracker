// ======================================================================================
//? Importing
// ======================================================================================
import { useEffect } from 'react';

type SetMessageFn = (next: string) => void;

// =============================================================================
// ? function to auto clear message after a certain amount of time
// =============================================================================
export const useAutoClearMessage = (message: string, setMessage: SetMessageFn, timeoutMs = 5000) => {
  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage('');
    }, timeoutMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message, setMessage, timeoutMs]);
};
