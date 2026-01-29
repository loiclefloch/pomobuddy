import { useEffect, useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { DayHistory } from "../components/SessionHistory";

interface SessionHistoryResponse {
  days: DayHistory[];
  hasMore: boolean;
  totalDays: number;
}

interface UseSessionHistoryReturn {
  days: DayHistory[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

const DAYS_PER_PAGE = 7;

export function useSessionHistory(): UseSessionHistoryReturn {
  const [days, setDays] = useState<DayHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [daysToFetch, setDaysToFetch] = useState(DAYS_PER_PAGE);

  const fetchHistory = useCallback(async (numDays: number) => {
    setIsLoading(true);
    try {
      const response = await invoke<SessionHistoryResponse>("get_session_history", {
        days: numDays,
      });
      setDays(response.days);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Failed to fetch session history:", error);
      setDays([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    const newDays = daysToFetch + DAYS_PER_PAGE;
    setDaysToFetch(newDays);
    fetchHistory(newDays);
  }, [daysToFetch, fetchHistory]);

  const refresh = useCallback(() => {
    fetchHistory(daysToFetch);
  }, [daysToFetch, fetchHistory]);

  useEffect(() => {
    fetchHistory(daysToFetch);

    const unlistenSessionSaved = listen("SessionSaved", () => {
      fetchHistory(daysToFetch);
    });

    const unlistenSessionComplete = listen("SessionComplete", () => {
      fetchHistory(daysToFetch);
    });

    return () => {
      unlistenSessionSaved.then((fn) => fn());
      unlistenSessionComplete.then((fn) => fn());
    };
  }, [fetchHistory, daysToFetch]);

  return {
    days,
    isLoading,
    hasMore,
    loadMore,
    refresh,
  };
}
