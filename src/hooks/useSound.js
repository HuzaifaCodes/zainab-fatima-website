/**
 * useSound – Howler.js backed sound system.
 * Falls back silently if Howler fails or audio is blocked.
 */
import { useEffect, useRef, useCallback } from "react";
import { Howl, Howler } from "howler";

// Sound definitions — paths relative to /public/sounds/
const SOUND_DEFS = {
  click: { src: ["/sounds/click.mp3"], volume: 0.6 },
  boot: { src: ["/sounds/boot.mp3"], volume: 0.8 },
  success: { src: ["/sounds/success.mp3"], volume: 0.9 },
  failure: { src: ["/sounds/failure.mp3"], volume: 0.8 },
  warning: { src: ["/sounds/warning.mp3"], volume: 0.7 },
  tick: { src: ["/sounds/tick.mp3"], volume: 0.4 },
  glitch: { src: ["/sounds/glitch.mp3"], volume: 0.7 },
  mission_unlock: { src: ["/sounds/mission_unlock.mp3"], volume: 0.9 },
  dare: { src: ["/sounds/dare.mp3"], volume: 0.8 },
  bonus: { src: ["/sounds/bonus.mp3"], volume: 0.8 },
  complete: { src: ["/sounds/complete.mp3"], volume: 1.0 },
  ambient: { src: ["/sounds/ambient.mp3"], volume: 0.15, loop: true },
  scan: { src: ["/sounds/scan.mp3"], volume: 0.5 },
};

export function useSound(soundEnabled) {
  const howls = useRef({});
  const ambientRef = useRef(null);

  // Build Howl instances lazily
  const getHowl = useCallback(
    (name) => {
      if (!soundEnabled) return null;
      if (howls.current[name]) return howls.current[name];
      const def = SOUND_DEFS[name];
      if (!def) return null;
      try {
        const h = new Howl({
          ...def,
          html5: true,
          onloaderror: () => {}, // fail silently
        });
        howls.current[name] = h;
        return h;
      } catch {
        return null;
      }
    },
    [soundEnabled]
  );

  const play = useCallback(
    (name) => {
      if (!soundEnabled) return;
      try {
        const h = getHowl(name);
        if (h) h.play();
      } catch {
        // Silently fail
      }
    },
    [soundEnabled, getHowl]
  );

  const startAmbient = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!ambientRef.current) {
        ambientRef.current = getHowl("ambient");
      }
      if (ambientRef.current && !ambientRef.current.playing()) {
        ambientRef.current.play();
      }
    } catch {
      // Silently fail
    }
  }, [soundEnabled, getHowl]);

  const stopAmbient = useCallback(() => {
    try {
      if (ambientRef.current && ambientRef.current.playing()) {
        ambientRef.current.fade(
          ambientRef.current.volume(),
          0,
          1000
        );
        setTimeout(() => {
          try { ambientRef.current?.stop(); } catch {}
        }, 1100);
      }
    } catch {}
  }, []);

  // Mute/unmute global Howler volume when preference changes
  useEffect(() => {
    Howler.mute(!soundEnabled);
  }, [soundEnabled]);

  // Stop all sounds on unmount
  useEffect(() => {
    return () => {
      Object.values(howls.current).forEach((h) => {
        try { h.unload(); } catch {}
      });
    };
  }, []);

  return { play, startAmbient, stopAmbient };
}
