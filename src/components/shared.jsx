import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * GlitchTransition – full-screen glitch/flash overlay.
 * Plays on mount then calls onComplete.
 */

export function GlitchTransition({ onComplete, color = "var(--blue-bright)" }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.6, 1, 0.3, 1, 0],
      }}
      transition={{ duration: 1.1, times: [0, 0.1, 0.2, 0.4, 0.7, 0.85, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9990,
        background: color,
        pointerEvents: "none",
      }}
    >
      {/* Horizontal glitch bars */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, Math.random() > 0.5 ? 20 : -20, 0],
          }}
          transition={{
            duration: 0.15,
            delay: i * 0.1,
            repeat: 3,
          }}
          style={{
            position: "absolute",
            top: `${10 + i * 15}%`,
            left: 0,
            right: 0,
            height: `${3 + Math.random() * 8}%`,
            background: "rgba(0,0,0,0.8)",
          }}
        />
      ))}
    </motion.div>
  );
}

/**
 * RadarGraphic – SVG radar with spinning sweep.
 */
export function RadarGraphic({ size = 200, color = "var(--blue-bright)" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ display: "block" }}
    >
      {/* Circles */}
      {[80, 56, 32, 12].map((r, i) => (
        <circle
          key={i}
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={0.5}
          opacity={0.3 + i * 0.1}
        />
      ))}
      {/* Cross lines */}
      <line x1={100} y1={20} x2={100} y2={180} stroke={color} strokeWidth={0.5} opacity={0.2} />
      <line x1={20} y1={100} x2={180} y2={100} stroke={color} strokeWidth={0.5} opacity={0.2} />
      <line x1={43} y1={43} x2={157} y2={157} stroke={color} strokeWidth={0.5} opacity={0.12} />
      <line x1={157} y1={43} x2={43} y2={157} stroke={color} strokeWidth={0.5} opacity={0.12} />

      {/* Spinning sweep */}
      <motion.g
        style={{ originX: "100px", originY: "100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <radialGradient id="sweep" cx="0" cy="0.5" r="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M 100 100 L 180 100 A 80 80 0 0 0 100 20 Z"
          fill={color}
          opacity={0.15}
        />
        <line x1={100} y1={100} x2={180} y2={100} stroke={color} strokeWidth={1.5} opacity={0.8} />
      </motion.g>

      {/* Center dot */}
      <circle cx={100} cy={100} r={3} fill={color} opacity={0.9} />

      {/* Blip */}
      <motion.circle
        cx={130}
        cy={70}
        r={3}
        fill={color}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </svg>
  );
}

/**
 * SoundController – mute/unmute floating button.
 */
export function SoundController({ soundEnabled, onToggle }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
      style={{
        position: "fixed",
        bottom: `calc(20px + env(safe-area-inset-bottom, 0px))`,
        right: "20px",
        zIndex: 500,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "rgba(6,18,40,0.9)",
        border: `1px solid ${soundEnabled ? "var(--blue-bright)" : "rgba(255,255,255,0.2)"}`,
        color: soundEnabled ? "var(--blue-bright)" : "var(--text-dim)",
        fontSize: "1.2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        boxShadow: soundEnabled ? "0 0 12px var(--blue-glow)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      {soundEnabled ? "🔊" : "🔇"}
    </motion.button>
  );
}

/**
 * ProgressBar – mission progress indicator (dots + line).
 */
export function ProgressBar({ current, total, completed = [] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0",
        padding: "12px 0",
      }}
    >
      {[...Array(total)].map((_, i) => {
        const isComplete = completed.includes(i);
        const isActive = i === current;
        return (
          <React.Fragment key={i}>
            <motion.div
              animate={
                isActive
                  ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                  : { scale: 1, opacity: 1 }
              }
              transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: isComplete
                  ? "var(--green)"
                  : isActive
                  ? "var(--cyan)"
                  : "rgba(255,255,255,0.12)",
                border: `2px solid ${
                  isComplete
                    ? "var(--green)"
                    : isActive
                    ? "var(--cyan)"
                    : "rgba(255,255,255,0.2)"
                }`,
                boxShadow: isComplete
                  ? "0 0 10px var(--green)"
                  : isActive
                  ? "0 0 14px var(--cyan)"
                  : "none",
              }}
            />
            {i < total - 1 && (
              <div
                style={{
                  width: "48px",
                  height: "2px",
                  background: isComplete
                    ? "var(--green)"
                    : "rgba(255,255,255,0.08)",
                  boxShadow: isComplete ? "0 0 6px var(--green)" : "none",
                  transition: "background 0.6s ease",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * TypewriterText – animates text character by character.
 */
export function TypewriterText({ text, speed = 40, onComplete, className, style }) {
  const [displayed, setDisplayed] = React.useState("");
  const [done, setDone] = React.useState(false);
  const indexRef = React.useRef(0);

  React.useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    const chars = text.split("");
    const interval = setInterval(() => {
      if (indexRef.current < chars.length) {
        setDisplayed((prev) => prev + chars[indexRef.current]);
        indexRef.current++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className} style={style}>
      {displayed}
      {!done && <span className="anim-blink">█</span>}
    </span>
  );
}

/**
 * DecryptAnimation – random character scramble reveal.
 */
export function DecryptAnimation({ text, onComplete, duration = 1200 }) {
  const [display, setDisplay] = React.useState(
    text.split("").map(() => " ")
  );
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?";

  React.useEffect(() => {
    const totalChars = text.length;
    let frame = 0;
    const totalFrames = duration / 50;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setDisplay(
        text.split("").map((char, i) => {
          if (char === " " || char === "\n") return char;
          // Reveal characters progressively
          if (i / totalChars < progress * 1.4) return char;
          // Scramble unrevealed
          return chars[Math.floor(Math.random() * chars.length)];
        })
      );

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(text.split(""));
        onComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, duration]);

  return (
    <span style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
      {display.join("")}
    </span>
  );
}
