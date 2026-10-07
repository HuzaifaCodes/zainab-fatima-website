/**
 * EasterEggScreen – secret screen shown after 5x taps on HUD title.
 */
import React from "react";
import { motion } from "framer-motion";
import { questConfig } from "../config/questConfig";

export function EasterEggScreen({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.96)",
        zIndex: 900,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "3rem",
            marginBottom: "24px",
          }}
        >
          👁️
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.1rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "var(--cyan)",
            textShadow: "0 0 20px var(--cyan)",
            marginBottom: "8px",
          }}
        >
          YOU FOUND THE SECRET.
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
            color: "var(--text-dim)",
            marginBottom: "32px",
          }}
        >
          YOU WEREN'T SUPPOSED TO.
        </div>

        <div
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "var(--text-primary)",
            whiteSpace: "pre-line",
            marginBottom: "40px",
            padding: "20px",
            background: "rgba(0,212,255,0.05)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: "var(--radius)",
          }}
          className="selectable"
        >
          {questConfig.easterEggs?.secretMessage ??
            "YOU FOUND THE SECRET.\n\nDon't tell anyone."}
        </div>

        <button
          className="btn btn-ghost"
          onClick={onClose}
          style={{ fontSize: "0.75rem" }}
        >
          ← RETURN TO MISSION
        </button>
      </motion.div>
    </motion.div>
  );
}

/**
 * SoundEnableScreen – initial prompt to unlock audio on mobile.
 */
export function SoundEnableScreen({ onEnable, onSkip }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 950,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px",
        textAlign: "center",
      }}
    >
      <div className="grid-lines" />

      <div
        style={{
          maxWidth: "380px",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: "3.5rem", marginBottom: "24px" }}
        >
          🔊
        </motion.div>

        <div
          style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "1.4rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "var(--white)",
            marginBottom: "12px",
          }}
        >
          ZF-01
        </div>

        <div
          className="hud-label"
          style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "32px" }}
        >
          This experience includes sound effects and audio.
          <br />
          Enable sound for the full experience.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            className="btn btn-primary"
            onClick={onEnable}
            id="enable-sound-btn"
          >
            🔊 ENABLE SOUND
          </button>
          <button
            className="btn btn-ghost"
            onClick={onSkip}
            id="skip-sound-btn"
            style={{ fontSize: "0.75rem" }}
          >
            CONTINUE WITHOUT SOUND
          </button>
        </div>

        <div
          className="hud-label"
          style={{ marginTop: "32px", color: "var(--text-dim)", fontSize: "0.6rem" }}
        >
          You can toggle sound at any time.
        </div>
      </div>
    </motion.div>
  );
}
