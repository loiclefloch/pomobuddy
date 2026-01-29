import { create } from "zustand";

interface StatsState {
  currentStreak: number;
  todaySessions: number;
  todayFocusMinutes: number;
  setStats: (stats: Partial<StatsState>) => void;
  incrementSession: (focusMinutes: number) => void;
  reset: () => void;
}

const initialState = {
  currentStreak: 0,
  todaySessions: 0,
  todayFocusMinutes: 0,
};

export const useStatsStore = create<StatsState>((set) => ({
  ...initialState,

  setStats: (stats) => set((state) => ({ ...state, ...stats })),

  incrementSession: (focusMinutes) =>
    set((state) => ({
      todaySessions: state.todaySessions + 1,
      todayFocusMinutes: state.todayFocusMinutes + focusMinutes,
    })),

  reset: () => set(initialState),
}));
