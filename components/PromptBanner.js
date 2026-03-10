import { ChatIcon } from "./icons";

export default function PromptBanner({ title, subtitle, delay }) {
  return (
    <div
      className="animate-slide-up-in flex items-center gap-3 bg-glass backdrop-blur-xl rounded-[20px] p-3 mx-5 z-100"
      style={delay != null ? { "--delay": `${delay}ms` } : undefined}
    >
      {/* Icon circle */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/10 shrink-0">
        <ChatIcon size={18} />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-[17px] leading-[20px] tracking-[-0.01em] font-[650] text-foreground my-1">
          {title}
        </p>
        <p className="text-[15px] leading-[18px] tracking-[-0.01em] text-foreground-muted">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
