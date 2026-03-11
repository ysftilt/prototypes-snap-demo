export default function KeyShortcut({ label }) {
  return (
    <span className="flex items-center justify-center bg-white/10 rounded-[6px] p-1">
      <span className="text-[10px] leading-caption tracking-[0.96px] uppercase font-[650] text-foreground px-0.5">
        {label}
      </span>
    </span>
  );
}
