"use client";

import { useState, useEffect } from "react";
import StreamPanel from "./StreamPanel";
import PromptBanner from "./PromptBanner";

export default function StepTwo({ config, onNext, onBack }) {
  const start = config.countdownStart || 3;
  const [countdown, setCountdown] = useState(start);
  const [entered, setEntered] = useState(false);

  // Trigger viewfinder shrink shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Countdown chain — starts after viewfinder settles
  useEffect(() => {
    if (countdown <= 0) return;

    const delay = countdown === start ? 500 : 1000;
    const t = setTimeout(() => setCountdown((c) => c - 1), delay);
    return () => clearTimeout(t);
  }, [countdown, start]);

  const banner = config.promptBanner;

  const footer = (
    <PromptBanner
      title={banner?.title ?? "Talk, then Snap"}
      subtitle={banner?.subtitle ?? "Talking through details boosts accuracy."}
    />
  );

  return (
    <StreamPanel footer={footer} hideHeader>
      {/* Full overlay — click anywhere to dismiss */}
      <div
        onClick={onBack}
        className="absolute inset-0 z-10 cursor-pointer animate-overlay-fade"
      >
        {/* Viewfinder cutout */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative aspect-square"
            style={{
              width: "100%",
              borderRadius: entered ? "24px" : "0px",
              boxShadow: entered
                ? "0 0 0 9999px rgba(20, 20, 21, 0.75)"
                : "0 0 0 9999px rgba(20, 20, 21, 0)",
              transition:
                "border-radius 400ms cubic-bezier(.215,.61,.355,1), box-shadow 400ms cubic-bezier(.215,.61,.355,1)",
            }}
          >
            {/* Countdown number */}
            {countdown > 0 && (
              <div
                key={countdown}
                className="absolute inset-0 flex items-center justify-center animate-countdown-pop"
              >
                <span className="text-[96px] leading-none font-[650] text-foreground tabular-nums">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </StreamPanel>
  );
}
