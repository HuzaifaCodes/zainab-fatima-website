/**
 * MissionTimer – real-time countdown, visually dominant.
 * Receives missionDeadlineMs (timestamp). Fires onExpire when hits zero.
 */
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "../hooks/useCountdown";

function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function getTimerState(totalMs) {
  if (totalMs <= 60_000) return "critical";
  if (totalMs <= 5 * 60_000) return "urgent";
  if (totalMs <= 10 * 60_000) return "warning";
  return "normal";
}

export function MissionTimer({ deadlineMs, onExpire, playSound }) {
  const { hours, minutes, seconds, totalMs, isExpired } = useCountdown(deadlineMs);
  const expiredFired = useRef(false);
  const lastState = useRef("normal");
  const lastSecond = useRef(-1);

  useEffect(() => {
    if (isExpired && !expiredFired.current) {
      expiredFired.current = true;
      onExpire?.();
    }
  }, [isExpired, onExpire]);

  // Tick sound and state-change sounds
  useEffect(() => {
    if (!playSound) return;
    if (isExpired) return;

    const state = getTimerState(totalMs);

    // Tick every second for critical
    if (state === "critical" && seconds !== lastSecond.current) {
      lastSecond.current = seconds;
      playSound("tick");
    }

    // State transition sounds
    if (state !== lastState.current) {
      if (state === "warning") playSound("warning");
      if (state === "urgent") playSound("warning");
      if (state === "critical") playSound("warning");
      lastState.current = state;
    }
  }, [totalMs, seconds, isExpired, playSound]);

  const timerState = getTimerState(totalMs);
  const displayTime = hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      {/* State label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={timerState}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="hud-label"
          style={{
            marginBottom: "8px",
            color:
              timerState === "critical"
                ? "var(--red)"
                : timerState === "urgent"
                ? "var(--red)"
                : timerState === "warning"
                ? "var(--amber)"
                : "var(--blue-bright)",
          }}
        >
          {timerState === "critical"
            ? "⚠ HURRY UP POOKIE!!"
            : timerState === "urgent"
            ? "⚠ TICK TOCK"
            : timerState === "warning"
            ? "⚡ YOU'RE LOSING TIME"
            : "TIME LEFT TO IMPRESS ME"}
        </motion.div>
      </AnimatePresence>

      {/* Timer digits */}
      <motion.div
        className={`timer-display ${timerState}`}
        animate={
          timerState === "critical"
            ? { scale: [1, 1.04, 1], opacity: [1, 0.8, 1] }
            : {}
        }
        transition={
          timerState === "critical"
            ? { duration: 0.6, repeat: Infinity }
            : {}
        }
      >
        {displayTime}
      </motion.div>

      {/* Progress bar under timer */}
      <div style={{ marginTop: "12px", padding: "0 8px" }}>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(100, (totalMs / (30 * 60 * 1000)) * 100)}%`,
              background:
                timerState === "critical"
                  ? "linear-gradient(90deg, var(--red) 0%, #ff6688 100%)"
                  : timerState === "urgent"
                  ? "linear-gradient(90deg, var(--red) 0%, var(--amber) 100%)"
                  : timerState === "warning"
                  ? "linear-gradient(90deg, var(--amber) 0%, #ffcc44 100%)"
                  : "linear-gradient(90deg, var(--blue) 0%, var(--cyan) 100%)",
              boxShadow:
                timerState === "critical"
                  ? "0 0 8px var(--red-glow)"
                  : timerState === "warning"
                  ? "0 0 8px var(--amber-glow)"
                  : "0 0 8px var(--cyan-glow)",
            }}
          />
        </div>
      </div>

      {/* Screen edge glow for critical */}
      {timerState === "critical" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            position: "fixed",
            inset: 0,
            border: "3px solid var(--red)",
            pointerEvents: "none",
            zIndex: 9997,
            boxShadow: "inset 0 0 60px var(--red-glow)",
          }}
        />
      )}
    </div>
  );
}
