import { TalkIcon } from "./icons";
import Waveform from "./Waveform";
import useMicLevel from "../hooks/useMicLevel";
import { banner } from "@/config/design-config";

export default function PromptBanner({ title, subtitle, delay, active }) {
  const levels = useMicLevel(active);

  return (
    <div
      className="animate-slide-up-in relative overflow-hidden flex items-center gap-2 bg-glass backdrop-blur-xl p-4 mx-5 w-full z-100 border-white/10 border"
      style={{
        height: `${banner.height}px`,
        borderRadius: `${banner.borderRadius}px`,
        ...(delay != null ? { "--delay": `${delay}ms` } : {}),
      }}
    >
      {/* Red glow — color-dodge overlay */}
      <div
        className="glow-red absolute inset-0 pointer-events-none mix-blend-color-dodge"
        style={{
          borderRadius: `${banner.borderRadius}px`,
          opacity: banner.glowOpacity,
        }}
      />
      {/* Icon circle */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shrink-0">
        <TalkIcon size={22} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex flex-col gap-2 grow">
        <p className="text-[17px] leading-none tracking-[-0.15px] font-[650] text-foreground">
          {title}
        </p>
        <p className="text-[15px] leading-none text-foreground-secondary">
          {subtitle}
        </p>
      </div>

      {/* Waveform */}
      <Waveform levels={levels} active={active} />
    </div>
  );
}
