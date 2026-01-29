export const DEFAULT_FOCUS_DURATION = 1500;
export const DEFAULT_BREAK_DURATION = 300;

export const APP_NAME = "test-bmad";
export const APP_IDENTIFIER = "com.testbmad.app";

export const TIMER_EVENTS = {
  TICK: "TimerTick",
  COMPLETE: "SessionComplete",
  STATE_CHANGED: "TimerStateChanged",
} as const;

export const ACHIEVEMENT_EVENTS = {
  UNLOCKED: "AchievementUnlocked",
  STREAK_UPDATED: "StreakUpdated",
} as const;
