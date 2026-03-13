"use client";

import { createContext, useContext, useState, useCallback } from "react";

const SpeedContext = createContext({ speed: 1, scaleDuration: (ms) => ms, liveCamera: false, setLiveCamera: () => {} });

export function useSpeed() {
  return useContext(SpeedContext);
}

const SPEED_OPTIONS = [
  { label: "0.25x", value: 0.25 },
  { label: "0.5x",  value: 0.5 },
  { label: "1x",    value: 1 },
  { label: "2x",    value: 2 },
  { label: "4x",    value: 4 },
];

export function SpeedProvider({ children }) {
  const [speed, setSpeed] = useState(1);
  const [liveCamera, setLiveCamera] = useState(true);

  const scaleDuration = useCallback((ms) => Math.round(ms / speed), [speed]);

  // Scale all CSS custom-property durations by injecting inline style on wrapper
  const cssVarStyle = speed !== 1 ? {
    "--duration-exit":          `${Math.round(250 / speed)}ms`,
    "--duration-countdown-pop": `${Math.round(300 / speed)}ms`,
    "--duration-slide-up-in":   `${Math.round(250 / speed)}ms`,
    "--duration-btn-press":     `${Math.round(150 / speed)}ms`,
    "--duration-flash-punch":   `${Math.round(350 / speed)}ms`,
  } : undefined;

  return (
    <SpeedContext.Provider value={{ speed, scaleDuration, liveCamera, setLiveCamera }}>
      <div style={cssVarStyle} className="contents">
        {children}
        {/* Debug controls — fixed top corners */}
        <div className="fixed top-3 left-3 z-[9999]">
          <label className="flex items-center gap-1.5 bg-panel border border-white/10 text-foreground text-caption rounded-lg px-2 py-1.5 cursor-pointer select-none hover:border-white/20">
            <input
              type="checkbox"
              checked={liveCamera}
              onChange={(e) => setLiveCamera(e.target.checked)}
              className="accent-white"
            />
            Live Camera
          </label>
        </div>
        <div className="fixed top-3 right-3 z-[9999]">
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-panel border border-white/10 text-foreground text-caption rounded-lg px-2 py-1.5 cursor-pointer outline-none hover:border-white/20"
          >
            {SPEED_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </SpeedContext.Provider>
  );
}
