# Design Spec: Snap Core Flow

## Flow Overview

Three-step capture-to-listing flow inside a full-viewport `StreamPanel`. Each step shares the same camera feed background; UI layers animate in/out on top.

---

## Step 1 — Stream

- [x] Full-bleed camera feed (video element or webcam via `navigator.mediaDevices`)
- [x] Header: gear + mic glass buttons (top-right), `bg-glass backdrop-blur-xl`
- [x] Footer: `SnapButton` — split pill with Snap label + Filter icon
- [x] Tap Snap → button exits down (`exit-down`, 300ms), viewfinder shrinks to 1:1 square

### Transitions
- **Exit**: SnapButton slides down via `.exit-down` (300ms)
- **Viewfinder**: `viewfinderActive` triggers CSS `top`/`bottom` inset transition to 1:1 aspect (duration: `viewfinderDuration`)
- Step 2 mounts after `exitDuration + enterDelay`

---

## Step 2 — Countdown

- [x] Viewfinder holds 1:1 square frame, scrim overlay on letterboxed areas
- [x] Header hidden (`hideHeader` prop on StreamPanel)
- [x] Countdown 3→2→1 centered in viewfinder
  - Number: 96px, font-weight 650, `animate-countdown-pop`
  - Progress ring: SVG circle (r=68, stroke-width 8), depletes linearly over full countdown duration
- [x] `PromptBanner` slides up in footer (`animate-slide-up-in`, 300ms + delay)
  - Glass card with chat icon, title ("Talk about your product"), subtitle
- [x] Tap viewfinder → `handleBack` → viewfinder dismisses, return to step 1

### Transitions
- **Countdown start**: delayed by `(viewfinderDuration - exitDuration) + countdownStartDelay`
- **Ring depletion**: `stroke-dashoffset` transition, `countdownStart × countdownInterval` ms, linear
- **Flash**: countdown hits 0 → white flash overlay (`flashDuration` ms)
- **Footer exit**: simultaneous with flash — PromptBanner slides down via `.exit-down` (300ms)
- **Auto-advance**: after `step3Delay` ms → footer unmounts, transition to step 3

---

## Step 3 — Listing

- [x] Viewfinder dismisses (`setViewfinderActive(false)`) — animates back to full-bleed via CSS transition
- [x] Footer hidden entirely — no SnapButton reappears (`hideFooter` prop on StreamPanel)
- [x] `ListingForm` slides up from bottom (`animate-slide-up-in`) as standalone element
  - **ShortcutBanner**: glass pill with Tab / Enter / Esc keyboard hints
  - **ProductRow**: 72×72 product image + editable title field
  - **PricingRow**: 3-column layout — Size, Starting price, Reserve price
  - **CountdownBar**: gavel icon + progress bar + pause button

### Transitions
- **Footer exit**: already completed during step 2→3 flash (PromptBanner slid down via `footerExiting` → `exit-down`)
- **Viewfinder dismiss**: `top`/`bottom` animate from 1:1 inset back to `0px` (300ms, CSS transition)
- **Footer unmount**: `hideFooter` removes the footer row entirely — SnapButton does not reappear
- **ListingForm enter**: `animate-slide-up-in` (translateY 24px → 0, opacity 0 → 1, 300ms ease-out-cubic)

---

## Shared Design Tokens

| Token | Value |
|---|---|
| `--ease-out-cubic` | `cubic-bezier(.215, .61, .355, 1)` |
| Standard duration | 300ms |
| `--color-glass` | `rgba(255 255 255 / 0.12)` |
| `--color-scrim` | `rgba(0 0 0 / 0.6)` |
| Backdrop blur | `backdrop-blur-xl` (24px) |

## Component Hierarchy

```
page.js → Flow.js (owns currentStep, viewfinderActive, countdown, footerExiting state)
             └── StreamPanel.js (camera feed, viewfinder, header, footer slot)
                    ├── Step 1: SnapButton (footer)
                    ├── Step 2: Countdown overlay (children) + PromptBanner (footer)
                    └── Step 3: ListingForm (children), footer hidden
                           ├── ShortcutBanner
                           ├── ProductRow
                           ├── PricingRow
                           └── CountdownBar
```
