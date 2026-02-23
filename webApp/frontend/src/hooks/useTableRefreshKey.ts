// ======================================================================================
//? Importing
// ======================================================================================
import { useCallback, useState } from 'react';

// =============================================================================
// ? function to handle table refresh key state
// =============================================================================
export const useTableRefreshKey = (initialKey = 0) => {
  const [key, setKey] = useState(initialKey);

  const refresh = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setKey(initialKey);
  }, [initialKey]);

  return {
    key,
    refresh,
    reset,
  };
};
