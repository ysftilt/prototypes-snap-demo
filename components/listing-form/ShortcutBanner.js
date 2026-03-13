import { Fragment } from "react";
import KeyShortcut from "../KeyShortcut";

const ROW_HEIGHT = 40;

export default function ShortcutBanner({ shortcuts = [], paused = false }) {
  return (
    <div className="inline-flex bg-page rounded-full mb-1" style={{ height: ROW_HEIGHT, overflow: "hidden" }}>
      <div
        style={{
          transform: paused ? `translateY(-${ROW_HEIGHT}px)` : "translateY(0)",
          transition: "transform 200ms var(--ease-out-cubic)",
        }}
      >
        {/* Row 1: shortcuts */}
        <div className="flex items-center gap-0 px-1 py-1" style={{ height: ROW_HEIGHT }}>
          {shortcuts.map(({ key, label }, i) => (
            <Fragment key={i}>
              <span className="flex items-center gap-2 text-[14px] leading-none pl-3 pr-2 py-1 rounded-full transition-colors duration-150 hover:bg-white/10">
                {label}
                <KeyShortcut label={key} />
              </span>
            </Fragment>
          ))}
        </div>
        {/* Row 2: paused text */}
        <div
          className="flex items-center justify-center px-4 text-[14px] leading-none text-white/50"
          style={{ height: ROW_HEIGHT }}
        >
          Countdown paused on hover
        </div>
      </div>
    </div>
  );
}
