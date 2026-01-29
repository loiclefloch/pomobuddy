import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { useWeeklyData } from "./useWeeklyData";

describe("useWeeklyData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockWeeklyResponse = {
    days: [
      {
        date: "2026-01-23",
        dayName: "Fri",
        focusMinutes: 60,
        sessionCount: 2,
        isToday: false,
      },
      {
        date: "2026-01-24",
        dayName: "Sat",
        focusMinutes: 0,
        sessionCount: 0,
        isToday: false,
      },
      {
        date: "2026-01-25",
        dayName: "Sun",
        focusMinutes: 30,
        sessionCount: 1,
        isToday: false,
      },
      {
        date: "2026-01-26",
        dayName: "Mon",
        focusMinutes: 120,
        sessionCount: 4,
        isToday: false,
      },
      {
        date: "2026-01-27",
        dayName: "Tue",
        focusMinutes: 90,
        sessionCount: 3,
        isToday: false,
      },
      {
        date: "2026-01-28",
        dayName: "Wed",
        focusMinutes: 45,
        sessionCount: 2,
        isToday: false,
      },
      {
        date: "2026-01-29",
        dayName: "Thu",
        focusMinutes: 75,
        sessionCount: 3,
        isToday: true,
      },
    ],
    weeklyTotalMinutes: 420,
  };

  describe("data fetching", () => {
    it("fetches weekly stats on mount", async () => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);

      renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(invoke).toHaveBeenCalledWith("get_weekly_stats");
      });
    });

    it("returns days array from response", async () => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);

      const { result } = renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(result.current.days).toHaveLength(7);
      });

      expect(result.current.days[0].dayName).toBe("Fri");
      expect(result.current.days[6].dayName).toBe("Thu");
      expect(result.current.days[6].isToday).toBe(true);
    });

    it("returns weekly total minutes from response", async () => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);

      const { result } = renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(result.current.weeklyTotalMinutes).toBe(420);
      });
    });
  });

  describe("loading state", () => {
    it("returns isLoading true initially", () => {
      vi.mocked(invoke).mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useWeeklyData());

      expect(result.current.isLoading).toBe(true);
    });

    it("sets isLoading false after fetch completes", async () => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);

      const { result } = renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("error handling", () => {
    it("handles fetch errors gracefully", async () => {
      vi.mocked(invoke).mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.days).toEqual([]);
      expect(result.current.weeklyTotalMinutes).toBe(0);
    });
  });

  describe("empty state", () => {
    it("returns empty days when no data", async () => {
      vi.mocked(invoke).mockResolvedValue({
        days: [],
        weeklyTotalMinutes: 0,
      });

      const { result } = renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.days).toEqual([]);
      expect(result.current.weeklyTotalMinutes).toBe(0);
    });
  });

  describe("refresh capability", () => {
    it("provides refetch function", async () => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);

      const { result } = renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.refetch).toBe("function");
    });

    it("refetches data when refetch is called", async () => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);

      const { result } = renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(invoke).toHaveBeenCalledTimes(1);

      await act(async () => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(invoke).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("event listeners", () => {
    it("refetches on SessionComplete event", async () => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);

      const { listen } = await import("@tauri-apps/api/event");
      let sessionCompleteCallback: (() => void) | null = null;

      vi.mocked(listen).mockImplementation(async (event, callback) => {
        if (event === "SessionComplete") {
          sessionCompleteCallback = callback as () => void;
        }
        return () => {};
      });

      renderHook(() => useWeeklyData());

      await waitFor(() => {
        expect(invoke).toHaveBeenCalledTimes(1);
      });

      if (sessionCompleteCallback) {
        await act(async () => {
          sessionCompleteCallback!();
        });
      }

      await waitFor(() => {
        expect(invoke).toHaveBeenCalledTimes(2);
      });
    });
  });
});
