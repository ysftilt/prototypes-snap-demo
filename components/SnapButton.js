import { GavelIcon, FilterIcon } from "./icons";
import KeyShortcut from "./KeyShortcut";

export default function SnapButton({ onSnap }) {
  return (
    <div className="flex items-center gap-0.5">
      {/* Snap button */}
      <button
        onClick={onSnap}
        className="btn-press flex items-center gap-2 bg-glass backdrop-blur-xl rounded-l-[100px] rounded-r-none h-12 px-4 py-3 antialiased"
      >
        <GavelIcon size={20} />
        <span className="text-[17px] leading-body1 tracking-body1 font-[650] text-foreground whitespace-nowrap">
          Snap
        </span>
        <KeyShortcut label="S" />
      </button>

      {/* Filter button */}
      <button className="btn-press flex items-center justify-center bg-glass backdrop-blur-xl rounded-r-[100px] rounded-l-none w-12 h-12">
        <FilterIcon size={20} />
      </button>
    </div>
  );
}
