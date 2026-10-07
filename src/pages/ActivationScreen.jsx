/**
 * ActivationScreen – cinematic boot sequence at 7PM.
 * Plays through typed messages then calls onComplete.
 */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questConfig } from "../config/questConfig";

const BOOT_SEQUENCE = [
  { text: "booting up boyfriend.exe...", delay: 0, color: "var(--green)", size: "1.2rem" },
  { text: "Target acquired: The prettiest girl in NUST", delay: 1200, color: "var(--cyan)", size: "0.85rem" },
  { text: "Hi Zainab. ❤️", delay: 2800, color: "var(--white)", size: "1.8rem" },
  { text: "I made a little something for you.", delay: 4200, color: "var(--blue-bright)", size: "1.1rem" },
  { text: "3 missions. 30 minutes each.", delay: 6000, color: "var(--amber)", size: "1rem" },
  { text: "Don't panic, it's just a game (but also don't fail pls).", delay: 7600, color: "var(--text-secondary)", size: "0.75rem" },
  { text: "MISSION 01 ▸", delay: 10000, color: "var(--cyan)", size: "1.8rem" },
];

function BootLine({ text, color, size, onRendered }) {
  const [chars, setChars] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setChars(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
        onRendered?.();
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color,
        textShadow: `0 0 20px ${color}`,
        lineHeight: 1.4,
        minHeight: `calc(${size} * 1.4)`,
      }}
    >
      {chars}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: "0.55em",
            height: "0.85em",
            background: color,
            marginLeft: "3px",
            verticalAlign: "text-bottom",
            animation: "blink 0.7s step-end infinite",
          }}
        />
      )}
    </div>
  );
}

export function ActivationScreen({ onComplete, playSound }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [flashDone, setFlashDone] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  // Initial flash
  useEffect(() => {
    playSound?.("boot");
    setTimeout(() => setFlashDone(true), 400);
  }, []);

  // Schedule each boot line
  useEffect(() => {
    if (!flashDone) return;
    const timers = [];
    BOOT_SEQUENCE.forEach((line, idx) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, idx]);
        setCurrentLineIdx(idx);
        playSound?.("click");
      }, line.delay);
      timers.push(t);
    });

    // Auto-advance after last line + reading time
    const last = BOOT_SEQUENCE[BOOT_SEQUENCE.length - 1];
    const endTimer = setTimeout(() => {
      onComplete?.();
    }, last.delay + 2500);
    timers.push(endTimer);

    return () => timers.forEach(clearTimeout);
  }, [flashDone, onComplete, playSound]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        overflow: "hidden",
      }}
    >
      {/* Initial flash */}
      {!flashDone && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--blue-bright)",
            zIndex: 10,
          }}
        />
      )}

      {/* Glitch bars */}
      <AnimatePresence>
        {!flashDone &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              style={{
                position: "fixed",
                top: `${20 + i * 20}%`,
                left: 0,
                right: 0,
                height: "10%",
                background: "rgba(0,0,0,0.8)",
                zIndex: 11,
              }}
            />
          ))}
      </AnimatePresence>

      {/* Background grid */}
      <div className="grid-lines" />

      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(45,138,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Boot lines */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Terminal header */}
        <div
          className="hud-label"
          style={{
            color: "var(--text-dim)",
            fontSize: "0.6rem",
            marginBottom: "8px",
            paddingBottom: "8px",
            borderBottom: "1px solid var(--panel-border)",
          }}
        >
          ZF-01 // MISSION CONTROL // BOOT SEQUENCE v1.0
        </div>

        <AnimatePresence>
          {BOOT_SEQUENCE.map((line, idx) =>
            visibleLines.includes(idx) ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BootLine
                  text={line.text}
                  color={line.color}
                  size={line.size}
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Skip button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5 }}
          style={{ marginTop: "24px" }}
        >
          <button
            className="btn btn-ghost"
            onClick={onComplete}
            style={{ width: "100%", fontSize: "0.75rem", minHeight: "44px" }}
          >
            SKIP INTRO ▸
          </button>
        </motion.div>
      </div>

      {/* Scanning line */}
      <motion.div
        animate={{ y: ["0vh", "100vh"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(to right, transparent, var(--green), transparent)",
          opacity: 0.3,
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </div>
  );
}
