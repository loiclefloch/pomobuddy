import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useStreak } from "./useStreak";
import { useStreakStore } from "../stores/streakStore";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

describe("useStreak", () => {
  const mockInvoke = vi.mocked(invoke);
  const mockListen = vi.mocked(listen);

  beforeEach(() => {
    useStreakStore.setState({
      currentStreak: 0,
      longestStreak: 0,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial data fetch", () => {
    it("fetches streak data on mount", async () => {
      mockInvoke.mockResolvedValue({
        currentStreak: 5,
        longestStreak: 12,
        lastStreakDate: "2026-01-29",
      });
      mockListen.mockResolvedValue(() => {});

      const { result } = renderHook(() => useStreak());

      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalledWith("get_streak_data_cmd");
      });

      await waitFor(() => {
        expect(result.current.currentStreak).toBe(5);
        expect(result.current.longestStreak).toBe(12);
      });
    });

    it("handles fetch error gracefully", async () => {
      mockInvoke.mockRejectedValue(new Error("Network error"));
      mockListen.mockResolvedValue(() => {});

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const { result } = renderHook(() => useStreak());

      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalled();
      });

      expect(result.current.currentStreak).toBe(0);
      expect(result.current.longestStreak).toBe(0);

      consoleSpy.mockRestore();
    });
  });

  describe("event listening", () => {
    it("listens to StreakUpdated event", async () => {
      mockInvoke.mockResolvedValue({
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: null,
      });
      mockListen.mockResolvedValue(() => {});

      renderHook(() => useStreak());

      await waitFor(() => {
        expect(mockListen).toHaveBeenCalledWith(
          "StreakUpdated",
          expect.any(Function)
        );
      });
    });

    it("updates store when StreakUpdated event fires", async () => {
      mockInvoke.mockResolvedValue({
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: null,
      });

      let eventCallback: ((event: { payload: { currentStreak: number; longestStreak: number } }) => void) | undefined;
      mockListen.mockImplementation((eventName, callback) => {
        if (eventName === "StreakUpdated") {
          eventCallback = callback as typeof eventCallback;
        }
        return Promise.resolve(() => {});
      });

      const { result } = renderHook(() => useStreak());

      await waitFor(() => {
        expect(eventCallback).toBeDefined();
      });

      eventCallback!({ payload: { currentStreak: 8, longestStreak: 15 } });

      await waitFor(() => {
        expect(result.current.currentStreak).toBe(8);
        expect(result.current.longestStreak).toBe(15);
      });
    });

    it("cleans up event listener on unmount", async () => {
      mockInvoke.mockResolvedValue({
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: null,
      });

      const unsubscribeFn = vi.fn();
      mockListen.mockResolvedValue(unsubscribeFn);

      const { unmount } = renderHook(() => useStreak());

      await waitFor(() => {
        expect(mockListen).toHaveBeenCalled();
      });

      unmount();

      await waitFor(() => {
        expect(unsubscribeFn).toHaveBeenCalled();
      });
    });
  });

  describe("return values", () => {
    it("returns currentStreak from store", async () => {
      mockInvoke.mockResolvedValue({
        currentStreak: 7,
        longestStreak: 14,
        lastStreakDate: "2026-01-29",
      });
      mockListen.mockResolvedValue(() => {});

      const { result } = renderHook(() => useStreak());

      await waitFor(() => {
        expect(result.current.currentStreak).toBe(7);
      });
    });

    it("returns longestStreak from store", async () => {
      mockInvoke.mockResolvedValue({
        currentStreak: 7,
        longestStreak: 21,
        lastStreakDate: "2026-01-29",
      });
      mockListen.mockResolvedValue(() => {});

      const { result } = renderHook(() => useStreak());

      await waitFor(() => {
        expect(result.current.longestStreak).toBe(21);
      });
    });

    it("returns isMilestone from store", async () => {
      mockInvoke.mockResolvedValue({
        currentStreak: 7,
        longestStreak: 14,
        lastStreakDate: "2026-01-29",
      });
      mockListen.mockResolvedValue(() => {});

      const { result } = renderHook(() => useStreak());

      await waitFor(() => {
        expect(result.current.isMilestone).toBe(true);
      });
    });
  });
});
