// ======================================================================================
//? Importing
// ======================================================================================
import { useCallback, useState } from 'react';

import { useAutoClearMessage } from './useAutoClearMessage';

type UseToastMessageOptions = {
  timeoutMs?: number;
};

// =============================================================================
// ? function to handle toast message state with auto clear
// =============================================================================
export const useToastMessage = (options: UseToastMessageOptions = {}) => {
  const { timeoutMs = 5000 } = options;
  const [message, setMessage] = useState('');

  useAutoClearMessage(message, setMessage, timeoutMs);

  
  // function to show toast message
  const show = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
  }, []);

  // function to clear toast message
  const clear = useCallback(() => {
    setMessage('');
  }, []);

  return {
    message,
    setMessage,
    show,
    clear,
  };
};
