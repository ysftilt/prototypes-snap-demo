# Plan: Scaffold snap-core-flow Prototype

## Steps

- [x] **Step 1**: Scaffold with Next.js 16 + Tailwind v4 + pnpm
- [x] **Step 2**: Verify build and dev server
- [x] **Step 3**: Create specs/commands.md
- [x] **Step 4**: Create config/flow-config.js with placeholder content
- [x] **Step 5**: Write app/globals.css with Tailwind v4 @theme tokens
- [x] **Step 6**: Write app/layout.js — root HTML shell
- [x] **Step 7**: Create components/Flow.js — flow controller with useState
- [x] **Step 8**: Create StepOne.js, StepTwo.js, StepThree.js — placeholder UI
- [x] **Step 9**: Write app/page.js — renders <Flow />
- [x] **Step 10**: Verify pnpm build passes
- [x] **Step 11**: Verify dev server runs and step navigation works
- [x] **Step 12**: Write README.md
- [x] **Step 13**: Update CLAUDE.md with project commands
- [x] **Step 14**: Populate specs/plan.md and specs/design.md
- [x] **Step 15**: Await Figma design → apply tokens and layout

---

# Plan: Build Stream Panel Base Screen from Figma

## Steps

- [x] **Step 1 — Font**: Download Aspekta 650 woff2 → `public/fonts/`, add `@font-face` in globals.css
- [x] **Step 2 — Tokens**: Replace `@theme` block in `globals.css` with Figma tokens, dark body background
- [x] **Step 3 — GlassButton**: Create reusable glassmorphic pill button component
- [x] **Step 4 — SnapButton**: Create split pill snap button (icon + "Snap" + shortcut badge | filter icon)
- [x] **Step 5 — StreamPanel**: Create main 9:16 panel with header buttons, footer gradient, snap button
- [x] **Step 6 — StepOne**: Rewrite to render `<StreamPanel onSnap={onNext} />`
- [x] **Step 7 — StepTwo/Three**: Update to render StreamPanel with placeholder overlay text
- [x] **Step 8 — Config**: Update flow-config.js for stream panel context
- [x] **Step 9 — Verify**: `pnpm build` passes ✓

## Review

All steps complete. Build passes clean. The Stream Panel base screen is implemented with:
- Aspekta 650 font loaded via `@font-face`
- Figma design tokens in Tailwind v4 `@theme` block
- Dark 9:16 panel with glassmorphic header controls and gradient footer
- Responsive: full-bleed mobile, centered phone-frame on desktop (`sm:` breakpoint)
- Snap button advances the flow; StepTwo/Three render overlays on the same panel

---

# Plan: Snap Countdown Overlay — Step 2

## Steps

- [x] **Step 1 — CSS Animations**: Add `countdown-pop`, `overlay-fade`, `slide-up-in` keyframes + utility classes
- [x] **Step 2 — ChatIcon**: Add speech bubble SVG to `icons.js`
- [x] **Step 3 — PromptBanner**: Create dark card component with icon + title/subtitle + slide-up animation
- [x] **Step 4 — StreamPanel footer prop**: Add optional `footer` prop that replaces SnapButton when provided
- [x] **Step 5 — StepTwo rewrite**: Viewfinder overlay with box-shadow cutout, countdown chain, click-to-dismiss
- [x] **Step 6 — Config**: Add `countdownStart` and `promptBanner` to step 2 config
- [x] **Step 7 — Verify**: `pnpm build` passes ✓

## Review

All steps complete. Build passes clean. Step 2 now shows:
- Dark overlay with 1:1 viewfinder window (shrinks from full-frame via CSS transition)
- 3-2-1 countdown with pop animation (chained setTimeout, key-based remount)
- Prompt banner ("Talk, then Snap") slides up at bottom
- Click anywhere dismisses back to Step 1
- Video continues playing through the transparent viewfinder cutout

---

# Plan: SnapButton → PromptBanner Morph Effect

## Steps

