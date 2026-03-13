"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import GlassButton from "./GlassButton";
import SnapButton from "./SnapButton";
import { GearIcon, MicIcon } from "./icons";
import { viewfinder } from "@/config/design-config";
import { base } from "@/config/animation-config";
import { useSpeed } from "./debug/SpeedContext";

function StreamPanel({ onSnap, footer, hideHeader, hideFooter, exiting, footerExiting, viewfinderActive, viewfinderDuration = 400, onViewfinderClick, flash, capturedImage, footerEntering, onFooterEntered, onReset, listeningTag, children }, ref) {
  const { scaleDuration, liveCamera } = useSpeed();
  const panelRef = useRef(null);
  const videoRef = useRef(null);
  const [insetY, setInsetY] = useState(0);
  const [hasWebcam, setHasWebcam] = useState(false);

  // Try to get webcam stream, fall back to video file on denial
  useEffect(() => {
    if (!liveCamera) return;
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
  }, [liveCamera]);

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
    getViewfinderRect() {
      const panel = panelRef.current;
      if (!panel) return null;
      const r = panel.getBoundingClientRect();
      const side = Math.min(r.width, r.height - insetY * 2);
      return {
        top: r.top + insetY,
        left: r.left + (r.width - side) / 2,
        width: side,
        height: side,
      };
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

        {/* Listening tag — always visible, top-left */}
        {listeningTag}

        {/* Overlay content slot — used by StepTwo/Three */}
        {children}

        {/* Viewfinder — scrim + captured photo + flash */}
        <div
          onClick={viewfinderActive ? onViewfinderClick : undefined}
          className={`absolute inset-0 z-10 ${flash ? "animate-flash-punch" : ""}`}
          style={{
            pointerEvents: viewfinderActive ? "auto" : "none",
            cursor: viewfinderActive ? "pointer" : "default",
          }}
        >
          {/* Scrim — darkened overlay outside the viewfinder cutout */}
          <div
            style={{
              position: "absolute",
              top: viewfinderActive ? `${insetY}px` : "0px",
              bottom: viewfinderActive ? `${insetY}px` : "0px",
              left: "0px",
              right: "0px",
              borderRadius: viewfinderActive ? `${viewfinder.borderRadius}px` : "0px",
              boxShadow: `0 0 0 9999px ${viewfinder.scrimColor}`,
              opacity: viewfinderActive ? 1 : 0,
              transition:
                `top ${viewfinderDuration}ms var(--ease-out-cubic), bottom ${viewfinderDuration}ms var(--ease-out-cubic), border-radius ${viewfinderDuration}ms var(--ease-out-cubic), opacity ${viewfinderDuration / 2}ms var(--ease-out-cubic)`,
            }}
          />

          {/* Captured photo — visible only while viewfinder is up, fades in underneath flash */}
          {capturedImage && viewfinderActive && (
            <img
              src={capturedImage}
              alt=""
              className="pointer-events-none"
              style={{
                position: "absolute",
                top: `${insetY}px`,
                bottom: `${insetY}px`,
                left: "0px",
                right: "0px",
                borderRadius: `${viewfinder.borderRadius}px`,
                objectFit: "cover",
                width: "100%",
                height: `calc(100% - ${insetY * 2}px)`,
              }}
            />
          )}

          {/* Flash — white overlay inside viewfinder, fades out to reveal photo */}
          <div
            className="pointer-events-none"
            style={{
              position: "absolute",
              top: `${insetY}px`,
              bottom: `${insetY}px`,
              left: "0px",
              right: "0px",
              borderRadius: `${viewfinder.borderRadius}px`,
              backgroundColor: "white",
              opacity: flash ? 1 : 0,
              transition: flash ? "none" : `opacity ${scaleDuration(base.flashFade)}ms var(--ease-out-cubic)`,
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
