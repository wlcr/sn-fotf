import {useEffect, useState} from 'react';

/**
 * Custom hook to detect if the user prefers reduced motion.
 * Returns true if '(prefers-reduced-motion: reduce)' is matched.
 *
 * Based on implementation from Rubato Wines project.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const handler = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    return undefined;
  }, []);

  return prefersReducedMotion;
}
