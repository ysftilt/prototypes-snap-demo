/**
 * Central animation timing config.
 * CSS duration vars in globals.css must stay in sync.
 */
export const timing = {
  exitDuration: 200,          // button exit-up / exit-down
  viewfinderDuration: 300,    // viewfinder inset transition
  bannerDelay: 100,           // banner appears after viewfinder starts
  bannerDuration: 300,        // slide-up-in animation length
  countdownPopDuration: 500,  // countdown number pop
  countdownInterval: 1000,    // between countdown numbers
  countdownStartDelay: 100,   // ms after viewfinder reaches 1:1 before first number
  slideUpInDuration: 300,     // slide-up-in keyframe
  slideUpInDefaultDelay: 100, // default delay for slide-up-in
  btnPressDuration: 150,      // hover/active feedback
  enterDelay: 0,              // pause after exit before step 2 content mounts
};
