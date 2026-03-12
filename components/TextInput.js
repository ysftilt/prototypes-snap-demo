export default function TextInput({ label, value, onChange }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-1">
      <span className="text-[13px] leading-[20px] font-medium text-[#a3a0a7] px-1">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-panel-border/76 rounded-lg px-2 py-1.5 text-[13px] leading-[20px] font-medium text-foreground outline-none"
      />
    </div>
  );
}
