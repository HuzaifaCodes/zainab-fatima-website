/**
 * useQuestState – single source of truth for all game state.
 * Persists to localStorage. Real-time timer based on actual timestamps.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { questConfig } from "../config/questConfig";

const STORAGE_KEY = "zf01_quest_state_v3";

const defaultState = () => ({
  // Game phase: 'locked' | 'activation' | 'mission' | 'video' | 'dare' | 'final'
  phase: "locked",
  currentMission: 0, // 0-indexed
  // Timestamp (ms) when mission timer started (or re-started after dare)
  missionStartedAt: null,
  // Extra ms added by dare bonuses
  bonusMs: 0,
  // Per-mission dare tracking
  daresCompleted: 0,
  currentDare: null,
  dareActive: false,
  dareAccepted: false,
  // Password attempts
  passwordAttempts: 0,
  // Which missions have been completed
  completedMissions: [],
  // Whether activation sequence has played
  activationPlayed: false,
  // Sound preference
  soundEnabled: true,
  // Final state
  questComplete: false,
  finalStartedAt: null,
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently continue in-memory if localStorage unavailable
  }
}

export function useQuestState() {
  const [state, setStateRaw] = useState(loadState);
  const stateRef = useRef(state);

  const setState = useCallback((updater) => {
    setStateRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const merged = { ...prev, ...next };
      stateRef.current = merged;
      saveState(merged);
      return merged;
    });
  }, []);

  // ── Derived: mission config ───────────────────────────────────────────────
  const missions = questConfig.missions;
  const currentMissionConfig = missions[state.currentMission] ?? null;

  // ── Mission deadline calculation ─────────────────────────────────────────
  // Returns the ms timestamp when current mission expires.
  const getMissionDeadline = useCallback(
    (s = state) => {
      if (!s.missionStartedAt || !currentMissionConfig) return null;
      const durationMs =
        (currentMissionConfig.durationMinutes ?? 30) * 60 * 1000;
      return s.missionStartedAt + durationMs + (s.bonusMs ?? 0);
    },
    [state, currentMissionConfig]
  );

  // ── Actions ───────────────────────────────────────────────────────────────

  const startActivation = useCallback(() => {
    setState({ phase: "activation" });
  }, [setState]);

  const startMission = useCallback(
    (missionIndex = 0) => {
      setState({
        phase: "mission",
        currentMission: missionIndex,
        missionStartedAt: Date.now(),
        bonusMs: 0,
        dareActive: false,
        dareAccepted: false,
        currentDare: null,
        passwordAttempts: 0,
      });
    },
    [setState]
  );

  const advanceMission = useCallback(
    (fromIndex) => {
      const nextIndex = fromIndex + 1;
      if (nextIndex >= missions.length) {
        // Quest complete
        setState({
          phase: "final",
          questComplete: true,
          finalStartedAt: Date.now(),
          completedMissions: [...state.completedMissions, fromIndex],
        });
      } else {
        setState({
          phase: "mission",
          currentMission: nextIndex,
          missionStartedAt: Date.now(),
          bonusMs: 0,
          dareActive: false,
          dareAccepted: false,
          currentDare: null,
          passwordAttempts: 0,
          completedMissions: [...state.completedMissions, fromIndex],
        });
      }
    },
    [setState, state.completedMissions, missions.length]
  );

  const goToVideo = useCallback(
    (missionIndex) => {
      setState({
        phase: "video",
        currentMission: missionIndex,
      });
    },
    [setState]
  );

  const activateDare = useCallback(() => {
    const dares = questConfig.dares;
    const dare = dares[Math.floor(Math.random() * dares.length)];
    setState({
      phase: "dare",
      dareActive: true,
      dareAccepted: false,
      currentDare: dare,
    });
  }, [setState]);

  const acceptDare = useCallback(() => {
    const bonusMs = (questConfig.bonusTimeMinutes ?? 10) * 60 * 1000;
    setState((prev) => ({
      phase: "mission",
      dareAccepted: true,
      dareActive: false,
      daresCompleted: prev.daresCompleted + 1,
      // Extend the DEADLINE by adding bonus to bonusMs
      bonusMs: (prev.bonusMs ?? 0) + bonusMs,
      // Keep missionStartedAt unchanged — we're just adding time
    }));
  }, [setState]);

  const setSoundEnabled = useCallback(
    (enabled) => {
      setState({ soundEnabled: enabled });
    },
    [setState]
  );

  const markActivationPlayed = useCallback(() => {
    setState({ activationPlayed: true });
  }, [setState]);

  const recordPasswordAttempt = useCallback(() => {
    setState((prev) => ({ passwordAttempts: prev.passwordAttempts + 1 }));
  }, [setState]);

  const resetQuest = useCallback(() => {
    const fresh = defaultState();
    setState(fresh);
  }, [setState]);

  return {
    state,
    setState,
    // Derived
    currentMissionConfig,
    getMissionDeadline,
    missions,
    // Actions
    startActivation,
    startMission,
    advanceMission,
    goToVideo,
    activateDare,
    acceptDare,
    setSoundEnabled,
    markActivationPlayed,
    recordPasswordAttempt,
    resetQuest,
  };
}
