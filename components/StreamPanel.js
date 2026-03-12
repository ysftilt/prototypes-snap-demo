"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import GlassButton from "./GlassButton";
import SnapButton from "./SnapButton";
import { GearIcon, MicIcon } from "./icons";
import { viewfinder, flash as flashConfig, camera } from "@/config/design-config";
import { timing } from "@/config/animation-config";

function StreamPanel({ onSnap, footer, hideHeader, hideFooter, exiting, footerExiting, viewfinderActive, viewfinderDuration = 400, onViewfinderClick, flash, footerEntering, onFooterEntered, onReset, children }, ref) {
  const panelRef = useRef(null);
  const videoRef = useRef(null);
  const [insetY, setInsetY] = useState(0);
  const [hasWebcam, setHasWebcam] = useState(false);

  // Try to get webcam stream, fall back to video file on denial
  useEffect(() => {
    if (!camera.enabled) return;
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

  // Expose an async captureFrame method — uses toBlob to avoid blocking the main thread
  useImperativeHandle(ref, () => ({
    captureFrame() {
      const video = videoRef.current;
      const panel = panelRef.current;
      if (!video || !panel) return Promise.resolve(null);

      const { width: pw, height: ph } = panel.getBoundingClientRect();
      const side = Math.min(pw, ph - insetY * 2);
      const canvas = document.createElement("canvas");
      canvas.width = side;
      canvas.height = side;

      const vw = video.videoWidth || video.offsetWidth;
      const vh = video.videoHeight || video.offsetHeight;
      const scale = Math.max(pw / vw, ph / vh);
      const sx = (vw - pw / scale) / 2;
      const sy = (vh - ph / scale) / 2 + insetY / scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, sx, sy, side / scale, side / scale, 0, 0, side, side);

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob ? URL.createObjectURL(blob) : null),
          "image/jpeg",
          0.85,
        );
      });
    },
  }), [insetY]);

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
            <GlassButton className="w-10 h-10" onClick={onReset}>
              <GearIcon size={20} />
            </GlassButton>
            <GlassButton className="w-10 h-10">
              <MicIcon size={20} />
            </GlassButton>
          </div>
        </div>

        {/* Overlay content slot — used by StepTwo/Three */}
        {children}

        {/* Viewfinder + flash wrapper — single element gets flash-punch so scrim masks flash edges */}
        <div
          onClick={viewfinderActive ? onViewfinderClick : undefined}
          className={`absolute inset-0 z-10 ${flash ? "animate-flash-punch" : ""}`}
          style={{
            pointerEvents: viewfinderActive ? "auto" : "none",
            cursor: viewfinderActive ? "pointer" : "default",
          }}
        >
          {/* Viewfinder scrim */}
          <div
            style={{
              position: "absolute",
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
          {/* Camera flash */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: viewfinderActive ? `${insetY}px` : "0px",
              bottom: viewfinderActive ? `${insetY}px` : "0px",
              left: "0px",
              right: "0px",
              borderRadius: viewfinderActive ? `${viewfinder.borderRadius}px` : "0px",
              backgroundColor: `rgba(255, 255, 255, ${flashConfig.opacity})`,
              opacity: flash ? 1 : 0,
              transition: flash ? "none" : `opacity ${timing.flashDuration}ms var(--ease-out-cubic)`,
            }}
          />
        </div>

        {/* Footer — gradient + snap button */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Gradient overlay */}
          <div className="h-40 bg-linear-to-t from-[rgba(20,20,21,0.52)] to-transparent" />

          {/* Footer row — hidden entirely in step 3 */}
          {!hideFooter && (
            <div
              className={`absolute bottom-0 left-0 right-0 flex justify-center pb-5 transition-exit ${exiting || footerExiting ? "exit-down" : ""} ${footerEntering ? "animate-slide-up-in" : ""}`}
              onAnimationEnd={footerEntering ? onFooterEntered : undefined}
            >
              {footer ?? <SnapButton onSnap={onSnap} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(StreamPanel);
