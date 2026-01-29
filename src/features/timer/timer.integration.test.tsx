import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useTimerStore } from "./stores/timerStore";
import { TimerDisplay } from "./components/TimerDisplay";
import { TimerControls } from "./components/TimerControls";
import { useTimer } from "./hooks/useTimer";

vi.mock("@tauri-apps/api/core");
vi.mock("@tauri-apps/api/event");

const mockInvoke = vi.mocked(invoke);
const mockListen = vi.mocked(listen);

function TimerTestHarness() {
  const { start, pause, resume, stop } = useTimer();

  return (
    <div>
      <TimerDisplay />
      <TimerControls
        onStart={start}
        onPause={pause}
        onResume={resume}
        onStop={stop}
      />
    </div>
  );
}

describe("Timer Integration: Focus-to-Break Auto-Transition", () => {
  let tickHandler: ((event: { payload: unknown }) => void) | null = null;
  let completeHandler: ((event: { payload: unknown }) => void) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    useTimerStore.getState().reset();
    tickHandler = null;
    completeHandler = null;

    mockInvoke.mockResolvedValue(undefined);

    mockListen.mockImplementation(async (eventName, handler) => {
      if (eventName === "TimerTick") {
        tickHandler = handler as (event: { payload: unknown }) => void;
      }
      if (eventName === "SessionComplete") {
        completeHandler = handler as (event: { payload: unknown }) => void;
      }
      return () => {};
    });
  });

  async function waitForListeners() {
    await waitFor(() => {
      expect(tickHandler).not.toBeNull();
      expect(completeHandler).not.toBeNull();
    });
  }

  describe("AC #1: Focus session auto-transitions to break", () => {
    it("transitions from focus to break when timer reaches 0", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 1500, status: "focus" } });
      });

      expect(screen.getByText("Focus")).toBeInTheDocument();
      expect(screen.getByText("25:00")).toBeInTheDocument();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 1, status: "focus" } });
      });

      expect(screen.getByText("00:01")).toBeInTheDocument();

      act(() => {
        completeHandler?.({
          payload: {
            sessionType: "focus",
            durationSeconds: 1500,
            completedAt: new Date().toISOString(),
          },
        });
        tickHandler?.({ payload: { remainingSeconds: 300, status: "break" } });
      });

      expect(screen.getByText("Break")).toBeInTheDocument();
      expect(screen.getByText("05:00")).toBeInTheDocument();
    });

    it("shows break visual indicator (sage green) after focus completes", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 300, status: "break" } });
      });

      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveClass("text-cozy-success");
    });
  });

  describe("AC #2: Break mode display", () => {
    it("shows 'Break' label and countdown in MM:SS format", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 272, status: "break" } });
      });

      expect(screen.getByText("Break")).toBeInTheDocument();
      expect(screen.getByText("04:32")).toBeInTheDocument();
    });

    it("announces break time for screen readers", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 300, status: "break" } });
      });

      expect(
        screen.getByLabelText("Break time remaining: 05 minutes 00 seconds")
      ).toBeInTheDocument();
    });
  });

  describe("AC #3: Stop during break returns to idle", () => {
    it("shows Stop button during break mode", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 200, status: "break" } });
      });

      expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    });

    it("returns to idle when Stop is clicked during break", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 200, status: "break" } });
      });

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /stop/i }));
      });

      expect(mockInvoke).toHaveBeenCalledWith("stop_timer");
      expect(useTimerStore.getState().status).toBe("idle");
    });
  });

  describe("AC #4: Break completion returns to idle", () => {
    it("returns to idle when break timer reaches 0", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 1, status: "break" } });
      });

      expect(screen.getByText("Break")).toBeInTheDocument();

      act(() => {
        completeHandler?.({
          payload: {
            sessionType: "break",
            durationSeconds: 300,
            completedAt: new Date().toISOString(),
          },
        });
      });

      expect(useTimerStore.getState().status).toBe("idle");
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });

    it("shows Start button after break completes", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 1, status: "break" } });
      });

      act(() => {
        completeHandler?.({
          payload: {
            sessionType: "break",
            durationSeconds: 300,
            completedAt: new Date().toISOString(),
          },
        });
      });

      expect(
        screen.getByRole("button", { name: /start/i })
      ).toBeInTheDocument();
    });
  });

  describe("AC #5: SessionComplete event includes session type", () => {
    it("does NOT reset on focus SessionComplete (backend handles transition)", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 1200, status: "focus" } });
      });

      act(() => {
        completeHandler?.({
          payload: {
            sessionType: "focus",
            durationSeconds: 1500,
            completedAt: new Date().toISOString(),
          },
        });
      });

      expect(useTimerStore.getState().status).toBe("focus");
      expect(useTimerStore.getState().remainingSeconds).toBe(1200);
    });

    it("resets ONLY on break SessionComplete", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 100, status: "break" } });
      });

      act(() => {
        completeHandler?.({
          payload: {
            sessionType: "break",
            durationSeconds: 300,
            completedAt: new Date().toISOString(),
          },
        });
      });

      expect(useTimerStore.getState().status).toBe("idle");
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });
  });

  describe("Full cycle: Start -> Focus -> Break -> Idle", () => {
    it("completes full Pomodoro cycle with correct UI states", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      expect(
        screen.getByRole("button", { name: /start/i })
      ).toBeInTheDocument();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 1500, status: "focus" } });
      });
      expect(screen.getByText("Focus")).toBeInTheDocument();
      expect(screen.getByRole("time")).toHaveClass("text-cozy-accent");

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 0, status: "focus" } });
        completeHandler?.({
          payload: {
            sessionType: "focus",
            durationSeconds: 1500,
            completedAt: new Date().toISOString(),
          },
        });
        tickHandler?.({ payload: { remainingSeconds: 300, status: "break" } });
      });

      expect(screen.getByText("Break")).toBeInTheDocument();
      expect(screen.getByRole("time")).toHaveClass("text-cozy-success");

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 0, status: "break" } });
        completeHandler?.({
          payload: {
            sessionType: "break",
            durationSeconds: 300,
            completedAt: new Date().toISOString(),
          },
        });
      });

      expect(
        screen.getByRole("button", { name: /start/i })
      ).toBeInTheDocument();
      expect(useTimerStore.getState().status).toBe("idle");
    });
  });

  describe("Stop during focus prevents break", () => {
    it("returns to idle without starting break when stopped during focus", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 600, status: "focus" } });
      });

      expect(screen.getByText("Focus")).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /stop/i }));
      });

      expect(mockInvoke).toHaveBeenCalledWith("stop_timer");
      expect(useTimerStore.getState().status).toBe("idle");
      expect(screen.queryByText("Break")).not.toBeInTheDocument();
    });
  });

  describe("Color transitions", () => {
    it("displays coral for focus, sage for break, muted for idle", async () => {
      render(<TimerTestHarness />);
      await waitForListeners();

      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveClass("text-cozy-muted");

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 1500, status: "focus" } });
      });
      expect(timeElement).toHaveClass("text-cozy-accent");

      act(() => {
        tickHandler?.({ payload: { remainingSeconds: 300, status: "break" } });
      });
      expect(timeElement).toHaveClass("text-cozy-success");

      act(() => {
        completeHandler?.({
          payload: {
            sessionType: "break",
            durationSeconds: 300,
            completedAt: new Date().toISOString(),
          },
        });
      });
      expect(timeElement).toHaveClass("text-cozy-muted");
    });
  });
});
