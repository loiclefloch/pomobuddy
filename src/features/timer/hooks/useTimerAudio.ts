import { useEffect, useRef } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { useAudio } from "@/shared/hooks/useAudio";
import { useSoundEffects } from "@/shared/hooks/useSoundEffects";
import { useTimerStore } from "../stores/timerStore";

interface SessionCompletePayload {
  sessionType: "focus" | "break";
  durationSeconds: number;
  completedAt: string;
}

export function useTimerAudio() {
  const { playAmbient, stopAmbient } = useAudio();
  const { playSessionStart, playSessionComplete, playBreakComplete } = useSoundEffects();
  const prevStatus = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = useTimerStore.subscribe((state) => {
      const currentStatus = state.status;
      const prev = prevStatus.current;

      if (prev !== currentStatus) {
        if (currentStatus === "focus" && prev !== "paused") {
          playSessionStart();
          playAmbient();
        } else if (currentStatus === "idle" && prev !== null) {
          stopAmbient();
        } else if (currentStatus === "break") {
          stopAmbient();
        }
        prevStatus.current = currentStatus;
      }
    });

    return unsubscribe;
  }, [playAmbient, stopAmbient, playSessionStart]);

  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    const setup = async () => {
      unlisten = await listen<SessionCompletePayload>("SessionComplete", (event) => {
        if (event.payload.sessionType === "focus") {
          playSessionComplete();
        } else if (event.payload.sessionType === "break") {
          playBreakComplete();
        }
      });
    };

    setup();

    return () => {
      unlisten?.();
    };
  }, [playSessionComplete, playBreakComplete]);
}
