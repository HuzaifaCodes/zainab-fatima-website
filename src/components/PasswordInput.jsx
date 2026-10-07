/**
 * PasswordInput – futuristic terminal-style password entry.
 */
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PasswordInput({ acceptedPasswords, onSuccess, onFailure, playSound }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);

  const normalize = (s) => s.trim().toUpperCase();

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (status === "success") return;

      const normalized = normalize(value);
      const accepted = (acceptedPasswords ?? []).map(normalize);

      if (accepted.includes(normalized)) {
        setStatus("success");
        playSound?.("success");
        setTimeout(() => onSuccess?.(), 1200);
      } else {
        setStatus("error");
        setErrorMsg("BRUH. WRONG.");
        setShaking(true);
        playSound?.("failure");
        onFailure?.();
        setTimeout(() => {
          setStatus("idle");
          setShaking(false);
          setErrorMsg("");
        }, 1500);
      }
    },
    [value, acceptedPasswords, status, onSuccess, onFailure, playSound]
  );

  return (
    <motion.div
      animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: "16px" }}>
          <div
            className="hud-label"
            style={{ marginBottom: "10px", color: "var(--text-dim)" }}
          >
            ▸ ENTER SECRET CODE
          </div>

          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              type="text"
              className={`password-input ${status === "error" ? "error" : status === "success" ? "success" : ""}`}
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="_ _ _ _ _ _ _"
              maxLength={32}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              disabled={status === "success"}
              aria-label="Authorization code"
            />

            {/* Blinking cursor indicator */}
            {status === "idle" && (
              <div
                style={{
                  position: "absolute",
                  bottom: "6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "2px",
                  height: "3px",
                  background: "var(--cyan)",
                  pointerEvents: "none",
                }}
                className="anim-blink"
              />
            )}
          </div>
        </div>

        {/* Status message */}
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: "center",
                marginBottom: "16px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "1.1rem",
                letterSpacing: "0.15em",
                color: status === "success" ? "var(--green)" : "var(--red)",
                textShadow:
                  status === "success"
                    ? "0 0 20px var(--green)"
                    : "0 0 20px var(--red)",
              }}
            >
              {status === "success" ? "▸ SLAY. CORRECT. ◂" : `▸ ${errorMsg} ◂`}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className={`btn ${status === "success" ? "btn-success" : "btn-primary"}`}
          disabled={status === "success" || !value}
          onClick={() => playSound?.("click")}
        >
          {status === "success" ? "✓ YAY!" : "SUBMIT"}
        </button>
      </form>
    </motion.div>
  );
}
