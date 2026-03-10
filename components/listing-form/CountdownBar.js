import { GavelIcon, PauseIcon } from "../icons";

export default function CountdownBar({ text, progress = 0 }) {
  return (
    <div className="flex items-center gap-3 px-3 pb-3 pt-2">
      {/* Gavel icon */}
      <div className="shrink-0 text-foreground-secondary">
        <GavelIcon size={16} />
      </div>

      {/* Text + progress bar */}
      <div className="flex-1 flex flex-col gap-2">
        <span className="text-[13px] leading-none text-foreground-secondary">
          {text}
        </span>
        {/* Progress track */}
        <div className="h-1 rounded-full bg-panel overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Pause button */}
      <button className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-panel text-foreground-secondary">
        <PauseIcon size={14} />
      </button>
    </div>
  );
}
