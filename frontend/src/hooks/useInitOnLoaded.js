import { useEffect } from 'react';

export const useInitOnLoaded = (loading) => {
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (typeof window.windowLoadInit === 'function') {
          window.windowLoadInit();
        }
        if (typeof window.documentReadyInit === 'function') {
          window.documentReadyInit();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);
};
