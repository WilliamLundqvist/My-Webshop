import { useEffect, useRef } from "react";

/**
 * Hook som håller koll på om komponenten är monterad.
 * Använd denna för att undvika att utföra state-uppdateringar på omonterade komponenter.
 *
 * @returns En ref vars current-värde är true om komponenten är monterad, annars false
 *
 * @example
 * const isMountedRef = useIsMounted();
 *
 * // I en async funktion:
 * if (!isMountedRef.current) return;
 * setData(result);
 */
export function useIsMounted() {
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Sätt till true vid mount (default-värde)
    isMountedRef.current = true;

    // Sätt till false vid unmount
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}
