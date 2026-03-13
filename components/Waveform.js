/** Five-bar frequency waveform — driven by mic levels from useMicLevel. */
import { waveform as waveformDefaults } from "@/config/design-config";

export default function Waveform({ levels = [0, 0, 0, 0, 0], active, restingHeights: restingOverride, maxHeight: maxOverride }) {
  const { barWidth, barGap, minOpacity, maxOpacity } = waveformDefaults;
  const restingHeights = restingOverride ?? waveformDefaults.restingHeights;
  const maxHeight = maxOverride ?? waveformDefaults.maxHeight;

  return (
    <div className="flex items-center" style={{ gap: `${barGap}px` }}>
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
              transition: "height 20ms var(--ease-out-cubic), background-color 20ms var(--ease-out-cubic)",
            }}
          />
        );
      })}
    </div>
  );
}
