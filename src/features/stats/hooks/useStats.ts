import { useEffect, useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface TodayStatsResponse {
  completedCount: number;
  interruptedCount: number;
  totalFocusMinutes: number;
}

interface UseStatsReturn {
  sessionsToday: number;
  focusTimeToday: number;
  completedCount: number;
  interruptedCount: number;
}

export function useStats(): UseStatsReturn {
  const [completedCount, setCompletedCount] = useState(0);
  const [interruptedCount, setInterruptedCount] = useState(0);
  const [focusTimeToday, setFocusTimeToday] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const stats = await invoke<TodayStatsResponse>("get_today_stats");
      setCompletedCount(stats.completedCount);
      setInterruptedCount(stats.interruptedCount);
      setFocusTimeToday(stats.totalFocusMinutes);
    } catch (error) {
      console.error("Failed to fetch today stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const unlistenSessionSaved = listen("SessionSaved", () => {
      fetchStats();
    });

    const unlistenSessionComplete = listen("SessionComplete", () => {
      fetchStats();
    });

    return () => {
      unlistenSessionSaved.then((fn) => fn());
      unlistenSessionComplete.then((fn) => fn());
    };
  }, [fetchStats]);

  return {
    sessionsToday: completedCount + interruptedCount,
    focusTimeToday,
    completedCount,
    interruptedCount,
  };
}
