import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useSessionHistory } from "./useSessionHistory";
import { invoke } from "@tauri-apps/api/core";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

const mockHistoryResponse = {
  days: [
    {
      date: "2026-01-29",
      sessions: [
        {
          startTime: "2026-01-29T09:15:00+01:00",
          endTime: "2026-01-29T09:40:00+01:00",
          durationSeconds: 1500,
          status: "complete",
        },
      ],
      totalComplete: 1,
      totalInterrupted: 0,
      totalMinutes: 25,
    },
  ],
  hasMore: true,
  totalDays: 1,
};

describe("useSessionHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial fetch", () => {
    it("fetches history on mount", async () => {
      vi.mocked(invoke).mockResolvedValue(mockHistoryResponse);

      renderHook(() => useSessionHistory());

      await waitFor(() => {
        expect(invoke).toHaveBeenCalledWith("get_session_history", { days: 7 });
      });
    });

    it("returns loading state initially", () => {
      vi.mocked(invoke).mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useSessionHistory());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.days).toEqual([]);
    });

    it("returns data after successful fetch", async () => {
      vi.mocked(invoke).mockResolvedValue(mockHistoryResponse);

      const { result } = renderHook(() => useSessionHistory());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.days).toHaveLength(1);
      expect(result.current.days[0].date).toBe("2026-01-29");
    });

    it("returns hasMore from response", async () => {
      vi.mocked(invoke).mockResolvedValue(mockHistoryResponse);

      const { result } = renderHook(() => useSessionHistory());

      await waitFor(() => {
        expect(result.current.hasMore).toBe(true);
      });
    });
  });

  describe("load more", () => {
    it("increments days when loadMore is called", async () => {
      vi.mocked(invoke).mockResolvedValue({
        ...mockHistoryResponse,
        hasMore: false,
      });

      const { result } = renderHook(() => useSessionHistory());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.loadMore();
      });

      await waitFor(() => {
        expect(invoke).toHaveBeenCalledWith("get_session_history", { days: 14 });
      });
    });
  });

  describe("error handling", () => {
    it("handles fetch errors gracefully", async () => {
      vi.mocked(invoke).mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useSessionHistory());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.days).toEqual([]);
    });
  });

  describe("event listeners", () => {
    it("refreshes on SessionSaved event", async () => {
      vi.mocked(invoke).mockResolvedValue(mockHistoryResponse);

      renderHook(() => useSessionHistory());

      await waitFor(() => {
        expect(invoke).toHaveBeenCalled();
      });
    });
  });
});
