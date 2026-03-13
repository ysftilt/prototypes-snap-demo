import { MicIcon } from "./icons";
import Waveform from "./Waveform";
import { listeningTag } from "@/config/design-config";

const { restingHeights, maxHeight } = listeningTag.waveform;

export default function ListeningTag({ levels, active }) {
  return (
    <div
      className="absolute z-30 flex items-center gap-1.5 h-8 px-2 pr-3 rounded-full backdrop-blur-xl"
      style={{
        top: "23px",
        left: "23px",
        backgroundColor: "rgba(35, 35, 36, 0.76)",
      }}
    >
      <MicIcon size={16} />
      <span className="text-[13px] leading-none font-[650] text-foreground">
        Listening
      </span>
      <Waveform
        levels={levels}
        active={active}
        restingHeights={restingHeights}
        maxHeight={maxHeight}
      />
    </div>
  );
}
