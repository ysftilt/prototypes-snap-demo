"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import flowConfig from "@/config/flow-config";
import { timing } from "@/config/animation-config";
import StreamPanel from "./StreamPanel";
import PromptBanner from "./PromptBanner";
import ListingForm from "./listing-form/ListingForm";

// Viewfinder is already partially done when step 2 mounts (it started at handleSnap).
// Remaining viewfinder time after mount + configured delay after viewfinder reaches 1:1.
const COUNTDOWN_START_DELAY =
  (timing.viewfinderDuration - timing.exitDuration) + timing.countdownStartDelay;

export default function Flow() {
  const streamRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [exiting, setExiting] = useState(false);
  const [viewfinderActive, setViewfinderActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

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

  // Flash when countdown reaches 0, exit footer, then transition to step 3
  const [footerExiting, setFooterExiting] = useState(false);

  useEffect(() => {
    if (currentStep === 2 && countdownVisible && countdown === 0) {
      // Kick off async capture — doesn't block the transition
      streamRef.current?.captureFrame().then((url) => {
        if (url) setCapturedImage(url);
      });

      setFlash(true);
      // Start footer exit animation alongside flash
      setFooterExiting(true);
      const t1 = setTimeout(() => setFlash(false), timing.flashDuration);
      const t2 = setTimeout(() => {
        setViewfinderActive(false);
        setFooterExiting(false);
        setCurrentStep(3);
      }, timing.step3Delay);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [currentStep, countdownVisible, countdown]);

  // --- Navigation ---
  const handleSnap = useCallback(() => {
    // Brief pause so the :active scale registers before transition
    setTimeout(() => {
      // Fire exit + viewfinder simultaneously
      setExiting(true);
      setViewfinderActive(true);

      // Mount step 2 content after exit animation finishes
      setTimeout(() => {
        setExiting(false);
        setCurrentStep(2);
      }, timing.exitDuration + timing.enterDelay);
    }, timing.snapReleaseDelay);
  }, []);

  const [flash, setFlash] = useState(false);
  const [footerEntering, setFooterEntering] = useState(false);

  const handleBack = useCallback(() => {
    setViewfinderActive(false);
    setFooterEntering(true);
    setCurrentStep(1);
  }, []);

  const handleFinish = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setExiting(false);
    setViewfinderActive(false);
    setCapturedImage(null);
    setCountdown(countdownStart);
    setCountdownVisible(false);
    setRingDepleted(false);
    setFooterExiting(false);
    setFlash(false);
    setFooterEntering(false);
  }, [countdownStart]);

  // --- Compute StreamPanel props per step ---
  const isStep1 = currentStep === 1;
  const isStep2 = currentStep === 2;
  const isStep3 = currentStep === 3;

  const banner = step2Config.promptBanner;
  const step3Config = flowConfig.steps[2];

  // Step 1: default SnapButton (via fallback in StreamPanel)
  // Step 2: PromptBanner replaces SnapButton
  // Step 3: no footer — ListingForm is standalone
  const footer = isStep2 ? (
    <PromptBanner
      title={banner?.title ?? "Talk, then Snap"}
      subtitle={banner?.subtitle ?? "Talking through details boosts accuracy."}
      delay={timing.bannerDelay}
      active={isStep2}
    />
  ) : undefined;

  const hideFooter = isStep3;

  return (
    <StreamPanel
      ref={streamRef}
      onSnap={isStep1 ? handleSnap : isStep3 ? handleFinish : undefined}
      exiting={isStep1 && exiting}
      footerExiting={footerExiting}
      hideHeader={viewfinderActive}
      hideFooter={hideFooter}
      viewfinderActive={viewfinderActive}
      viewfinderDuration={timing.viewfinderDuration}
      onViewfinderClick={handleBack}
      flash={flash}
      footer={footer}
      footerEntering={footerEntering}
      onFooterEntered={() => setFooterEntering(false)}
      onReset={handleReset}
    >
      {/* Step 2: countdown number + progress ring */}
      {isStep2 && countdownVisible && countdown > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none ">
          {/* Progress ring — depletes over full countdown, glows on last tick */}
          <svg
            className="absolute animate-countdown-pop"
            width="160"
            height="160"
            viewBox="0 0 160 160"
            style={{
              filter: countdown === 1
                ? "drop-shadow(0 0 12px rgba(255, 255, 255, 0.5))"
                : "drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
              transition: "filter 400ms var(--ease-out-cubic)",
            }}
          >
            <g transform="rotate(-90 80 80)">
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke="white"
                strokeWidth="8"
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

      {/* Step 3: listing form */}
      {isStep3 && step3Config.listingForm && (
        <ListingForm config={step3Config.listingForm} capturedImage={capturedImage} />
      )}
    </StreamPanel>
  );
}
