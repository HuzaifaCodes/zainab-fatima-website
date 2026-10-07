/**
 * MissionCard – per-mission display with hint reveal and password entry.
 */
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DecryptAnimation } from "./shared";
import { PasswordInput } from "./PasswordInput";

export function MissionCard({ mission, onPasswordSuccess, playSound }) {
  const [hintPhase, setHintPhase] = useState("locked"); // locked | decrypting | revealed
  const [passwordPhase, setPasswordPhase] = useState("hidden"); // hidden | shown

  const handleRevealHint = useCallback(() => {
    if (hintPhase !== "locked") return;
    playSound?.("scan");
    setHintPhase("decrypting");
    setTimeout(() => {
      setHintPhase("revealed");
      setTimeout(() => setPasswordPhase("shown"), 600);
    }, 1400);
  }, [hintPhase, playSound]);

  return (
    <div>
      {/* Mission header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="panel panel-blue"
        style={{ padding: "24px 20px", marginBottom: "16px", position: "relative" }}
      >
        <div className="corner-decor corner-tl" />
        <div className="corner-decor corner-tr" />
        <div className="corner-decor corner-bl" />
        <div className="corner-decor corner-br" />

        <div
          className="hud-label"
          style={{ marginBottom: "8px", color: "var(--blue-bright)" }}
        >
          {mission.badge || `MISSION ${String(mission.id).padStart(2, "0")}`}
        </div>

        <div
          style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            marginBottom: "12px",
            color: "var(--white)",
          }}
        >
          {mission.title}
        </div>

        {mission.subtitle && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {mission.subtitle}
          </div>
        )}
      </motion.div>

      {/* Hint section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="panel"
        style={{ padding: "20px", marginBottom: "16px" }}
      >
        <div
          className="hud-label"
          style={{ marginBottom: "12px", color: "var(--text-dim)" }}
        >
          ▸ THE TEA ☕
        </div>

        <AnimatePresence mode="wait">
          {hintPhase === "locked" && (
            <motion.div key="locked" exit={{ opacity: 0 }}>
              <div
                style={{
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "var(--radius)",
                  border: "1px dashed rgba(30,100,200,0.3)",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ fontSize: "2rem", marginBottom: "8px" }}
                >
                  🔒
                </div>
                <div
                  className="hud-label"
                  style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}
                >
                  HINT LOCKED
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-dim)",
                    marginTop: "4px",
                    opacity: 0.6,
                  }}
                >
                  CLICK TO REVEAL
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleRevealHint}
                id="reveal-hint-btn"
              >
                ▸ REVEAL HINT
              </button>
            </motion.div>
          )}

          {hintPhase === "decrypting" && (
            <motion.div
              key="decrypting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "20px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "var(--radius)",
                textAlign: "center",
              }}
            >
              <div
                className="hud-label"
                style={{
                  color: "var(--blue-bright)",
                  marginBottom: "12px",
                  fontSize: "0.7rem",
                }}
              >
                ▸ SPILLING THE TEA...
              </div>
              {/* Progress bars */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.4, delay: i * 0.3 }}
                  style={{
                    height: "3px",
                    background: "var(--blue-bright)",
                    borderRadius: "2px",
                    marginBottom: "6px",
                    boxShadow: "0 0 8px var(--blue-glow)",
                  }}
                />
              ))}
              <div
                className="mono"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--cyan)",
                  marginTop: "10px",
                  letterSpacing: "0.2em",
                }}
              >
                <DecryptAnimation text="Hacking into the mainframe (jk just loading)..." duration={1000} />
              </div>
            </motion.div>
          )}

          {hintPhase === "revealed" && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                style={{
                  padding: "18px",
                  background: "rgba(0,212,255,0.05)",
                  borderRadius: "var(--radius)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  marginBottom: "16px",
                }}
              >
                <div
                  className="hud-label"
                  style={{
                    color: "var(--cyan)",
                    marginBottom: "10px",
                    fontSize: "0.65rem",
                  }}
                >
                  📍 YOUR CLUE:
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                    color: "var(--white)",
                    whiteSpace: "pre-line",
                  }}
                  className="selectable"
                >
                  {mission.hint}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Password section */}
      <AnimatePresence>
        {passwordPhase === "shown" && (
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="panel panel-blue"
            style={{ padding: "20px", marginBottom: "24px" }}
          >
            <div
              className="hud-label"
              style={{ marginBottom: "6px", color: "var(--blue-bright)" }}
            >
              ▸ FOUND IT?
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                marginBottom: "16px",
              }}
            >
              Type the secret word you found on the paper.
            </div>

            <PasswordInput
              acceptedPasswords={mission.acceptedPasswords}
              onSuccess={() => onPasswordSuccess?.()}
              onFailure={() => {}}
              playSound={playSound}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
