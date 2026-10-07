/**
 * HUD – persistent top bar during active missions.
 */
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { questConfig } from "../config/questConfig";

export function HUD({ missionIndex, completedMissions = [], onEasterEgg }) {
  const missions = questConfig.missions;
  const op = questConfig.operative;
  const [tapCount, setTapCount] = useState(0);

  const handleTitleTap = useCallback(() => {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= (questConfig.easterEggs?.tapCount ?? 5)) {
      setTapCount(0);
      onEasterEgg?.();
    }
  }, [tapCount, onEasterEgg]);

  return (
    <div className="hud-bar">
      <div className="container" style={{ padding: "0 16px", maxWidth: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          {/* Left: callsign */}
          <button
            onClick={handleTitleTap}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div
              className="mono glow-blue"
              style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.15em" }}
            >
              ZF-01
            </div>
            <div className="hud-label" style={{ fontSize: "0.55rem" }}>
              VIP: {op.name.split(" ")[0].toUpperCase()}
            </div>
          </button>

          {/* Center: progress dots */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, justifyContent: "center" }}>
            {missions.map((m, i) => {
              const isComplete = completedMissions.includes(i);
              const isActive = i === missionIndex;
              return (
                <React.Fragment key={i}>
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: isComplete
                        ? "var(--green)"
                        : isActive
                        ? "var(--cyan)"
                        : "rgba(255,255,255,0.15)",
                      boxShadow: isComplete
                        ? "0 0 8px var(--green)"
                        : isActive
                        ? "0 0 10px var(--cyan)"
                        : "none",
                    }}
                  />
                  {i < missions.length - 1 && (
                    <div
                      style={{
                        width: 16,
                        height: 1,
                        background: isComplete
                          ? "var(--green)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Right: mission counter */}
          <div style={{ textAlign: "right" }}>
            <div
              className="mono text-cyan"
              style={{ fontSize: "0.8rem", fontWeight: 600 }}
            >
              {missionIndex + 1}/{missions.length}
            </div>
            <div className="hud-label" style={{ fontSize: "0.55rem" }}>
              {op.location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
