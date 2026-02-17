
import { useEffect, useRef } from 'react';

export const useHardwareScanner = (onScan: (barcode: string) => void) => {
  const buffer = useRef<string>('');
  const lastTime = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      
      // Hardware scanners typically type very fast ( < 30ms between characters)
      if (now - lastTime.current > 100) {
        buffer.current = '';
      }

      if (e.key === 'Enter') {
        if (buffer.current.length > 2) {
          onScan(buffer.current);
          buffer.current = '';
        }
      } else if (e.key.length === 1) {
        buffer.current += e.key;
      }

      lastTime.current = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);
};
