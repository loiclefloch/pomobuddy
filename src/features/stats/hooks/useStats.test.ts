import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useStats } from "./useStats";
import { useStatsStore } from "../stores/statsStore";

describe("useStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStatsStore.getState().reset();
  });

  it("should fetch initial today stats on mount", async () => {
    const mockStats = {
      completedCount: 3,
      interruptedCount: 1,
      totalFocusMinutes: 85,
    };
    vi.mocked(invoke).mockResolvedValueOnce(mockStats);

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.sessionsToday).toBe(4);
    });

    expect(invoke).toHaveBeenCalledWith("get_today_stats");
    expect(result.current.completedCount).toBe(3);
    expect(result.current.interruptedCount).toBe(1);
    expect(result.current.focusTimeToday).toBe(85);
  });

  it("should provide computed sessionsToday (completed + interrupted)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce({
      completedCount: 5,
      interruptedCount: 2,
      totalFocusMinutes: 100,
    });

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.sessionsToday).toBe(7);
    });
  });

  it("should set up SessionSaved event listener", async () => {
    vi.mocked(invoke).mockResolvedValueOnce({
      completedCount: 0,
      interruptedCount: 0,
      totalFocusMinutes: 0,
    });

    renderHook(() => useStats());

    await waitFor(() => {
      expect(listen).toHaveBeenCalled();
    });

    const calls = vi.mocked(listen).mock.calls;
    const sessionSavedCall = calls.find((call) => call[0] === "SessionSaved");
    expect(sessionSavedCall).toBeDefined();
  });

  it("should refetch stats when SessionSaved event is received", async () => {
    vi.mocked(invoke)
      .mockResolvedValueOnce({
        completedCount: 0,
        interruptedCount: 0,
        totalFocusMinutes: 0,
      })
      .mockResolvedValueOnce({
        completedCount: 1,
        interruptedCount: 0,
        totalFocusMinutes: 25,
      });

    let sessionSavedCallback: ((event: unknown) => void) | null = null;
    vi.mocked(listen).mockImplementation((eventName, callback) => {
      if (eventName === "SessionSaved") {
        sessionSavedCallback = callback as (event: unknown) => void;
      }
      return Promise.resolve(() => {});
    });

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(sessionSavedCallback).not.toBeNull();
    });

    act(() => {
      sessionSavedCallback!({ payload: {} });
    });

    await waitFor(() => {
      expect(result.current.completedCount).toBe(1);
    });
  });

  it("should set up SessionComplete event listener", async () => {
    vi.mocked(invoke).mockResolvedValueOnce({
      completedCount: 0,
      interruptedCount: 0,
      totalFocusMinutes: 0,
    });

    renderHook(() => useStats());

    await waitFor(() => {
      expect(listen).toHaveBeenCalled();
    });

    const calls = vi.mocked(listen).mock.calls;
    const sessionCompleteCall = calls.find(
      (call) => call[0] === "SessionComplete"
    );
    expect(sessionCompleteCall).toBeDefined();
  });

  it("should clean up listeners on unmount", async () => {
    const unlistenFn = vi.fn();
    vi.mocked(listen).mockResolvedValue(unlistenFn);
    vi.mocked(invoke).mockResolvedValueOnce({
      completedCount: 0,
      interruptedCount: 0,
      totalFocusMinutes: 0,
    });

    const { unmount } = renderHook(() => useStats());

    await waitFor(() => {
      expect(listen).toHaveBeenCalled();
    });

    unmount();

    await waitFor(() => {
      expect(unlistenFn).toHaveBeenCalled();
    });
  });

  it("should handle zero sessions gracefully", async () => {
    vi.mocked(invoke).mockResolvedValueOnce({
      completedCount: 0,
      interruptedCount: 0,
      totalFocusMinutes: 0,
    });

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(invoke).toHaveBeenCalled();
    });

    expect(result.current.sessionsToday).toBe(0);
    expect(result.current.focusTimeToday).toBe(0);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.interruptedCount).toBe(0);
  });
});
