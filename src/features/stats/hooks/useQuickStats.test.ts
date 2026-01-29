import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useQuickStats } from "./useQuickStats";
import { useStatsStore } from "../stores/statsStore";

describe("useQuickStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStatsStore.getState().reset();
  });

  it("should fetch initial stats on mount", async () => {
    const mockStats = {
      currentStreak: 5,
      todaySessions: 3,
      todayFocusMinutes: 75,
    };
    vi.mocked(invoke).mockResolvedValueOnce(mockStats);

    const { result } = renderHook(() => useQuickStats());

    await waitFor(() => {
      expect(result.current.currentStreak).toBe(5);
    });

    expect(invoke).toHaveBeenCalledWith("get_quick_stats");
    expect(result.current.todaySessions).toBe(3);
    expect(result.current.todayFocusMinutes).toBe(75);
  });

  it("should set up SessionSaved event listener", async () => {
    vi.mocked(invoke).mockResolvedValueOnce({
      currentStreak: 0,
      todaySessions: 0,
      todayFocusMinutes: 0,
    });

    renderHook(() => useQuickStats());

    await waitFor(() => {
      expect(listen).toHaveBeenCalled();
    });

    const calls = vi.mocked(listen).mock.calls;
    const sessionSavedCall = calls.find((call) => call[0] === "SessionSaved");
    expect(sessionSavedCall).toBeDefined();
  });

  it("should set up SessionComplete event listener", async () => {
    vi.mocked(invoke).mockResolvedValueOnce({
      currentStreak: 0,
      todaySessions: 0,
      todayFocusMinutes: 0,
    });

    renderHook(() => useQuickStats());

    await waitFor(() => {
      expect(listen).toHaveBeenCalled();
    });

    const calls = vi.mocked(listen).mock.calls;
    const sessionCompleteCall = calls.find(
      (call) => call[0] === "SessionComplete"
    );
    expect(sessionCompleteCall).toBeDefined();
  });

  it("should update stats when SessionSaved event is received", async () => {
    vi.mocked(invoke).mockResolvedValueOnce({
      currentStreak: 0,
      todaySessions: 0,
      todayFocusMinutes: 0,
    });

    let sessionSavedCallback: ((event: unknown) => void) | null = null;
    vi.mocked(listen).mockImplementation((eventName, callback) => {
      if (eventName === "SessionSaved") {
        sessionSavedCallback = callback as (event: unknown) => void;
      }
      return Promise.resolve(() => {});
    });

    const { result } = renderHook(() => useQuickStats());

    await waitFor(() => {
      expect(sessionSavedCallback).not.toBeNull();
    });

    act(() => {
      sessionSavedCallback!({
        payload: {
          sessionType: "focus",
          status: "complete",
          durationSeconds: 1500,
          completeCount: 2,
          partialCount: 1,
          totalFocusMinutes: 64,
        },
      });
    });

    expect(result.current.todaySessions).toBe(3);
    expect(result.current.todayFocusMinutes).toBe(64);
  });

  it("should clean up listeners on unmount", async () => {
    const unlistenFn = vi.fn();
    vi.mocked(listen).mockResolvedValue(unlistenFn);
    vi.mocked(invoke).mockResolvedValueOnce({
      currentStreak: 0,
      todaySessions: 0,
      todayFocusMinutes: 0,
    });

    const { unmount } = renderHook(() => useQuickStats());

    await waitFor(() => {
      expect(listen).toHaveBeenCalled();
    });

    unmount();

    await waitFor(() => {
      expect(unlistenFn).toHaveBeenCalled();
    });
  });
});
