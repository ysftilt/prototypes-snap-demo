export default function ShortcutBanner({ shortcuts = [] }) {
  return (
    <div className="flex items-center justify-center gap-4 bg-[rgba(20,20,21,0.76)] backdrop-blur-[12px] rounded-t-2xl px-4 py-2.5">
      {shortcuts.map(({ key, label }, i) => (
        <span key={i} className="flex items-center gap-1.5 text-[13px] leading-none text-foreground-secondary">
          <kbd className="text-foreground font-[650]">{key}</kbd>
          {label}
        </span>
      ))}
    </div>
  );
}
