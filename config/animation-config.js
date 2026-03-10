/**
 * Central animation timing config.
 * CSS duration vars in globals.css must stay in sync.
 */
export const timing = {
  exitDuration: 300,            // button exit-up / exit-down (synced with --duration-exit)
  viewfinderDuration: 300,      // viewfinder inset transition
  bannerDelay: 50,              // banner appears after viewfinder starts
  countdownInterval: 1000,      // between countdown numbers
  countdownStartDelay: 100,     // ms after viewfinder reaches 1:1 before first number
  slideUpInDuration: 300,       // slide-up-in keyframe
  btnPressDuration: 150,        // hover/active feedback
  enterDelay: 0,                // pause after exit before step 2 content mounts
  flashDuration: 300,           // camera flash fade-out
};
