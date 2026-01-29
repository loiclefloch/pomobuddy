import { create } from "zustand";
import type { TimerStatus } from "../types";

interface TimerStoreState {
  status: TimerStatus;
  remainingSeconds: number;
  setStatus: (status: TimerStatus) => void;
  setRemainingSeconds: (seconds: number) => void;
  tick: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerStoreState>((set) => ({
  status: "idle",
  remainingSeconds: 0,

  setStatus: (status) => set({ status }),

  setRemainingSeconds: (seconds) =>
    set({ remainingSeconds: Math.max(0, seconds) }),

  tick: () =>
    set((state) => ({
      remainingSeconds: Math.max(0, state.remainingSeconds - 1),
    })),

  reset: () => set({ status: "idle", remainingSeconds: 0 }),
}));

export const selectIsBreak = (state: TimerStoreState) => state.status === "break";
export const selectIsFocus = (state: TimerStoreState) => state.status === "focus";
export const selectIsActive = (state: TimerStoreState) =>
  state.status === "focus" || state.status === "break";
export const selectIsRunning = (state: TimerStoreState) =>
  state.status === "focus" || state.status === "break" || state.status === "paused";
