/**
 * SystemLogs – scrolling terminal log feed.
 */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questConfig } from "../config/questConfig";

function getTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

let logIdCounter = 0;

export function SystemLogs({ extraLogs = [], maxLines = 8 }) {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  // Push extra logs when they change
  useEffect(() => {
    if (!extraLogs.length) return;
    extraLogs.forEach((msg) => {
      setLogs((prev) => [
        ...prev.slice(-maxLines + 1),
        { id: ++logIdCounter, time: getTime(), msg, type: "system" },
      ]);
    });
  }, [extraLogs.join("|")]);

  // Inject random flavor logs
  useEffect(() => {
    const randomLogs = questConfig.randomLogs ?? [];
    if (!randomLogs.length) return;

    const interval = setInterval(() => {
      // 30% chance per interval
      if (Math.random() > 0.3) return;
      const msg = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setLogs((prev) => [
        ...prev.slice(-maxLines + 1),
        { id: ++logIdCounter, time: getTime(), msg, type: "random" },
      ]);
    }, 7000);

    return () => clearInterval(interval);
  }, [maxLines]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={containerRef}
      className="sys-log"
      style={{
        maxHeight: "120px",
        overflowY: "auto",
        padding: "10px 12px",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(30,100,200,0.15)",
        borderRadius: "var(--radius)",
      }}
    >
      <AnimatePresence initial={false}>
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", gap: "8px", marginBottom: "2px" }}
          >
            <span className="log-time">[{log.time}]</span>
            <span className={log.type === "random" ? "log-random" : "log-msg"}>
              {log.msg}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {logs.length === 0 && (
        <div style={{ color: "var(--text-dim)" }}>
          [--:--:--] AWAITING INPUT...
          <span className="anim-blink">█</span>
        </div>
      )}
    </div>
  );
}

export function useLogs() {
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
  };

  const clearLogs = () => setLogs([]);

  return { logs, addLog, clearLogs };
}
