import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useStreakStore } from "./streakStore";

// Mock Tauri APIs
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

describe("useStreakStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useStreakStore.setState({
      currentStreak: 0,
      longestStreak: 0,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with currentStreak of 0", () => {
      const { result } = renderHook(() => useStreakStore());
      expect(result.current.currentStreak).toBe(0);
    });

    it("starts with longestStreak of 0", () => {
      const { result } = renderHook(() => useStreakStore());
      expect(result.current.longestStreak).toBe(0);
    });
  });

  describe("setStreak", () => {
    it("updates currentStreak and longestStreak", () => {
      const { result } = renderHook(() => useStreakStore());

      act(() => {
        result.current.setStreak(5, 10);
      });

      expect(result.current.currentStreak).toBe(5);
      expect(result.current.longestStreak).toBe(10);
    });

    it("handles zero values", () => {
      const { result } = renderHook(() => useStreakStore());

      // First set non-zero values
      act(() => {
        result.current.setStreak(5, 10);
      });

      // Then reset to zero
      act(() => {
        result.current.setStreak(0, 10);
      });

      expect(result.current.currentStreak).toBe(0);
      expect(result.current.longestStreak).toBe(10);
    });

    it("updates longest streak when current exceeds it", () => {
      const { result } = renderHook(() => useStreakStore());

      act(() => {
        result.current.setStreak(15, 15);
      });

      expect(result.current.currentStreak).toBe(15);
      expect(result.current.longestStreak).toBe(15);
    });
  });

  describe("reset", () => {
    it("resets all values to initial state", () => {
      const { result } = renderHook(() => useStreakStore());

      // Set some values first
      act(() => {
        result.current.setStreak(7, 14);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentStreak).toBe(0);
      expect(result.current.longestStreak).toBe(0);
    });
  });

  describe("isMilestone", () => {
    it("returns true for 7-day milestone", () => {
      const { result } = renderHook(() => useStreakStore());

      act(() => {
        result.current.setStreak(7, 7);
      });

      expect(result.current.isMilestone).toBe(true);
    });

    it("returns true for 14-day milestone", () => {
      const { result } = renderHook(() => useStreakStore());

      act(() => {
        result.current.setStreak(14, 14);
      });

      expect(result.current.isMilestone).toBe(true);
    });

    it("returns true for 30-day milestone", () => {
      const { result } = renderHook(() => useStreakStore());

      act(() => {
        result.current.setStreak(30, 30);
      });

      expect(result.current.isMilestone).toBe(true);
    });

    it("returns false for non-milestone streaks", () => {
      const { result } = renderHook(() => useStreakStore());

      act(() => {
        result.current.setStreak(5, 5);
      });

      expect(result.current.isMilestone).toBe(false);
    });

    it("returns false for zero streak", () => {
      const { result } = renderHook(() => useStreakStore());
      expect(result.current.isMilestone).toBe(false);
    });
  });
});
