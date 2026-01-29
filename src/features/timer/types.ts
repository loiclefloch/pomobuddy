export type TimerStatus = "idle" | "focus" | "break" | "paused";

export interface TimerState {
  status: TimerStatus;
  remainingSeconds: number;
  sessionStartTime: number | null;
}

export interface TimerTickPayload {
  remaining: number;
  status: TimerStatus;
}

export interface SessionData {
  startTime: string;
  endTime: string;
  duration: number;
  type: "focus" | "break";
  completed: boolean;
}
