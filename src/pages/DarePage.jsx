/**
 * DarePage – shown when mission timer expires.
 * Displays random dare, accepts completion, adds bonus time.
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questConfig } from "../config/questConfig";

export function DarePage({ dare, onDareAccepted, playSound }) {
  const [phase, setPhase] = useState("failed"); // failed | penalty | dare | accepted

  useEffect(() => {
    playSound?.("dare");
    const t1 = setTimeout(() => setPhase("penalty"), 1800);
    const t2 = setTimeout(() => setPhase("dare"), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleAccept = () => {
    playSound?.("bonus");
    setPhase("accepted");
    setTimeout(() => onDareAccepted?.(), 3000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        overflow: "hidden",
      }}
    >
      {/* Background red glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, rgba(255,34,68,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Edge glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: "fixed",
          inset: 0,
          border: "2px solid var(--red)",
          boxShadow: "inset 0 0 40px rgba(255,34,68,0.15)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 2 }}>
        <AnimatePresence mode="wait">

          {/* MISSION FAILED */}
          {phase === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(1.8rem, 10vw, 3rem)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "var(--red)",
                  textShadow: "0 0 40px var(--red)",
                }}
              >
                LMAO YOU RAN OUT OF TIME
              </div>
              <div
                className="hud-label"
                style={{ color: "var(--text-dim)", marginTop: "12px" }}
              >
                TIMER EXPIRED
              </div>
            </motion.div>
          )}

          {/* PENALTY PROTOCOL */}
          {phase === "penalty" && (
            <motion.div
              key="penalty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center" }}
            >
              <div
                className="hud-label"
                style={{ color: "var(--red)", fontSize: "0.75rem", marginBottom: "16px" }}
              >
                ⚠ TIME FOR CONSEQUENCES 😈 ⚠
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.2rem",
                  color: "var(--amber)",
                  letterSpacing: "0.1em",
                }}
              >
                You thought you'd get away with it?
              </div>
            </motion.div>
          )}

          {/* DARE */}
          {phase === "dare" && (
            <motion.div
              key="dare"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="hud-label"
                style={{
                  textAlign: "center",
                  color: "var(--amber)",
                  fontSize: "0.75rem",
                  marginBottom: "20px",
                  letterSpacing: "0.2em",
                }}
              >
                ⚡ YOUR DARE ⚡
              </div>

              {/* Dare card */}
              <motion.div
                className="panel panel-amber"
                style={{
                  padding: "28px 24px",
                  marginBottom: "28px",
                  position: "relative",
                  textAlign: "center",
                }}
                animate={{ boxShadow: ["0 0 20px var(--amber-glow)", "0 0 40px var(--amber-glow)", "0 0 20px var(--amber-glow)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="corner-decor corner-tl" style={{ borderColor: "var(--amber)" }} />
                <div className="corner-decor corner-tr" style={{ borderColor: "var(--amber)" }} />
                <div className="corner-decor corner-bl" style={{ borderColor: "var(--amber)" }} />
                <div className="corner-decor corner-br" style={{ borderColor: "var(--amber)" }} />

                <div
                  style={{
                    fontFamily: "var(--font-primary)",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    color: "var(--white)",
                    fontWeight: 500,
                  }}
                >
                  {dare}
                </div>
              </motion.div>

              <div
                className="mono"
                style={{
                  textAlign: "center",
                  fontSize: "0.72rem",
                  color: "var(--text-dim)",
                  marginBottom: "20px",
                }}
              >
                Complete the dare to receive +{questConfig.bonusTimeMinutes} minutes.
              </div>

              <button
                className="btn btn-amber"
                onClick={handleAccept}
                id="dare-accepted-btn"
                style={{ fontSize: "1rem" }}
              >
                ⚡ OK FINE I DID IT
              </button>
            </motion.div>
          )}

          {/* ACCEPTED */}
          {phase === "accepted" && (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6, repeat: 3 }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--green)",
                  textShadow: "0 0 30px var(--green)",
                  marginBottom: "16px",
                  letterSpacing: "0.1em",
                }}
              >
                GOOD GIRL
              </motion.div>

              <div
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  marginBottom: "24px",
                }}
              >
                HERE'S SOME EXTRA TIME
              </div>

              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(2.5rem, 14vw, 4rem)",
                  fontWeight: 700,
                  color: "var(--green)",
                  textShadow: "0 0 30px var(--green)",
                  letterSpacing: "0.1em",
                }}
              >
                +{String(questConfig.bonusTimeMinutes).padStart(2, "0")}:00
              </div>

              <div
                className="hud-label"
                style={{ color: "var(--text-dim)", marginTop: "16px" }}
              >
                MISSION CONTINUES...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
