"use client";

import { useState, useEffect, useRef } from "react";
import GlassButton from "./GlassButton";
import SnapButton from "./SnapButton";
import { GearIcon, MicIcon } from "./icons";
import { viewfinder, flash as flashConfig } from "@/config/design-config";

export default function StreamPanel({ onSnap, footer, hideHeader, exiting, viewfinderActive, viewfinderDuration = 400, onViewfinderClick, flash, footerEntering, onFooterEntered, children }) {
  const panelRef = useRef(null);
  const videoRef = useRef(null);
  const [insetY, setInsetY] = useState(0);
  const [hasWebcam, setHasWebcam] = useState(false);
  // Try to get webcam stream, fall back to video file on denial
  useEffect(() => {
    let cancelled = false;
    let stream;

    async function initWebcam() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasWebcam(true);
      } catch {
        // Permission denied or no camera — keep fallback video
      }
    }

    initWebcam();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Measure panel and compute vertical inset for 1:1 square cutout
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setInsetY(Math.max(0, (height - width) / 2));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-dvh sm:p-6">
      {/* 9:16 panel — full bleed on mobile, phone-sized on desktop */}
      <div ref={panelRef} className="relative w-full h-full sm:max-w-[480px] sm:aspect-9/16 sm:h-auto sm:rounded-[48px] sm:border sm:border-panel-border bg-panel overflow-hidden">

        {/* Live video feed — webcam if available, fallback to demo video */}
        <video
          ref={videoRef}
          autoPlay
          loop={!hasWebcam}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={hasWebcam ? undefined : "/video/live-video-demo.mp4"}
        />

        {/* Header — top-right controls, stacked vertically */}
        <div className={`absolute top-0 left-0 right-0 z-10 flex items-start justify-end p-5 transition-exit ${exiting || hideHeader ? "exit-up" : ""}`}>
          <div className="flex flex-col gap-3 items-end">
            <GlassButton className="w-10 h-10">
              <GearIcon size={20} />
            </GlassButton>
            <GlassButton className="w-10 h-10">
              <MicIcon size={20} />
            </GlassButton>
          </div>
        </div>

        {/* Overlay content slot — used by StepTwo/Three */}
        {children}

        {/* Viewfinder overlay — always in DOM, controlled by viewfinderActive */}
        <div
          onClick={viewfinderActive ? onViewfinderClick : undefined}
          className="absolute inset-0 z-10"
          style={{
            pointerEvents: viewfinderActive ? "auto" : "none",
            cursor: viewfinderActive ? "pointer" : "default",
          }}
        >
          <div
            className="absolute"
            style={{
              top: viewfinderActive ? `${insetY}px` : "0px",
              bottom: viewfinderActive ? `${insetY}px` : "0px",
              left: "0px",
              right: "0px",
              borderRadius: viewfinderActive ? `${viewfinder.borderRadius}px` : "0px",
              boxShadow: `0 0 0 9999px ${viewfinder.scrimColor}`,
              transition:
                `top ${viewfinderDuration}ms var(--ease-out-cubic), bottom ${viewfinderDuration}ms var(--ease-out-cubic), border-radius ${viewfinderDuration}ms var(--ease-out-cubic)`,
            }}
          />
        </div>

        {/* Camera flash — covers viewfinder area */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            top: viewfinderActive ? `${insetY}px` : "0px",
            bottom: viewfinderActive ? `${insetY}px` : "0px",
            left: "0px",
            right: "0px",
            borderRadius: viewfinderActive ? `${viewfinder.borderRadius}px` : "0px",
            backgroundColor: `rgba(255, 255, 255, ${flashConfig.opacity})`,
            opacity: flash ? 1 : 0,
            transition: flash ? "none" : "opacity 300ms ease-out",
          }}
        />

        {/* Footer — gradient + snap button */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Gradient overlay */}
          <div className="h-40 bg-linear-to-t from-[rgba(20,20,21,0.52)] to-transparent" />

          {/* Footer row */}
          <div
            className={`absolute bottom-0 left-0 right-0 flex justify-center pb-5 transition-exit ${exiting ? "exit-down" : ""} ${footerEntering ? "animate-slide-up-in" : ""}`}
            onAnimationEnd={footerEntering ? onFooterEntered : undefined}
          >
            {footer ?? <SnapButton onSnap={onSnap} />}
          </div>
        </div>
      </div>
    </div>
  );
}
