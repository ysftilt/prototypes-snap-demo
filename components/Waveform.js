/** Five-bar frequency waveform — driven by mic levels from useMicLevel. */
import { waveform } from "@/config/design-config";

const { barWidth, restingHeights, maxHeight, minOpacity, maxOpacity } = waveform;

export default function Waveform({ levels = [0, 0, 0, 0, 0], active }) {
  return (
    <div className="flex items-center" style={{ gap: `${waveform.barGap}px` }}>
      {restingHeights.map((rest, i) => {
        const base = levels[i] > 0 ? rest : barWidth;
        const h = active
          ? base + (maxHeight - base) * levels[i]
          : rest;
        return (
          <div
            key={i}
            className="w-1 rounded-full"
            style={{
              height: `${h}px`,
              backgroundColor: `rgba(255, 255, 255, ${minOpacity + (maxOpacity - minOpacity) * levels[i]})`,
              // 20ms micro-animation — intentionally not in animation-config (frame-rate-coupled, not design-tunable)
              transition: "height 20ms ease-out, background-color 20ms ease-out",
            }}
          />
        );
      })}
    </div>
  );
}
