import { GavelIcon, FilterIcon } from "./icons";

export default function SnapButton({ onSnap }) {
  return (
    <div className="flex items-center gap-0.5">
      {/* Snap button */}
      <button
        onClick={onSnap}
        className="flex items-center gap-2 bg-glass backdrop-blur-[24px] rounded-l-[100px] rounded-r-none h-12 px-4 py-3 active:scale-95 transition-transform"
      >
        <GavelIcon size={20} />
        <span className="text-[17px] leading-[24px] tracking-[-0.17px] font-[650] text-foreground whitespace-nowrap">
          Snap
        </span>
        <span className="flex items-center justify-center bg-foreground-muted rounded-[6px] p-1">
          <span className="text-[12px] leading-[16px] tracking-[0.96px] uppercase font-[650] text-foreground">
            S
          </span>
        </span>
      </button>

      {/* Filter button */}
      <button className="flex items-center justify-center bg-glass backdrop-blur-[24px] rounded-r-[100px] rounded-l-none w-12 h-12 active:scale-95 transition-transform">
        <FilterIcon size={20} />
      </button>
    </div>
  );
}
