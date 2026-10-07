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


    </div>
  );
}

export default App;
