/**
 * FinalPage – cinematic ending after all missions.
 */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questConfig } from "../config/questConfig";
import { TypewriterText } from "../components/shared";

const FINALE_SEQUENCE = [
  { text: "WE SURVIVED.", delay: 0, size: "2rem", color: "var(--green)" },
  { text: "MVP: ZAINAB FATIMA", delay: 2000, size: "0.9rem", color: "var(--cyan)" },
  { text: "MISSIONS CRUSHED: 3 / 3", delay: 3200, size: "0.85rem", color: "var(--text-secondary)" },
  { text: "STATUS: PERFECTION", delay: 4400, size: "0.85rem", color: "var(--green)" },
];

export function FinalPage({ daresCompleted, playSound }) {
  const [visibleItems, setVisibleItems] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  useEffect(() => {
    playSound?.("complete");

    FINALE_SEQUENCE.forEach((item, i) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, item.delay + 500);
    });

    setTimeout(() => setShowMessage(true), 6500);
    setTimeout(() => setShowFinal(true), 8000);
    setTimeout(() => setShowEnd(true), 10000);
  }, []);

  const finalMsg = questConfig.finalMessage ?? "";
  const finalMsgWithDares = finalMsg.replace("{DARES}", String(daresCompleted));

  return (
    <div
      style={{
        minHeight: "100%",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 24px",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background effects */}
      <div className="grid-lines" />
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at center, rgba(0,255,136,0.04) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(0,255,136,0.08) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(0,255,136,0.04) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Green border pulse */}
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            position: "fixed",
            inset: 0,
            border: "1px solid var(--green)",
            boxShadow: "inset 0 0 60px rgba(0,255,136,0.08)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Header info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
            letterSpacing: "0.15em",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(0,255,136,0.15)",
          }}
        >
          ZF-01 // MISSION CONTROL // FINAL THOUGHTS
        </motion.div>

        {/* Status sequence */}
        <div style={{ marginBottom: "40px" }}>
          <AnimatePresence>
            {FINALE_SEQUENCE.map((item, i) =>
              visibleItems.includes(i) ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: item.size,
                    fontWeight: i === 0 ? 700 : 500,
                    color: item.color,
                    textShadow: `0 0 20px ${item.color}`,
                    letterSpacing: "0.08em",
                    marginBottom: i === 0 ? "24px" : "10px",
                  }}
                >
                  {i === 0 ? (
                    <TypewriterText text={item.text} speed={60} />
                  ) : (
                    <span>▸ {item.text}</span>
                  )}
                </motion.div>
              ) : null
            )}
          </AnimatePresence>

          {/* Dares */}
          {visibleItems.includes(2) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                marginTop: "4px",
              }}
            >
              ▸ DARES COMPLETED: {daresCompleted}
            </motion.div>
          )}
        </div>

        {/* Divider */}
        {showMessage && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="divider"
            style={{ marginBottom: "32px" }}
          />
        )}

        {/* Personal final message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="panel"
              style={{
                padding: "28px 24px",
                marginBottom: "32px",
                border: "1px solid rgba(0,255,136,0.2)",
                position: "relative",
              }}
            >
              <div className="corner-decor corner-tl" style={{ borderColor: "var(--green)" }} />
              <div className="corner-decor corner-tr" style={{ borderColor: "var(--green)" }} />
              <div className="corner-decor corner-bl" style={{ borderColor: "var(--green)" }} />
              <div className="corner-decor corner-br" style={{ borderColor: "var(--green)" }} />

              <div
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "var(--text-primary)",
                  whiteSpace: "pre-line",
                  fontWeight: 400,
                }}
                className="selectable"
              >
                {finalMsgWithDares}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* END OF QUEST */}
        <AnimatePresence>
          {showFinal && (
            <motion.div
              key="end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", marginBottom: "24px" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: "var(--green)",
                  textShadow: "0 0 20px var(--green)",
                  marginBottom: "16px",
                }}
              >
                THAT'S ALL FOLKS
              </div>
              <div
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                }}
              >
                I love you. Now let's go get food.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final decorative element */}
        <AnimatePresence>
          {showEnd && (
            <motion.div
              key="deco"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              {/* Animated ZF-01 final insignia */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ margin: "0 auto", display: "block" }}>
                <motion.circle
                  cx={40} cy={40} r={36}
                  stroke="var(--green)"
                  strokeWidth={1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <text x={40} y={38} textAnchor="middle" fill="var(--green)" fontSize={11} fontFamily="'IBM Plex Mono'" fontWeight={600} letterSpacing={3}>ZF</text>
                <text x={40} y={52} textAnchor="middle" fill="var(--green)" fontSize={9} fontFamily="'IBM Plex Mono'" letterSpacing={2} opacity={0.7}>DONE</text>
              </svg>

              <div
                className="hud-label"
                style={{
                  color: "var(--text-dim)",
                  fontSize: "0.55rem",
                  marginTop: "16px",
                  letterSpacing: "0.2em",
                }}
              >
                ZF-01 // QUEST ARCHIVE // COMPLETE
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
