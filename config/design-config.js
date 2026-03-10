/**
 * Central design configurables — visual constants pulled from components.
 * Edit here instead of hunting through component files.
 */

/** Waveform bar dimensions and opacity range */
export const waveform = {
  barWidth: 4,            // px — each bar's width (Tailwind w-1)
  barGap: 2,              // px — gap between bars
  restingHeights: [8, 8, 8, 8, 8],  // px — idle height per bar
  maxHeight: 48,          // px — fully-active bar height
  minOpacity: 0.20,       // lowest bar opacity (silence)
  maxOpacity: 0.90,       // highest bar opacity (loud)
};

/**
 * Mic frequency bands — bin ranges for a 256-point FFT at ~48kHz.
 * Each bin ≈ 187Hz. Five bands map to the five waveform bars.
 */
export const micBands = [
  [1, 4],   // ~187–750Hz   — voice fundamentals
  [5, 10],  // ~937–1875Hz  — lower formants
  [11, 20], // ~2062–3750Hz — upper formants
  [21, 35], // ~3937–6562Hz — presence/sibilance
  [36, 60], // ~6750–11250Hz — high harmonics/air
];

/** Camera flash overlay */
export const flash = {
  opacity: 0.5,           // white flash peak opacity
};

/** Prompt banner card */
export const banner = {
  height: 72,             // px — h-[72px]
  borderRadius: 20,       // px — rounded-[20px]
  glowOpacity: 0.40,      // glow-red overlay opacity
};

/** Camera — set to false to skip webcam and use fallback video */
export const camera = {
  enabled: true,
};

/** Viewfinder cutout */
export const viewfinder = {
  borderRadius: 24,       // px — rounded corners when active
  scrimColor: "rgba(20, 20, 21, 0.75)",
};
