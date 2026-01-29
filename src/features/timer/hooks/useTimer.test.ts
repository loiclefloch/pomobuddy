import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useTimer } from "./useTimer";
import { useTimerStore } from "../stores/timerStore";

vi.mock("@tauri-apps/api/core");
vi.mock("@tauri-apps/api/event");

const mockInvoke = vi.mocked(invoke);
const mockListen = vi.mocked(listen);

describe("useTimer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTimerStore.getState().reset();
    mockInvoke.mockResolvedValue(undefined);
    mockListen.mockResolvedValue(() => {});
  });

  describe("initialization", () => {
    it("subscribes to TimerTick events on mount", async () => {
      renderHook(() => useTimer());

      await waitFor(() => {
        expect(mockListen).toHaveBeenCalledWith(
          "TimerTick",
          expect.any(Function)
        );
      });
    });

    it("subscribes to SessionComplete events on mount", async () => {
      renderHook(() => useTimer());

      await waitFor(() => {
        expect(mockListen).toHaveBeenCalledWith(
          "SessionComplete",
          expect.any(Function)
        );
      });
    });

    it("fetches initial state from backend", async () => {
      mockInvoke.mockResolvedValueOnce({
        status: "focus",
        remainingSeconds: 1200,
        sessionStartTime: null,
      });

      renderHook(() => useTimer());

      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalledWith("getTimerState");
      });
    });
  });

  describe("start", () => {
    it("invokes startTimer command", async () => {
      const { result } = renderHook(() => useTimer());

      await act(async () => {
        await result.current.start();
      });

      expect(mockInvoke).toHaveBeenCalledWith("startTimer");
    });
  });

  describe("pause", () => {
    it("invokes pauseTimer command", async () => {
      const { result } = renderHook(() => useTimer());

      await act(async () => {
        await result.current.pause();
      });

      expect(mockInvoke).toHaveBeenCalledWith("pauseTimer");
    });
  });

  describe("resume", () => {
    it("invokes resumeTimer command", async () => {
      const { result } = renderHook(() => useTimer());

      await act(async () => {
        await result.current.resume();
      });

      expect(mockInvoke).toHaveBeenCalledWith("resumeTimer");
    });
  });

  describe("stop", () => {
    it("invokes stopTimer command", async () => {
      const { result } = renderHook(() => useTimer());

      await act(async () => {
        await result.current.stop();
      });

      expect(mockInvoke).toHaveBeenCalledWith("stopTimer");
    });

    it("resets store state after stop", async () => {
      useTimerStore.getState().setStatus("focus");
      useTimerStore.getState().setRemainingSeconds(1200);

      const { result } = renderHook(() => useTimer());

      await act(async () => {
        await result.current.stop();
      });

      expect(useTimerStore.getState().status).toBe("idle");
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });
  });

  describe("event handling", () => {
    it("updates store on TimerTick event", async () => {
      let tickHandler: ((event: { payload: unknown }) => void) | null = null;

      mockListen.mockImplementation(async (eventName, handler) => {
        if (eventName === "TimerTick") {
          tickHandler = handler as (event: { payload: unknown }) => void;
        }
        return () => {};
      });

      renderHook(() => useTimer());

      await waitFor(() => {
        expect(tickHandler).not.toBeNull();
      });

      act(() => {
        tickHandler?.({
          payload: { remaining: 1450, status: "focus" },
        });
      });

      expect(useTimerStore.getState().remainingSeconds).toBe(1450);
      expect(useTimerStore.getState().status).toBe("focus");
    });

    it("resets store on SessionComplete event", async () => {
      let completeHandler: ((event: { payload: unknown }) => void) | null =
        null;

      mockListen.mockImplementation(async (eventName, handler) => {
        if (eventName === "SessionComplete") {
          completeHandler = handler as (event: { payload: unknown }) => void;
        }
        return () => {};
      });

      useTimerStore.getState().setStatus("focus");
      useTimerStore.getState().setRemainingSeconds(1200);

      renderHook(() => useTimer());

      await waitFor(() => {
        expect(completeHandler).not.toBeNull();
      });

      act(() => {
        completeHandler?.({
          payload: {
            sessionType: "focus",
            durationSeconds: 1500,
            completedAt: "2026-01-29T12:00:00Z",
          },
        });
      });

      expect(useTimerStore.getState().status).toBe("idle");
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });
  });

  describe("return values", () => {
    it("returns status from store", () => {
      useTimerStore.getState().setStatus("break");
      const { result } = renderHook(() => useTimer());
      expect(result.current.status).toBe("break");
    });

    it("returns remainingSeconds from store", () => {
      useTimerStore.getState().setRemainingSeconds(300);
      const { result } = renderHook(() => useTimer());
      expect(result.current.remainingSeconds).toBe(300);
    });
  });
});
