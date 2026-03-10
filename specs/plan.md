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