- [x] **Step 1 — FooterMorph component**: Create `FooterMorph.js` — single element that CSS-transitions between SnapButton (collapsed pill) and PromptBanner (wide card) states based on `morphed` prop
- [x] **Step 2 — Flow.js rewrite**: Lift StreamPanel to Flow.js, render FooterMorph as persistent footer, own `morphing`/`exiting` state, handle step transitions
- [x] **Step 3 — StepTwoOverlay**: Extract overlay-only content from StepTwo into StepTwoOverlay.js (viewfinder + countdown, no StreamPanel wrapper)
- [x] **Step 4 — StepThree simplify**: Remove StreamPanel wrapper, render overlay content only
- [x] **Step 5 — StreamPanel cleanup**: Remove `onSnap` prop and SnapButton fallback (footer always passed from Flow)
- [x] **Step 6 — Footer exit fix**: Remove exit-down animation from footer wrapper (footer stays mounted and morphs instead of sliding out)
- [x] **Step 7 — Verify**: `pnpm build` passes ✓

## Review

Morph effect implemented. The footer is now a persistent element that CSS-transitions between two visual states:
- **Collapsed** (Step 1): Pill-shaped SnapButton with GavelIcon, "Snap" text, badge, and filter button
- **Morphed** (Step 2+): Wide card with ChatIcon in circle, title + subtitle text
- Container transitions: width, border-radius, padding, gap (all 300ms ease-out-cubic)
- Content crossfade: icons and text blur-fade in/out (opacity + filter blur)
- Filter button collapses to 0 width with opacity fade
- Header still exits up, but footer stays in place and morphs

---

# Plan: Simultaneous Viewfinder Transition + Animation Config

## Steps

- [x] **Step 1 — animation-config.js**: Create `config/animation-config.js` — single source of truth for all JS timeout values
- [x] **Step 2 — CSS duration vars**: Add `--duration-*` custom properties to `@theme` block, reference them in animations/transitions
- [x] **Step 3 — Simultaneous viewfinder**: Lift `viewfinderActive` to own `useState(false)` in Flow.js, fire simultaneously with exit in `handleSnap`; `hideHeader` derives from `viewfinderActive`
- [x] **Step 4 — StreamPanel easing cleanup**: Replace hardcoded `cubic-bezier(.215,.61,.355,1)` with `var(--ease-out-cubic)`

## Review

All steps complete. Build passes clean. Changes:
- **Central config**: `config/animation-config.js` holds all JS timing values; Flow.js imports from it instead of local `TIMING` object
- **CSS vars**: `--duration-exit`, `--duration-countdown-pop`, `--duration-slide-up-in`, `--duration-btn-press` added to `@theme`; all CSS animations/transitions reference these vars
- **Simultaneous viewfinder**: `viewfinderActive` is now independent state — set in the same frame as `setExiting(true)` in `handleSnap`, so viewfinder shrinks at the same time buttons exit (no more 350ms sequential delay)
- **Header timing**: `hideHeader` now derives from `viewfinderActive` (not `isStep2`), so header exits simultaneously with viewfinder start
- **Easing cleanup**: StreamPanel viewfinder transition uses `var(--ease-out-cubic)` instead of inline cubic-bezier

---

# Plan: Waveform Mic Feedback in PromptBanner

## Steps

- [x] **Step 1 — useMicLevel hook**: Create `hooks/useMicLevel.js` — requests mic, creates AnalyserNode (fftSize 32), rAF loop reads 5 frequency bins normalized to 0–1
- [x] **Step 2 — Waveform component**: Create `components/Waveform.js` — 5 bars (4px wide, 2px gap, rounded-full, bg-foreground-muted), resting heights [6,10,12,4,6]px, scale to 24px max based on levels
- [x] **Step 3 — PromptBanner integration**: Add Waveform to right side of banner, wire useMicLevel via `active` prop, pass from Flow.js

## Review

All steps complete. Build passes clean. Changes:
- **hooks/useMicLevel.js**: Custom hook that requests mic access, creates AudioContext + AnalyserNode, reads 5 frequency bins in rAF loop. Gracefully returns zeros on permission denial. Full cleanup on unmount/deactivation.
- **components/Waveform.js**: 5 bars matching Figma spec — 4px wide, 2px gap, rounded-full, bg-foreground-muted. Heights interpolate between resting [6,10,12,4,6]px and 24px max based on mic levels. 100ms ease-out transition for smooth animation.
- **components/PromptBanner.js**: Added Waveform to right side after text column with ml-auto push. Calls useMicLevel internally with `active` prop.
- **components/Flow.js**: Passes `active={isStep2}` to PromptBanner so mic starts when Step 2 is active.

---

# Plan: Fix Waveform Frequency Mapping & Opacity

