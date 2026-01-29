import { create } from "zustand";

const MILESTONE_DAYS = [7, 14, 30];

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  isMilestone: boolean;
  setStreak: (current: number, longest: number) => void;
  reset: () => void;
}

const initialState = {
  currentStreak: 0,
  longestStreak: 0,
};

export const useStreakStore = create<StreakState>((set) => ({
  ...initialState,
  isMilestone: false,

  setStreak: (current, longest) =>
    set({
      currentStreak: current,
      longestStreak: longest,
      isMilestone: MILESTONE_DAYS.includes(current),
    }),

  reset: () => set({ ...initialState, isMilestone: false }),
}));
