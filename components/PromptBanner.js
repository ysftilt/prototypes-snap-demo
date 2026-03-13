import { TalkIcon } from "./icons";
import { banner } from "@/config/design-config";

export default function PromptBanner({ title, subtitle, delay }) {
  return (
    <div
      className="animate-slide-up-in relative overflow-hidden flex items-center gap-2 bg-glass backdrop-blur-xl p-4 mx-5 w-full z-100 border-white/10 border"
      style={{
        height: `${banner.height}px`,
        borderRadius: `${banner.borderRadius}px`,
        ...(delay != null ? { "--delay": `${delay}ms` } : {}),
      }}
    >
      {/* Icon circle */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shrink-0">
        <TalkIcon size={22} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex flex-col gap-2 grow">
        <p className="text-[17px] leading-none tracking-body2 font-[650] text-foreground">
          {title}
        </p>
        <p className="text-[15px] leading-none text-foreground-secondary">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
