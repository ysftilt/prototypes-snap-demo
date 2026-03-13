"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import flowConfig from "@/config/flow-config";
import { base, transitions, constants } from "@/config/animation-config";
import StreamPanel from "./StreamPanel";
import PromptBanner from "./PromptBanner";
import ListeningTag from "./ListeningTag";
import ListingForm from "./listing-form/ListingForm";
import MorphImage from "./MorphImage";
import useMicLevel from "../hooks/useMicLevel";
import { useSpeed } from "./debug/SpeedContext";

/**
 * Schedule a batch of callbacks at the offsets defined in a timeline object.
 * Offset-0 handlers fire synchronously (critical for React state batching).
 * `scale` transforms every delay (e.g. for debug playback speed).
 * Returns a cleanup function that clears all pending timers.
 */
function scheduleTransition(timeline, handlers, scale = (ms) => ms) {
  const timers = [];
  for (const [key, at] of Object.entries(timeline)) {
    if (!handlers[key]) continue;
    if (at === 0) {
      handlers[key]();
    } else {
      timers.push(setTimeout(handlers[key], scale(at)));
    }
  }
  return () => timers.forEach(clearTimeout);
}

// Countdown start delay: time from mountStep2 to countdownStart
const COUNTDOWN_START_DELAY =
  transitions.idleToCapture.countdownStart - transitions.idleToCapture.mountStep2;

export default function Flow() {
  const { scaleDuration } = useSpeed();
  const streamRef = useRef(null);
  const productImageRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [exiting, setExiting] = useState(false);
  const [viewfinderActive, setViewfinderActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [morphActive, setMorphActive] = useState(false);
  const [morphImageVisible, setMorphImageVisible] = useState(true);

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
      }, scaleDuration(COUNTDOWN_START_DELAY));
      return () => clearTimeout(t);
    }
    setCountdownVisible(false);
    setRingDepleted(false);
  }, [currentStep, countdownStart]);

  // Countdown chain — starts ticking once visible
  useEffect(() => {
    if (currentStep !== 2 || !countdownVisible || countdown <= 0) return;

    const t = setTimeout(() => setCountdown((c) => c - 1), scaleDuration(constants.countdownInterval));
    return () => clearTimeout(t);
  }, [currentStep, countdownVisible, countdown, countdownStart]);

  // Flash when countdown reaches 0, exit footer, then transition to step 3
  const [footerExiting, setFooterExiting] = useState(false);

  // Refs to coordinate async capture with deterministic timeline.
  // The morph image + form slide-up must start at the same moment — so
  // mountStep3 is gated on capture completion, not just a timeline offset.
  const captureReadyRef = useRef(false);
  const step3PendingRef = useRef(false);

  const mountStep3Now = useCallback(() => {
    setFlash(false);
    setFooterExiting(false);
    setViewfinderActive(false);
    setCurrentStep(3);
  }, []);

  useEffect(() => {
    if (currentStep === 2 && countdownVisible && countdown === 0) {
      captureReadyRef.current = false;
      step3PendingRef.current = false;

      // Kick off async capture — when ready, activate morph + hide real thumbnail
      streamRef.current?.captureFrame().then((url) => {
        if (url) {
          setCapturedImage(url);
          setMorphActive(true);
          setMorphImageVisible(false);
        }
        captureReadyRef.current = true;
        // If the timeline already tried to mount step 3, do it now
        if (step3PendingRef.current) {
          mountStep3Now();
        }
      });

      const cleanup = scheduleTransition(transitions.captureToListing, {
        flashStart:         () => { setFlash(true); setFooterExiting(true); },
        flashEnd:           () => { setFlash(false); },
        mountStep3:         () => {
          if (captureReadyRef.current) {
            mountStep3Now();
          } else {
            // Capture still pending — defer step 3 until it resolves
            step3PendingRef.current = true;
          }
        },
      }, scaleDuration);
      return cleanup;
    }
  }, [currentStep, countdownVisible, countdown, mountStep3Now]);

  // --- Navigation ---
  const handleSnap = useCallback(() => {
    const cleanup = scheduleTransition(transitions.idleToCapture, {
      exitStart:   () => { setExiting(true); setViewfinderActive(true); },
      mountStep2:  () => { setExiting(false); setCurrentStep(2); },
    }, scaleDuration);
    // Store cleanup ref for potential teardown (not strictly needed for snap)
    return cleanup;
  }, []);

  const [flash, setFlash] = useState(false);
  const [footerEntering, setFooterEntering] = useState(false);

  const handleBack = useCallback(() => {
    setViewfinderActive(false);
    setFooterEntering(true);
    setCurrentStep(1);
  }, []);

  const [listingDismissing, setListingDismissing] = useState(false);

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
    setMorphActive(false);
    setMorphImageVisible(true);
    setListingDismissing(false);
  }, [countdownStart]);

  const handleCountdownComplete = useCallback(() => {
    setListingDismissing(true);
    setTimeout(() => {
      handleReset();
      setFooterEntering(true);
    }, scaleDuration(base.exit));
  }, [handleReset, scaleDuration]);

  const getStartRect = useCallback(() => {
    return streamRef.current?.getViewfinderRect() ?? null;
  }, []);

  const handleMorphComplete = useCallback(() => {
    setMorphActive(false);
    setMorphImageVisible(true);
  }, []);

  // --- Compute StreamPanel props per step ---
  const isStep1 = currentStep === 1;
  const isStep2 = currentStep === 2;
  const isStep3 = currentStep === 3;

  // Mic levels — always active, drives ListeningTag waveform in every step
  const micLevels = useMicLevel(true);

  const banner = step2Config.promptBanner;
  const step3Config = flowConfig.steps[2];

  // Step 1: default SnapButton (via fallback in StreamPanel)
  // Step 2: PromptBanner replaces SnapButton
  // Step 3: no footer — ListingForm is standalone
  const bannerDelay = transitions.idleToCapture.bannerAppear - transitions.idleToCapture.mountStep2;
  const footer = isStep2 ? (
    <PromptBanner
      title={banner?.title ?? "Talk, then Snap"}
      subtitle={banner?.subtitle ?? "Talking through details boosts accuracy."}
      delay={scaleDuration(bannerDelay)}
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
      viewfinderDuration={scaleDuration(base.viewfinder)}
      onViewfinderClick={handleBack}
      flash={flash}
      capturedImage={capturedImage}
      footer={footer}
      footerEntering={footerEntering}
      onFooterEntered={() => setFooterEntering(false)}
      onReset={handleReset}
      listeningTag={<ListeningTag levels={micLevels} active />}
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
              transition: `filter ${scaleDuration(base.morph)}ms var(--ease-out-cubic)`,
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
                    ? `stroke-dashoffset ${countdownStart * scaleDuration(constants.countdownInterval)}ms linear`
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
        <ListingForm config={step3Config.listingForm} capturedImage={capturedImage} productImageRef={productImageRef} imageVisible={morphImageVisible} onCountdownComplete={handleCountdownComplete} dismissing={listingDismissing} />
      )}

      {/* Photo morph — floating image from viewfinder to thumbnail */}
      {morphActive && capturedImage && (
        <MorphImage
          src={capturedImage}
          getStartRect={getStartRect}
          endRef={productImageRef}
          onComplete={handleMorphComplete}
        />
      )}
    </StreamPanel>
  );
}
