import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useStatsStore } from "../stores/statsStore";

interface QuickStatsResponse {
  currentStreak: number;
  todaySessions: number;
  todayFocusMinutes: number;
}

interface SessionSavedPayload {
  sessionType: string;
  status: string;
  durationSeconds: number;
  completeCount: number;
  partialCount: number;
  totalFocusMinutes: number;
}

export function useQuickStats() {
  const { currentStreak, todaySessions, todayFocusMinutes, setStats } =
    useStatsStore();

  useEffect(() => {
    invoke<QuickStatsResponse>("get_quick_stats")
      .then((stats) => {
        setStats({
          currentStreak: stats.currentStreak,
          todaySessions: stats.todaySessions,
          todayFocusMinutes: stats.todayFocusMinutes,
        });
      })
      .catch(console.error);

    const unlistenSessionSaved = listen<SessionSavedPayload>(
      "SessionSaved",
      (event) => {
        const payload = event.payload;
        setStats({
          todaySessions: payload.completeCount + payload.partialCount,
          todayFocusMinutes: payload.totalFocusMinutes,
        });
      }
    );

    const unlistenSessionComplete = listen("SessionComplete", () => {
      invoke<QuickStatsResponse>("get_quick_stats")
        .then((stats) => {
          setStats({
            currentStreak: stats.currentStreak,
            todaySessions: stats.todaySessions,
            todayFocusMinutes: stats.todayFocusMinutes,
          });
        })
        .catch(console.error);
    });

    return () => {
      unlistenSessionSaved.then((fn) => fn());
      unlistenSessionComplete.then((fn) => fn());
    };
  }, [setStats]);

  return { currentStreak, todaySessions, todayFocusMinutes };
}
