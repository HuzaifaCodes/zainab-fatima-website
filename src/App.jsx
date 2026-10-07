/**
 * App.jsx – ZF-01 Quest Orchestrator
 * Controls all phase transitions, persists state, wires up sound.
 */
import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useQuestState } from "./hooks/useQuestState";
import { useSound } from "./hooks/useSound";
import { questConfig } from "./config/questConfig";

import { LockedScreen } from "./pages/LockedScreen";
import { ActivationScreen } from "./pages/ActivationScreen";
import { MissionPage } from "./pages/Mission";
import { VideoRewardPage } from "./pages/VideoRewardPage";
import { DarePage } from "./pages/DarePage";
import { FinalPage } from "./pages/FinalPage";
import { EasterEggScreen } from "./pages/EasterEggScreen";
// SoundController removed

function App() {
  const {
    state,
    setState,
    currentMissionConfig,
    getMissionDeadline,
    missions,
    startActivation,
    startMission,
    advanceMission,
    goToVideo,
    activateDare,
    acceptDare,
    setSoundEnabled,
    markActivationPlayed,
    resetQuest,
  } = useQuestState();

  const { play, startAmbient, stopAmbient } = useSound(state.soundEnabled);

  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // ── Quest start detection ─────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== "locked") return;

    const checkStart = () => {
      const now = Date.now();
      const startTs = new Date(questConfig.startTime).getTime();
      if (now >= startTs) {
        startActivation();
      }
    };

    checkStart();
    const interval = setInterval(checkStart, 1000);
    return () => clearInterval(interval);
  }, [state.phase, startActivation]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleActivationComplete = useCallback(() => {
    markActivationPlayed();
    startMission(0);
    play("mission_unlock");
    setTimeout(() => startAmbient(), 500);
  }, [markActivationPlayed, startMission, play, startAmbient]);

  const handlePasswordSuccess = useCallback(
    (missionIdx) => {
      play("success");
      goToVideo(missionIdx);
    },
    [play, goToVideo]
  );

  const handleTimerExpire = useCallback(() => {
    activateDare();
    play("dare");
    stopAmbient();
  }, [activateDare, play, stopAmbient]);

  const handleDareAccepted = useCallback(() => {
    acceptDare();
    play("bonus");
    setTimeout(() => startAmbient(), 1000);
  }, [acceptDare, play, startAmbient]);

  const handleVideoEnd = useCallback(() => {
    const idx = state.currentMission;
    advanceMission(idx);
    if (idx < missions.length - 1) {
      play("mission_unlock");
    } else {
      play("complete");
      stopAmbient();
    }
  }, [state.currentMission, advanceMission, missions.length, play, stopAmbient]);

  const handleEasterEgg = useCallback(() => {
    play("glitch");
    setShowEasterEgg(true);
  }, [play]);

  // ── Current mission deadline ──────────────────────────────────────────────
  const deadlineMs = getMissionDeadline();

  // ── Phase routing ─────────────────────────────────────────────────────────
  const renderPhase = () => {
    const { phase, currentMission, completedMissions, daresCompleted, currentDare } = state;

    switch (phase) {
      case "locked":
        return (
          <LockedScreen
            key="locked"
            onUnlock={startActivation}
          />
        );

      case "activation":
        return (
          <ActivationScreen
            key="activation"
            onComplete={handleActivationComplete}
            playSound={play}
          />
        );

      case "mission":
        return (
          <MissionPage
            key={`mission-${currentMission}`}
            missionIndex={currentMission}
            deadlineMs={deadlineMs}
            completedMissions={completedMissions ?? []}
            onTimerExpire={handleTimerExpire}
            onPasswordSuccess={handlePasswordSuccess}
            onEasterEgg={handleEasterEgg}
            playSound={play}
          />
        );

      case "video":
        return (
          <VideoRewardPage
            key={`video-${currentMission}`}
            missionIndex={currentMission}
            onVideoEnd={handleVideoEnd}
            playSound={play}
          />
        );

      case "dare":
        return (
          <DarePage
            key="dare"
            dare={currentDare}
            onDareAccepted={handleDareAccepted}
            playSound={play}
          />
        );

      case "final":
        return (
          <FinalPage
            key="final"
            daresCompleted={daresCompleted ?? 0}
            playSound={play}
          />
        );

      default:
        return <LockedScreen key="locked-default" onUnlock={startActivation} />;
    }
  };

  const activeMission = state.phase === "mission";

  return (
    <div className="app-shell">
      {/* Global overlays */}
      <div className="grain-overlay" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      {/* Easter egg overlay */}
      <AnimatePresence>
        {showEasterEgg && (
          <EasterEggScreen
            key="easter"
            onClose={() => setShowEasterEgg(false)}
          />
        )}
      </AnimatePresence>

      {/* Main phase content */}
      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>

      {/* Dev reset button — remove before deploy */}
      {import.meta.env.DEV && (
        <button
          onClick={() => {
            localStorage.removeItem("zf01_quest_state_v3");
            localStorage.removeItem("zf01_sound_answered");
            window.location.reload();
          }}
          style={{
            position: "fixed",
            top: "8px",
            left: "8px",
            zIndex: 9999,
            background: "rgba(255,34,68,0.2)",
            border: "1px solid var(--red)",
            color: "var(--red)",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            cursor: "pointer",
            letterSpacing: "0.08em",
          }}
        >
          [DEV] RESET
        </button>
      )}
      {/* DEV: Skip to mission */}
      {import.meta.env.DEV && (
        <button
          onClick={() => {
            const missionState = {
              phase: "mission",
              currentMission: 0,
              missionStartedAt: Date.now(),
              bonusMs: 0,
              daresCompleted: 0,
              currentDare: null,
              dareActive: false,
              dareAccepted: false,
              passwordAttempts: 0,
              completedMissions: [],
              activationPlayed: true,
              soundEnabled: false,
              questComplete: false,
              finalStartedAt: null,
            };
            localStorage.setItem("zf01_quest_state_v3", JSON.stringify(missionState));
            localStorage.setItem("zf01_sound_answered", "1");
            window.location.reload();
          }}
          style={{
            position: "fixed",
            top: "8px",
            left: "90px",
            zIndex: 9999,
            background: "rgba(45,138,255,0.2)",
            border: "1px solid var(--blue-bright)",
            color: "var(--blue-bright)",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            cursor: "pointer",
            letterSpacing: "0.08em",
          }}
        >
          [DEV] → M1
        </button>
      )}
    </div>
  );
}

export default App;
