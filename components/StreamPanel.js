"use client";

import GlassButton from "./GlassButton";
import SnapButton from "./SnapButton";
import { GearIcon, MicIcon } from "./icons";

export default function StreamPanel({ onSnap, footer, hideHeader, exiting, children }) {
  return (
    <div className="flex items-center justify-center w-screen h-dvh sm:p-6">
      {/* 9:16 panel — full bleed on mobile, phone-sized on desktop */}
      <div className="relative w-full h-full sm:max-w-[393px] sm:aspect-9/16 sm:h-auto sm:rounded-[48px] sm:border sm:border-panel-border bg-panel overflow-hidden">

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

        {/* Footer — gradient + snap button */}
        <div className={`absolute bottom-0 left-0 right-0 z-10 transition-exit ${exiting ? "exit-down" : ""}`}>
          {/* Gradient overlay */}
          <div className="h-40 bg-linear-to-t from-[rgba(20,20,21,0.52)] to-transparent" />

          {/* Footer row */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-5">
            {footer ?? <SnapButton onSnap={onSnap} />}
          </div>
        </div>
      </div>
    </div>
  );
}
