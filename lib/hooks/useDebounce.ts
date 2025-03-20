import { useCallback, useEffect, useRef } from "react";
import debounce from "lodash/debounce";

/**
 * Hook för att skapa en debounced version av en funktion.
 *
 * @param callback Funktionen som ska debounce:as
 * @param delay Tiden i ms att vänta
 * @param dependencies Array av beroenden som påverkar callback-funktionen
 * @returns En debounced version av funktionen
 *
 * @example
 * // En sökfunktion som endast körs 500ms efter att användaren slutat skriva
 * const handleSearch = useDebounce((value) => {
 *   fetchSearchResults(value);
 * }, 500, [fetchSearchResults]);
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = []
) {
  // Använd en ref för att alltid ha den senaste callback-funktionen
  const callbackRef = useRef(callback);

  // Uppdatera callbackRef när callback ändras
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...dependencies]);

  // Skapa den debounced-funktionen en gång
  const debouncedCallback = useCallback(
    debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay),
    [delay]
  );

  // Rensa debounce-timern vid unmount
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}
