export default function KeyShortcut({ label }) {
  return (
    <span className="flex items-center justify-center bg-white/5 rounded-[6px] p-1">
      <span className="text-[10px] leading-caption tracking-[0.96px] uppercase font-[650] text-foreground/56 px-0.5">
        {label}
      </span>
    </span>
  );
}
