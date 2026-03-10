"use client";

import { useState, useEffect, useCallback } from "react";
import flowConfig from "@/config/flow-config";
import { timing } from "@/config/animation-config";
import StreamPanel from "./StreamPanel";
import PromptBanner from "./PromptBanner";

// Viewfinder is already partially done when step 2 mounts (it started at handleSnap).
// Remaining viewfinder time after mount + configured delay after viewfinder reaches 1:1.
const COUNTDOWN_START_DELAY =
  (timing.viewfinderDuration - timing.exitDuration) + timing.countdownStartDelay;

export default function Flow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [exiting, setExiting] = useState(false);
  const [viewfinderActive, setViewfinderActive] = useState(false);

  // --- Step 2: countdown ---
  const step2Config = flowConfig.steps[1];
  const countdownStart = step2Config.countdownStart || 3;
  const [countdown, setCountdown] = useState(countdownStart);
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [ringDepleted, setRingDepleted] = useState(false);

  // Reset countdown when entering step 2; show after start delay
  useEffect(() => {
    if (currentStep === 2) {
      setCountdown(countdownStart);
      setCountdownVisible(false);
      setRingDepleted(false);
      const t = setTimeout(() => {
        setCountdownVisible(true);
        // Flip ringDepleted after a frame so the transition kicks in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setRingDepleted(true));
        });
      }, COUNTDOWN_START_DELAY);
      return () => clearTimeout(t);
    }
    setCountdownVisible(false);
    setRingDepleted(false);
  }, [currentStep, countdownStart]);

  // Countdown chain — starts ticking once visible
  useEffect(() => {
    if (currentStep !== 2 || !countdownVisible || countdown <= 0) return;

    const t = setTimeout(() => setCountdown((c) => c - 1), timing.countdownInterval);
    return () => clearTimeout(t);
  }, [currentStep, countdownVisible, countdown, countdownStart]);

  // --- Navigation ---
  const handleSnap = useCallback(() => {
    // Fire exit + viewfinder simultaneously
    setExiting(true);
    setViewfinderActive(true);

    // Mount step 2 content after exit animation finishes
    setTimeout(() => {
      setExiting(false);
      setCurrentStep(2);
    }, timing.exitDuration + timing.enterDelay);
  }, []);

  const [footerEntering, setFooterEntering] = useState(false);

  const handleBack = useCallback(() => {
    setViewfinderActive(false);
    setFooterEntering(true);
    setCurrentStep(1);
  }, []);

  const handleFinish = useCallback(() => {
    setCurrentStep(1);
  }, []);

  // --- Compute StreamPanel props per step ---
  const isStep1 = currentStep === 1;
  const isStep2 = currentStep === 2;
  const isStep3 = currentStep === 3;

  const banner = step2Config.promptBanner;
  const step3Config = flowConfig.steps[2];

  const footer = isStep2 ? (
    <PromptBanner
      title={banner?.title ?? "Talk, then Snap"}
      subtitle={banner?.subtitle ?? "Talking through details boosts accuracy."}
      delay={timing.bannerDelay}
    />
  ) : undefined;

  return (
    <StreamPanel
      onSnap={isStep1 ? handleSnap : isStep3 ? handleFinish : undefined}
      exiting={isStep1 && exiting}
      hideHeader={viewfinderActive}
      viewfinderActive={viewfinderActive}
      viewfinderDuration={timing.viewfinderDuration}
      onViewfinderClick={handleBack}
      footer={footer}
      footerEntering={footerEntering}
      onFooterEntered={() => setFooterEntering(false)}
    >
      {/* Step 2: countdown number + progress ring */}
      {isStep2 && countdownVisible && countdown > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none mix-blend-difference">
          {/* Progress ring — depletes over full countdown */}
          <svg
            className="absolute animate-countdown-pop"
            width="160"
            height="160"
            viewBox="0 0 160 160"
          >
            <g transform="rotate(-90 80 80)">
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={Math.PI * 2 * 68}
                style={{
                  strokeDashoffset: ringDepleted ? -(Math.PI * 2 * 68) : 0,
                  transition: ringDepleted
                    ? `stroke-dashoffset ${countdownStart * timing.countdownInterval}ms linear`
                    : "none",
                }}
              />
            </g>
          </svg>
          {/* Number */}
          <div key={countdown} className="animate-countdown-pop">
            <span className="text-[96px] leading-none font-[650] text-foreground tabular-nums">
              {countdown}
            </span>
          </div>
        </div>
      )}

      {/* Step 3: placeholder content */}
      {isStep3 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center px-8">
            <p className="text-[12px] leading-[16px] tracking-[0.08em] uppercase text-foreground-muted font-[650] mb-2">
              Step 3
            </p>
            <p className="text-[17px] leading-[24px] tracking-[-0.01em] font-[650]">
              {step3Config.title}
            </p>
          </div>
        </div>
      )}
    </StreamPanel>
  );
}
