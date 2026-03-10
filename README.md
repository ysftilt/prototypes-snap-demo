# Snap Core Flow

A camera-based interaction prototype — tap Snap, see a 3-2-1 countdown with viewfinder, camera flash, then a prompt banner with live mic waveform. Built with Next.js 16 and Tailwind CSS v4.

## Features

- **Live webcam** with fallback to demo video on permission denial
- **Viewfinder** — 1:1 square cutout animates from full-frame
- **Countdown** — 3-2-1 with pop animation and progress ring
- **Camera flash** — white overlay on capture
- **Prompt banner** — glassmorphic card with animated red glow and live mic waveform (5-band FFT)

## Quick Start

```bash
pnpm install    # Install dependencies
pnpm dev        # Dev server → http://localhost:3000
pnpm build      # Production build
```

## Project Structure

```
app/
  globals.css           ← Design tokens (@theme), keyframes, easing curves
  layout.js             ← Root HTML shell
  page.js               ← Entry point → <Flow />

components/
  Flow.js               ← Step state machine, countdown logic, flash trigger
  StreamPanel.js        ← 9:16 panel — webcam, viewfinder, header, footer
  SnapButton.js         ← Split pill button (Snap + Filter)
  PromptBanner.js       ← Glass card with icon, text, mic waveform, red glow
  Waveform.js           ← 5-bar frequency visualizer
  GlassButton.js        ← Reusable glassmorphic button
  icons.js              ← SVG icon components

config/
  flow-config.js        ← Step content (titles, subtitles, countdown start)
  animation-config.js   ← All JS timing values (durations, delays, intervals)
  design-config.js      ← Visual constants (waveform, flash, banner, viewfinder)

hooks/
  useMicLevel.js        ← Mic → 5 frequency levels via Web Audio API
```

## How to Edit

| What | Where |
|---|---|
| Step text/labels | `config/flow-config.js` |
| Animation timing | `config/animation-config.js` + CSS vars in `globals.css` |
| Waveform, flash, glow, viewfinder | `config/design-config.js` |
| Colors, fonts, easing | `@theme` block in `app/globals.css` |
| Component layout | `components/*.js` |
