import { useEffect, useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export interface DayStats {
  date: string;
  dayName: string;
  focusMinutes: number;
  sessionCount: number;
  isToday: boolean;
}

interface WeeklyStatsResponse {
  days: DayStats[];
  weeklyTotalMinutes: number;
}

interface UseWeeklyDataReturn {
  days: DayStats[];
  weeklyTotalMinutes: number;
  isLoading: boolean;
  refetch: () => void;
}

export function useWeeklyData(): UseWeeklyDataReturn {
  const [days, setDays] = useState<DayStats[]>([]);
  const [weeklyTotalMinutes, setWeeklyTotalMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeeklyStats = useCallback(async () => {
    try {
      const response = await invoke<WeeklyStatsResponse>("get_weekly_stats");
      setDays(response.days);
      setWeeklyTotalMinutes(response.weeklyTotalMinutes);
    } catch (error) {
      console.error("Failed to fetch weekly stats:", error);
      setDays([]);
      setWeeklyTotalMinutes(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeklyStats();

    const unlistenSessionComplete = listen("SessionComplete", () => {
      fetchWeeklyStats();
    });

    const unlistenSessionSaved = listen("SessionSaved", () => {
      fetchWeeklyStats();
    });

    return () => {
      unlistenSessionComplete.then((fn) => fn());
      unlistenSessionSaved.then((fn) => fn());
    };
  }, [fetchWeeklyStats]);

  return {
    days,
    weeklyTotalMinutes,
    isLoading,
    refetch: fetchWeeklyStats,
  };
}