## Steps

- [x] **Step 1**: Fix fftSize 32→256 in useMicLevel.js, average bin ranges per bar for voice-relevant frequency bands
- [x] **Step 2**: Add per-bar opacity ramp [0.20, 0.25, 0.30, 0.40, 0.50] in Waveform.js, replace static bg-white/30

## Review

Build passes. Changes:
- **hooks/useMicLevel.js**: fftSize 256 (128 bins, ~187Hz each). 5 averaged bin ranges covering voice fundamentals through high harmonics.
- **components/Waveform.js**: Per-bar opacity via inline rgba() — right bars (higher pitch) are visibly brighter than left bars.

---

# Pre-Commit Cleanup: Audit & Documentation

## Steps

- [x] **Step 1 — Dead code**: Removed unused `ChatIcon` from icons.js
- [x] **Step 2 — Timing mismatch**: Set `exitDuration` to 300ms in animation-config.js (was 200, CSS was 300). Removed unused keys: `bannerDuration`, `countdownPopDuration`, `slideUpInDefaultDelay`
- [x] **Step 3 — design-config.js**: Created `config/design-config.js` — central file for waveform, mic bands, flash, banner, and viewfinder constants
- [x] **Step 4 — Wire up**: Waveform.js, useMicLevel.js, PromptBanner.js, StreamPanel.js, Flow.js all import from design-config/animation-config instead of magic numbers
- [x] **Step 5 — Comments**: Added header comments to Waveform.js and useMicLevel.js
- [x] **Step 6 — README**: Rewrote to cover current feature set, project structure (including new config files), and editing guide
- [x] **Step 7 — Verify**: `pnpm build` passes ✓

## Review

All cleanup complete. Build passes. Changes:
- **Dead code removed**: `ChatIcon` (unused export), `bannerDuration`/`countdownPopDuration`/`slideUpInDefaultDelay` (unused config keys)
- **Timing aligned**: `exitDuration` now 300ms in both JS config and CSS `--duration-exit`
- **Centralized design constants**: New `config/design-config.js` holds waveform, mic bands, flash, banner, and viewfinder values — all previously hardcoded across 5 files
- **`flashDuration`**: Moved from hardcoded `300` in Flow.js to `timing.flashDuration` in animation-config
- **README**: Rewritten to reflect current features (webcam, countdown, flash, waveform, glow) and full project structure

---

# Plan: Unify Animation Timings — Single Source of Truth

## Steps

- [x] **Step 1 — Restructure animation-config.js**: Split into `CSS_SYNCED` / `JS_ONLY` sections, export `CSS_DURATION_MAP`, fix `slideUpInDuration` 250→300
- [x] **Step 2 — Fix StreamPanel hardcoded duration**: Replace inline `"opacity 300ms ease-out"` with `timing.flashDuration`ms template literal
- [x] **Step 3 — Waveform comment**: Added note that 20ms micro-animation is intentionally not in config
- [x] **Step 4 — globals.css comments**: Updated `@theme` duration comment to reference `pnpm check:timing`
- [x] **Step 5 — Sync-check script**: Created `scripts/check-timing-sync.js` — reads CSS, compares to JS config, exits 1 on mismatch
- [x] **Step 6 — package.json**: Added `"check:timing"` script + `"type": "module"` for clean ESM execution

## Review

All steps complete. Build passes clean. `pnpm check:timing` passes (all 4 values match).

Changes:
- **animation-config.js**: Restructured into `CSS_SYNCED` (4 values with CSS counterparts) and `JS_ONLY` (7 values). Exports `CSS_DURATION_MAP` for automated checking. Fixed `slideUpInDuration` from 250→300 to match CSS.
- **StreamPanel.js**: Hardcoded `"opacity 300ms ease-out"` now uses `timing.flashDuration` from config.
- **Waveform.js**: Comment added on intentional 20ms micro-animation.
- **globals.css**: Duration section comment now points at JS config as source of truth + references `pnpm check:timing`.
- **scripts/check-timing-sync.js**: New script — regex-matches `--duration-*` declarations in CSS, compares to JS timing values, exits 1 on mismatch.
- **package.json**: Added `check:timing` script, `"type": "module"` for clean Node ESM.

---

# Plan: Step 3 Footer Exit Animation

## Steps

