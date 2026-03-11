import { GavelIcon, PauseIcon } from "../icons";

export default function CountdownBar({ text, progress = 0 }) {
  return (
    <div className="flex items-center gap-3 p-1">
      {/* Gavel icon + text + progress */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <div className="shrink-0 text-foreground-secondary">
            <GavelIcon size={16} />
          </div>
          <span className="text-footnote font-[500] text-foreground/76">
            {text}
          </span>
        </div>
        {/* Progress track */}
        <div className="h-1 rounded-[5px] bg-[#2b2a2c] overflow-hidden">
          <div
            className="h-full rounded-[13px] bg-foreground"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Pause button */}
      <button className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full">
        <PauseIcon size={20} />
      </button>
    </div>
  );
}
