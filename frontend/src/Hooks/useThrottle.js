import { useRef, useCallback } from "react";

export function useThrottle(callback, limit = 500) {
  const lastRun = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRun.current >= limit) {
      lastRun.current = now;
      callback(...args);
    }
  }, [callback, limit]);
}