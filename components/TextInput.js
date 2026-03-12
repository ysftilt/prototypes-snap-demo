export default function TextInput({ label, showLabel = true, value, onChange, multiline = false, prefix }) {
  const sharedClass = "flex-1 text-input rounded-lg px-2 py-1.5 text-[13px] leading-[20px] font-medium text-foreground outline-none";

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-1">
      {showLabel && label && (
        <span className="text-[13px] leading-[20px] font-medium text-[#a3a0a7] px-1">
          {label}
        </span>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`${sharedClass} resize-none`}
        />
      ) : prefix ? (
        <div className="flex items-center text-input rounded-lg">
          <span className="pl-2 text-[13px] leading-[20px] font-medium text-foreground select-none pointer-events-none">
            {prefix}
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="flex-1 bg-transparent pl-0 pr-2 py-1.5 text-[13px] leading-[20px] font-medium text-foreground outline-none"
          />
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={sharedClass}
        />
      )}
    </div>
  );
}
