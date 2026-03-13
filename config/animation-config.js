/**
 * Central animation timing config — single source of truth.
 *
 * `base` durations are the tuning knobs.
 * `transitions` are ordered timelines for each state change — read top-to-bottom.
 * CSS_SYNCED values must match the --duration-* vars in globals.css @theme.
 * Run `pnpm check:timing` to verify they're in sync.
 */

// --- Base durations — the only values you tune ---
export const base = {
  exit:           250,   // header/footer exit-up/exit-down (CSS synced)
  viewfinder:     250,   // viewfinder inset contraction
  countdownPop:   300,   // countdown number entrance (CSS synced)
  flashHold:      250,   // how long flash stays at full white
  flashFade:      200,   // how long flash takes to fade out
  flashPunch:     350,   // flash-punch scale pulse (CSS synced)
  morph:          350,   // photo morph viewfinder → thumbnail
  slideUpIn:      250,   // slide-up entrance default (CSS synced)
  btnPress:       150,   // button hover/active scale (CSS synced)
  iconCrossfade:  150,   // pause/play icon crossfade
};

// --- Transition timelines — read top-to-bottom to see full choreography ---
export const transitions = {
  idleToCapture: {
    snapRelease:      80,                                    // button release beat
    exitStart:        80,                                    // footer+header begin exit
    viewfinderStart:  80,                                    // viewfinder contracts (simultaneous)
    mountStep2:       80 + base.exit,                        // step 2 content appears
    bannerAppear:     80 + base.exit + 50,                   // PromptBanner slides up
    countdownStart:   80 + (base.viewfinder - base.exit) + base.exit + 100,
  },

  // Morph activation is gated on capture completion + form mount, not a
  // timeline offset. See captureReadyRef / step3PendingRef in Flow.js.
  captureToListing: {
    flashStart:        0,                                          // flash on + footer exit begin
    flashEnd:          base.flashHold,                             // flash begins fade-out
    mountStep3:        base.flashHold + base.viewfinder,           // form mounts (gated on capture ready)
    dismissViewfinder: base.flashHold + base.viewfinder,           // scrim fades as morph image flies
  },

  listingToIdle: {
    viewfinderExpand: 0,                       // viewfinder back to full
    footerReenter:    0,                       // SnapButton slides back up
  },
};

// --- Constants (not derived from base, rarely change) ---
export const constants = {
  countdownInterval:    1000,  // ms between countdown ticks
  countdownBarDuration: 5,     // seconds for listing countdown bar
  staggerDelay:         200,   // ShortcutBanner stagger offset
  countdownBarDelay:    400,   // delay before bar starts depleting
};

// --- Backward-compat flat export (temporary — remove once all consumers migrate) ---
export const timing = {
  ...base,
  // Legacy aliases for any remaining consumers
  exitDuration:         base.exit,
  countdownPopDuration: base.countdownPop,
  slideUpInDuration:    base.slideUpIn,
  btnPressDuration:     base.btnPress,
  viewfinderDuration:   base.viewfinder,
  bannerDelay:          transitions.idleToCapture.bannerAppear - transitions.idleToCapture.mountStep2,
  countdownInterval:    constants.countdownInterval,
  flashDuration:        base.flashFade,
  snapReleaseDelay:     transitions.idleToCapture.snapRelease,
  countdownBarDuration: constants.countdownBarDuration,
  countdownBarDelay:    constants.countdownBarDelay,
  morphDuration:        base.morph,
};

/** Maps JS key → CSS custom property name, for sync checking. */
export const CSS_DURATION_MAP = {
  exit:           '--duration-exit',
  countdownPop:   '--duration-countdown-pop',
  slideUpIn:      '--duration-slide-up-in',
  btnPress:       '--duration-btn-press',
  flashPunch:     '--duration-flash-punch',
};
