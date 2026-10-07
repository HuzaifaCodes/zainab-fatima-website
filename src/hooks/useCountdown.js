/**
 * useCountdown – real-time countdown based on actual timestamps.
 * Returns { remaining, isExpired, totalMs }
 *
 * remaining = { hours, minutes, seconds, totalMs }
 */
import { useState, useEffect, useRef } from "react";

export function useCountdown(targetTimestampMs) {
  const calcRemaining = () => {
    if (!targetTimestampMs) return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    const diff = Math.max(0, targetTimestampMs - Date.now());
    const hours = Math.floor(diff / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);
    return { hours, minutes, seconds, totalMs: diff };
  };

  const [remaining, setRemaining] = useState(calcRemaining);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!targetTimestampMs) return;

    const tick = () => {
      setRemaining(calcRemaining());
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetTimestampMs]);

  return {
    ...remaining,
    isExpired: remaining.totalMs === 0,
  };
}

/**
 * useQuestStartCountdown – counts down to quest start time.
 */
export function useQuestStartCountdown(startIso) {
  const ts = startIso ? new Date(startIso).getTime() : null;
  return useCountdown(ts);
}
