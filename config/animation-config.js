/**
 * Central animation timing config — single source of truth.
 *
 * CSS_SYNCED values must match the --duration-* vars in globals.css @theme.
 * Run `pnpm check:timing` to verify they're in sync.
 */

// --- CSS-synced durations (must match globals.css @theme --duration-* vars) ---
const CSS_SYNCED = {
  exitDuration:         250,  // → --duration-exit: 300ms
  countdownPopDuration: 300,  // → --duration-countdown-pop: 300ms
  slideUpInDuration:    250,  // → --duration-slide-up-in: 300ms
  btnPressDuration:     150,  // → --duration-btn-press: 150ms
};

// --- JS-only durations (no CSS counterpart) ---
const JS_ONLY = {
  viewfinderDuration:  250,   // viewfinder inset transition
  bannerDelay:          50,   // banner appears after viewfinder starts
  countdownInterval:  1000,   // between countdown numbers
  countdownStartDelay: 100,   // ms after viewfinder reaches 1:1 before first number
  enterDelay:            0,   // pause after exit before step 2 content mounts
  flashDuration:       300,   // camera flash fade-out
  step3Delay:          500,   // flash duration + breathing room before listing form mounts
};

export const timing = { ...CSS_SYNCED, ...JS_ONLY };

/** Maps JS key → CSS custom property name, for sync checking. */
export const CSS_DURATION_MAP = {
  exitDuration:         '--duration-exit',
  countdownPopDuration: '--duration-countdown-pop',
  slideUpInDuration:    '--duration-slide-up-in',
  btnPressDuration:     '--duration-btn-press',
};
