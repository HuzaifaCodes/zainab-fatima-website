/**
 * LockedScreen – shown before quest start time.
 * Cinematic countdown with radar, system info, blinking messages.
 */
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStartCountdown } from "../hooks/useCountdown";
import { questConfig } from "../config/questConfig";
import { RadarGraphic, TypewriterText } from "../components/shared";

function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

// SVG ZF-01 logo
function ZF01Logo({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Outer ring */}
      <circle cx={60} cy={60} r={55} stroke="#2d8aff" strokeWidth={1.5} opacity={0.4} />
      <circle cx={60} cy={60} r={48} stroke="#2d8aff" strokeWidth={0.5} opacity={0.25} />

      {/* Corner ticks */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 60 + 50 * Math.cos(rad);
        const y1 = 60 + 50 * Math.sin(rad);
        const x2 = 60 + 44 * Math.cos(rad);
        const y2 = 60 + 44 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2d8aff" strokeWidth={2} opacity={0.7} />;
      })}

      {/* Inner hexagon */}
      <polygon
        points="60,22 89,38 89,70 60,86 31,70 31,38"
        stroke="#2d8aff"
        strokeWidth={1}
        fill="rgba(45,138,255,0.06)"
        opacity={0.7}
      />

      {/* ZF text */}
      <text
        x={60}
        y={53}
        textAnchor="middle"
        fill="#f0f4ff"
        fontSize={18}
        fontWeight={700}
        fontFamily="'Space Grotesk', sans-serif"
        letterSpacing={4}
      >
        ZF
      </text>
      {/* 01 text */}
      <text
        x={60}
        y={70}
        textAnchor="middle"
        fill="#2d8aff"
        fontSize={14}
        fontWeight={600}
        fontFamily="'IBM Plex Mono', monospace"
        letterSpacing={2}
      >
        01
      </text>

      {/* Scanning line animation */}
      <motion.line
        x1={5} x2={115}
        animate={{ y1: [15, 105, 15], y2: [15, 105, 15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        stroke="#2d8aff"
        strokeWidth={0.8}
        opacity={0.3}
      />
    </svg>
  );
}

export function LockedScreen({ onUnlock }) {
  const startTs = new Date(questConfig.startTime).getTime();
  const { hours, minutes, seconds, isExpired } = useQuestStartCountdown(
    questConfig.startTime
  );

  // Format start time for display
  const startDate = new Date(questConfig.startTime);
  const startTimeStr = startDate.toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  });
  const startDateStr = startDate.toLocaleDateString("en-PK", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Karachi",
  });

  useEffect(() => {
    if (isExpired) {
      onUnlock?.();
    }
  }, [isExpired, onUnlock]);

  const infoRows = [
    { label: "LOCATION", value: questConfig.operative.location },
    { label: "VIP GUEST", value: questConfig.operative.name.toUpperCase() },
    { label: "STATUS", value: "WAITING IMPATIENTLY" },
    { label: "STARTS EXACTLY AT", value: startTimeStr },
  ];

  return (
    <div
      className="page"
      style={{
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div className="grid-lines" />

      {/* Animated background glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,138,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{
          padding: "0 24px",
          paddingTop: "48px",
          paddingBottom: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "24px" }}
          className="anim-float"
        >
          <ZF01Logo size={100} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: "center", marginBottom: "8px" }}
        >
          <div
            className="glow-blue"
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "clamp(2rem, 10vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "var(--white)",
            }}
          >
            ZF-01
          </div>
          <div
            className="hud-label"
            style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "var(--blue-bright)" }}
          >
            TOP SECRET SURPRISE
          </div>
        </motion.div>

        <div className="divider" style={{ margin: "16px 0" }} />

        {/* ACCESS DENIED */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: "center", marginBottom: "24px" }}
        >
          <div
            className="glow-red"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "var(--red)",
              marginBottom: "4px",
            }}
          >
            ▸ NUH UH. NOT YET. ◂
          </div>
          <div
            className="hud-label"
            style={{ color: "var(--text-dim)", fontSize: "0.65rem" }}
          >
            BE PATIENT TIL {startTimeStr.toUpperCase()}
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="panel panel-blue"
          style={{
            padding: "28px 24px",
            width: "100%",
            textAlign: "center",
            position: "relative",
            marginBottom: "20px",
          }}
        >
          <div className="corner-decor corner-tl" />
          <div className="corner-decor corner-tr" />
          <div className="corner-decor corner-bl" />
          <div className="corner-decor corner-br" />

          <div
            className="hud-label"
            style={{ marginBottom: "16px", color: "var(--text-dim)", fontSize: "0.65rem" }}
          >
            MISSION COUNTDOWN
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {/* Hours */}
            <div className="countdown-digit-group">
              <div className="countdown-digit glow-blue">{pad(hours)}</div>
              <div className="hud-label" style={{ fontSize: "0.6rem" }}>HOURS</div>
            </div>
            <div
              className="countdown-digit glow-blue anim-blink"
              style={{ paddingBottom: "18px" }}
            >
              :
            </div>
            {/* Minutes */}
            <div className="countdown-digit-group">
              <div className="countdown-digit glow-blue">{pad(minutes)}</div>
              <div className="hud-label" style={{ fontSize: "0.6rem" }}>MINUTES</div>
            </div>
            <div
              className="countdown-digit glow-blue anim-blink"
              style={{ paddingBottom: "18px" }}
            >
              :
            </div>
            {/* Seconds */}
            <div className="countdown-digit-group">
              <div className="countdown-digit glow-blue">{pad(seconds)}</div>
              <div className="hud-label" style={{ fontSize: "0.6rem" }}>SECONDS</div>
            </div>
          </div>
        </motion.div>

        {/* Info rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="panel"
          style={{ padding: "16px 20px", width: "100%", marginBottom: "20px" }}
        >
          {infoRows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom:
                  i < infoRows.length - 1
                    ? "1px solid rgba(30,100,200,0.1)"
                    : "none",
              }}
            >
              <span className="hud-label" style={{ fontSize: "0.6rem" }}>
                {row.label}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: "0.72rem",
                  color:
                    row.label === "STATUS"
                      ? "var(--amber)"
                      : "var(--text-secondary)",
                  letterSpacing: "0.08em",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Radar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginBottom: "24px", opacity: 0.6 }}
        >
          <RadarGraphic size={140} />
        </motion.div>

        {/* Blinking warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ textAlign: "center" }}
        >
          <div
            className="mono anim-blink"
            style={{
              fontSize: "0.7rem",
              color: "var(--text-dim)",
              letterSpacing: "0.1em",
              fontStyle: "italic",
            }}
          >
            I see you peeking. Wait til the timer hits zero 👀
          </div>
        </motion.div>

        {/* Scanning line visual */}
        <motion.div
          animate={{ y: ["0%", "100vh"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(to right, transparent, var(--blue-bright), transparent)",
            opacity: 0.2,
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {startDateStr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="hud-label"
            style={{
              marginTop: "24px",
              color: "var(--text-dim)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
            }}
          >
            {startDateStr.toUpperCase()}
          </motion.div>
        )}
      </div>
    </div>
  );
}
