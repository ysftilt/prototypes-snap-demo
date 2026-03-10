"use client";

import { useState, useEffect, useRef } from "react";
import GlassButton from "./GlassButton";
import SnapButton from "./SnapButton";
import { GearIcon, MicIcon } from "./icons";

export default function StreamPanel({ onSnap, footer, hideHeader, exiting, viewfinderActive, viewfinderDuration = 400, onViewfinderClick, footerEntering, onFooterEntered, children }) {
  const panelRef = useRef(null);
  const [insetY, setInsetY] = useState(0);

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
      <div ref={panelRef} className="relative w-full h-full sm:max-w-[640px] sm:aspect-9/16 sm:h-auto sm:rounded-[48px] sm:border sm:border-panel-border bg-panel overflow-hidden">

        {/* Live video feed */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/live-video-demo.mp4"
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
              borderRadius: viewfinderActive ? "24px" : "0px",
              boxShadow: "0 0 0 9999px rgba(20, 20, 21, 0.75)",
              transition:
                `top ${viewfinderDuration}ms var(--ease-out-cubic), bottom ${viewfinderDuration}ms var(--ease-out-cubic), border-radius ${viewfinderDuration}ms var(--ease-out-cubic)`,
            }}
          />
        </div>

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
