import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useStreakStore } from "../stores/streakStore";

interface StreakDataResponse {
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string | null;
}

interface StreakUpdatedPayload {
  currentStreak: number;
  longestStreak: number;
}

export function useStreak() {
  const { currentStreak, longestStreak, isMilestone, setStreak } =
    useStreakStore();

  useEffect(() => {
    invoke<StreakDataResponse>("get_streak_data_cmd")
      .then((data) => {
        setStreak(data.currentStreak, data.longestStreak);
      })
      .catch(console.error);

    const unlistenStreakUpdated = listen<StreakUpdatedPayload>(
      "StreakUpdated",
      (event) => {
        setStreak(event.payload.currentStreak, event.payload.longestStreak);
      }
    );

    return () => {
      unlistenStreakUpdated.then((fn) => fn());
    };
  }, [setStreak]);

  return { currentStreak, longestStreak, isMilestone };
}
