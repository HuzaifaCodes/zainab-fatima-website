/**
 * Mission page – main gameplay screen.
 * Shows HUD, timer, mission card, system logs.
 */
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HUD } from "../components/HUD";
import { MissionTimer } from "../components/MissionTimer";
import { MissionCard } from "../components/MissionCard";
import { SystemLogs } from "../components/SystemLogs";
import { ProgressBar } from "../components/shared";
import { questConfig } from "../config/questConfig";

export function MissionPage({
  missionIndex,
  deadlineMs,
  completedMissions,
  onTimerExpire,
  onPasswordSuccess,
  onEasterEgg,
  playSound,
}) {
  const missions = questConfig.missions;
  const mission = missions[missionIndex];
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initial logs on mission load
    const msgs = [
      `MISSION ${String(missionIndex + 1).padStart(2, "0")} READY`,
      `TIMER STARTED — ${mission?.durationMinutes ?? 30}:00`,
      `VIP STATUS: ACTIVE`,
    ];
    msgs.forEach((m, i) => {
      setTimeout(() => setLogs((prev) => [...prev, m]), i * 800);
    });
  }, [missionIndex]);

  if (!mission) return null;

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100%",
        position: "relative",
      }}
    >
      {/* Background grid */}
      <div className="grid-lines" />

      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,138,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* HUD */}
      <HUD
        missionIndex={missionIndex}
        completedMissions={completedMissions}
        onEasterEgg={onEasterEgg}
      />

      {/* Scrollable content */}
      <div
        className="page"
        style={{ paddingTop: "0", zIndex: 1 }}
      >
        <div className="container" style={{ paddingTop: "20px" }}>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ProgressBar
              current={missionIndex}
              total={missions.length}
              completed={completedMissions}
            />
          </motion.div>

          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="panel"
            style={{ padding: "24px 20px", marginBottom: "16px", position: "relative" }}
          >
            <div className="corner-decor corner-tl" />
            <div className="corner-decor corner-tr" />
            <div className="corner-decor corner-bl" />
            <div className="corner-decor corner-br" />

            <MissionTimer
              deadlineMs={deadlineMs}
              onExpire={onTimerExpire}
              playSound={playSound}
            />
          </motion.div>

          {/* Mission card */}
          <MissionCard
            mission={mission}
            onPasswordSuccess={() => onPasswordSuccess?.(missionIndex)}
            playSound={playSound}
          />

          {/* System logs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginBottom: "32px" }}
          >
            <div
              className="hud-label"
              style={{ marginBottom: "8px", color: "var(--text-dim)", fontSize: "0.6rem" }}
            >
              ▸ SYSTEM FEED
            </div>
            <SystemLogs extraLogs={logs} maxLines={10} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
