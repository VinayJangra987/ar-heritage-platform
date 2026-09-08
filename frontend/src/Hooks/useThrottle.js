import { useRef, useCallback } from "react";

// callback ko max ek baar per `limit` ms chalne deta hai — beech ke calls ignore
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