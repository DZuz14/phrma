import { useState, useEffect } from 'react';

/**
 * Custom hook to track window dimensions
 * @returns Tuple containing [width, height] of the window
 */
export const useWindowSize = (): [number, number] => {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};
