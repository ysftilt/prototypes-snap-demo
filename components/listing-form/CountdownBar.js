"use client";

import { useState, useEffect, useRef } from "react";
import { PauseIcon, PlayIcon } from "../icons";
import { timing } from "@/config/animation-config";
import { iconTransition } from "@/config/design-config";

export default function CountdownBar({ text, paused = false }) {
  const duration = timing.countdownBarDuration;
  const [remaining, setRemaining] = useState(duration);
  const [started, setStarted] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const elapsedRef = useRef(0);      // ms elapsed within current tick
  const tickStartRef = useRef(null); // timestamp when current tick started
  const barRef = useRef(null);
  const trackRef = useRef(null);
  const [frozenPct, setFrozenPct] = useState(null); // exact bar % when paused

  // Manual toggle + hover-pause
  const effectivePaused = manualPaused || paused;

  // Reset manual pause when hover ends so it doesn't stick
  useEffect(() => {
    if (!paused) setManualPaused(false);
  }, [paused]);

  // Start after mount (let slide-up animation finish)
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), timing.countdownBarDelay);
    return () => clearTimeout(t);
  }, []);

  // Freeze/unfreeze bar — read actual computed position from DOM
  useEffect(() => {
    if (effectivePaused && barRef.current && trackRef.current) {
      // Snapshot elapsed time within current tick
      if (tickStartRef.current !== null) {
        elapsedRef.current += Date.now() - tickStartRef.current;
        tickStartRef.current = null;
      }
      // Read exact visual position from the DOM
      const barW = barRef.current.getBoundingClientRect().width;
      const trackW = trackRef.current.getBoundingClientRect().width;
      setFrozenPct(trackW > 0 ? (barW / trackW) * 100 : 0);
    } else if (!effectivePaused) {
      setFrozenPct(null);
    }
  }, [effectivePaused]);

  // Tick down — tracks partial progress so pause/resume is instant
  useEffect(() => {
    if (!started || remaining <= 1 || effectivePaused) return;

    const left = 1000 - elapsedRef.current;
    tickStartRef.current = Date.now();

    const t = setTimeout(() => {
      elapsedRef.current = 0;
      tickStartRef.current = null;
      setRemaining((r) => r - 1);
    }, left);

    return () => clearTimeout(t);
  }, [started, remaining, effectivePaused]);

  // When running: transition target is the end of the current tick
  const tickEndFraction = started ? Math.max(0, (remaining - 1 - 1) / (duration - 1)) : 1;
  const timeLeft = 1000 - elapsedRef.current;

  const finished = remaining <= 1;
  const label = finished ? "Auction starting now" : text.replace(/\d+s/, `${remaining}s`);

  const isPaused = frozenPct !== null;

  return (
    <div className="flex items-center gap-3 p-1">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">

          <span className="text-footnote font-medium text-foreground/76">
            {label}
          </span>
        </div>
        {/* Progress track */}
        <div ref={trackRef} className="h-1 rounded-[5px] bg-[#2b2a2c] overflow-hidden">
          <div
            ref={barRef}
            className="h-full rounded-[13px] bg-foreground"
            style={isPaused ? {
              width: `${frozenPct}%`,
              transition: "none",
            } : {
              width: `${tickEndFraction * 100}%`,
              transition: started ? `width ${timeLeft}ms linear` : "none",
            }}
          />
        </div>
      </div>

      {/* Pause/Play button */}
      <button
        className="countdown-btn shrink-0 flex items-center justify-center w-8 h-8 rounded-full relative"
        onClick={() => setManualPaused((p) => !p)}
      >
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: effectivePaused ? iconTransition.exitOpacity : iconTransition.enterOpacity,
            transform: `scale(${effectivePaused ? iconTransition.exitScale : iconTransition.enterScale})`,
            filter: `blur(${effectivePaused ? iconTransition.exitBlur : iconTransition.enterBlur}px)`,
            transition: `opacity ${iconTransition.duration}ms ${iconTransition.easing}, transform ${iconTransition.duration}ms ${iconTransition.easing}, filter ${iconTransition.duration}ms ${iconTransition.easing}`,
          }}
        >
          <PauseIcon size={20} />
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: effectivePaused ? iconTransition.enterOpacity : iconTransition.exitOpacity,
            transform: `scale(${effectivePaused ? iconTransition.enterScale : iconTransition.exitScale})`,
            filter: `blur(${effectivePaused ? iconTransition.enterBlur : iconTransition.exitBlur}px)`,
            transition: `opacity ${iconTransition.duration}ms ${iconTransition.easing}, transform ${iconTransition.duration}ms ${iconTransition.easing}, filter ${iconTransition.duration}ms ${iconTransition.easing}`,
          }}
        >
          <PlayIcon size={20} />
        </span>
      </button>
    </div>
  );
}
