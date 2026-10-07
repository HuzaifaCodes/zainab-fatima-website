/**
 * VideoRewardPage – cinematic video player after password success.
 */
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questConfig } from "../config/questConfig";

export function VideoRewardPage({ missionIndex, onVideoEnd, playSound }) {
  const missions = questConfig.missions;
  const mission = missions[missionIndex];
  const videoRef = useRef(null);
  const [phase, setPhase] = useState("access_granted"); // access_granted | playing | message
  const [error, setError] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // Transition sequence: access_granted → playing (after 2.5s)
  React.useEffect(() => {
    if (phase !== "access_granted") return;
    playSound?.("mission_unlock");
    const t = setTimeout(() => setPhase("playing"), 2500);
    return () => clearTimeout(t);
  }, [phase, playSound]);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    setPhase("message");
  }, []);

  const handleVideoError = useCallback(() => {
    setError(true);
    setPhase("message");
  }, []);

  const handleContinue = useCallback(() => {
    playSound?.("click");
    onVideoEnd?.();
  }, [onVideoEnd, playSound]);

  if (!mission) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ACCESS GRANTED phase */}
      <AnimatePresence>
        {phase === "access_granted" && (
          <motion.div
            key="ag"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            style={{
              textAlign: "center",
              padding: "40px 24px",
            }}
          >
            {/* Green flash border */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.5, times: [0, 0.3, 1] }}
              style={{
                position: "fixed",
                inset: 0,
                border: "4px solid var(--green)",
                boxShadow: "inset 0 0 80px rgba(0,255,136,0.3)",
                pointerEvents: "none",
              }}
            />

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "2.5rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "var(--green)",
                textShadow: "0 0 40px var(--green)",
                marginBottom: "16px",
              }}
            >
              ▸ YOU DID IT! ◂
            </motion.div>

            <div
              className="hud-label"
              style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}
            >
              Loading your reward... 🥺
            </div>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--green)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video phase */}
      <AnimatePresence>
        {phase === "playing" && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
          >
            {error ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 24px",
                  textAlign: "center",
                  gap: "16px",
                }}
              >
                <div
                  className="mono"
                  style={{ color: "var(--red)", fontSize: "0.9rem" }}
                >
                  MISSION CONTROL ENCOUNTERED A PROBLEM.
                </div>
                <div
                  className="hud-label"
                  style={{ color: "var(--text-dim)", fontSize: "0.65rem" }}
                >
                  Video file not found. Add {mission.video} to /public/
                </div>
                <button className="btn btn-danger" onClick={() => setPhase("message")}>
                  SKIP VIDEO
                </button>
                <button className="btn btn-ghost" onClick={() => { setError(false); setPhase("playing"); }}>
                  RETRY
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={mission.video}
                  autoPlay
                  playsInline
                  controls
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "#000",
                  }}
                  onEnded={handleVideoEnd}
                  onError={handleVideoError}
                />
                {/* Skip button overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: `calc(20px + env(safe-area-inset-bottom, 0px))`,
                    right: "16px",
                  }}
                >
                  <button
                    className="btn btn-ghost"
                    style={{ minHeight: "40px", fontSize: "0.7rem", width: "auto", padding: "10px 16px" }}
                    onClick={() => setPhase("message")}
                  >
                    SKIP ▸
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message phase */}
      <AnimatePresence>
        {phase === "message" && (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: "center",
              padding: "40px 28px",
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-dim)",
                letterSpacing: "0.15em",
                marginBottom: "24px",
              }}
            >
              MISSION {String(missionIndex + 1).padStart(2, "0")} CRUSHED 💅
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "1.2rem",
                fontWeight: 500,
                color: "var(--white)",
                lineHeight: 1.6,
                marginBottom: "40px",
                whiteSpace: "pre-line",
              }}
            >
              {mission.completionMessage}
            </motion.div>

            {missionIndex < missions.length - 1 ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="btn btn-primary"
                onClick={handleContinue}
                id={`continue-mission-${missionIndex + 2}`}
              >
                MISSION {missionIndex + 2} ▸
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="btn btn-success"
                onClick={handleContinue}
                id="continue-final"
              >
                CONTINUE ▸
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
