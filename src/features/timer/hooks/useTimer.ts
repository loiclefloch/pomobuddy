import { useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { useTimerStore } from "../stores/timerStore";
import type { TimerTickPayload, TimerState } from "../types";

interface SessionCompletePayload {
  sessionType: "focus" | "break";
  durationSeconds: number;
  completedAt: string;
}

export function useTimer() {
  const { status, remainingSeconds, setStatus, setRemainingSeconds, reset } =
    useTimerStore();

  useEffect(() => {
    let unlistenTick: UnlistenFn | null = null;
    let unlistenComplete: UnlistenFn | null = null;

    const setup = async () => {
      unlistenTick = await listen<TimerTickPayload>("TimerTick", (event) => {
        const store = useTimerStore.getState();
        store.setRemainingSeconds(event.payload.remaining);
        store.setStatus(event.payload.status);
      });

      unlistenComplete = await listen<SessionCompletePayload>(
        "SessionComplete",
        () => {
          useTimerStore.getState().reset();
        }
      );

      try {
        const state = await invoke<TimerState>("getTimerState");
        useTimerStore.getState().setStatus(state.status);
        useTimerStore.getState().setRemainingSeconds(state.remainingSeconds);
      } catch {}
    };

    setup();

    return () => {
      unlistenTick?.();
      unlistenComplete?.();
    };
  }, []);

  const start = useCallback(async () => {
    await invoke("startTimer");
  }, []);

  const pause = useCallback(async () => {
    await invoke("pauseTimer");
  }, []);

  const resume = useCallback(async () => {
    await invoke("resumeTimer");
  }, []);

  const stop = useCallback(async () => {
    await invoke("stopTimer");
    reset();
  }, [reset]);

  return {
    status,
    remainingSeconds,
    start,
    pause,
    resume,
    stop,
    setStatus,
    setRemainingSeconds,
  };
}