- [x] **Step 1 — footerExiting state**: Add `footerExiting` state in Flow.js, set `true` when countdown hits 0 (simultaneous with flash), reset on step 3 mount
- [x] **Step 2 — hideFooter prop**: Add `hideFooter` flag (true in step 3) so SnapButton doesn't reappear after PromptBanner exits
- [x] **Step 3 — StreamPanel wiring**: Accept `footerExiting` and `hideFooter` props; `footerExiting` triggers `exit-down` on footer row, `hideFooter` unmounts footer entirely

## Review

All steps complete. Build passes clean. The step 2→3 transition now:
1. Countdown hits 0 → flash fires + PromptBanner slides down (`exit-down`, 300ms)
2. After `step3Delay` → footer unmounts, viewfinder dismisses, ListingForm slides up standalone
3. No SnapButton reappears in step 3 — footer is fully hidden

---

# Fix: Step 2→3 Footer Re-Entry Bug

## Problem

`setFooterExiting(false)` fired at T+500ms (in t2 timer) while footer was still mounted until T+750ms (in t3 timer). During that 250ms gap, the footer lost its exit class and briefly slid back into view.

## Fix

- [x] Move `setFooterExiting(false)` from t2 timer into t3 timer (same tick as `setCurrentStep(3)`)

Footer now stays in exit-down state from T+0ms until unmount at T+750ms. No re-entry.

---

# Fix: Currency Prefix Protection & Countdown Pause on Hover

## Steps

- [x] **Fix 1 — TextInput prefix**: Re-added `prefix` prop rendering as static `<span>` in flex row; stripped `$` from config values since prefix is rendered separately
- [x] **Fix 2 — Countdown pause**: Added `paused` prop to `CountdownBar`; `ListingForm` tracks hover state on card div and passes it down
- [x] **Verify**: `pnpm build` passes ✓

## Review

Both fixes implemented. Build passes clean. Changes:
- **TextInput.js**: When `prefix` is provided, renders a non-editable `<span>` before the input in a flex wrapper — users cannot delete the `$` symbol
- **flow-config.js**: Pricing values changed from `"$220"`/`"$380"` to `"220"`/`"380"` (prefix rendered separately)
- **CountdownBar.js**: Accepts `paused` prop; skips tick setTimeout when true, resumes when false
- **ListingForm.js**: Added `"use client"` directive, `hovered` state via `onMouseEnter`/`onMouseLeave` on card div, passed as `paused` to CountdownBar

---

# Refactor: Streamline Animation Orchestration

## Steps

- [x] **Step 1 — Restructure animation-config.js**: Replace `CSS_SYNCED`/`JS_ONLY` split with `base` (tuning knobs), `transitions` (timeline objects for each state change), `constants` (rarely-changed values). Backward-compat `timing` flat export kept temporarily.
- [x] **Step 2 — Fix CSS ↔ JS mismatches**: Added `--duration-flash-punch: 300ms` to globals.css, updated `animate-flash-punch` to use it. Removed unused `@keyframes stagger-in` and `@utility animate-stagger-in`.
- [x] **Step 3 — Refactor Flow.js orchestration**: Added `scheduleTransition(timeline, handlers)` helper. `handleSnap` and countdown-zero effect now read timeline offsets directly instead of nested setTimeouts. Replaced hardcoded `filter 400ms` with `base.morph`.
- [x] **Step 4 — Remove magic numbers from components**: ListingForm uses `base.morph` and `constants.staggerDelay`. CountdownBar uses `base.iconCrossfade` instead of `iconTransition.duration`. MorphImage and StreamPanel use `base.*` directly.
- [x] **Step 5 — Update check-timing-sync.js**: Reads from `base` instead of `timing`, checks all 5 CSS-synced values including new `flashPunch`.
- [x] **Step 6 — Verify**: `pnpm check:timing` passes (5/5 in sync), `pnpm build` passes clean.

## Review

All animation timing now flows from a single config with clear structure:
- **`base`**: 9 tuning knobs (the only values you tweak)
- **`transitions`**: 3 timeline objects (read top-to-bottom to see full choreography)
- **`constants`**: 4 rarely-changed values
- **`CSS_DURATION_MAP`**: 5 entries (was 4, added `flashPunch`)

Flow.js orchestration uses `scheduleTransition()` — flat timeline + handler map replaces nested setTimeout chains. No more magic numbers in components.
