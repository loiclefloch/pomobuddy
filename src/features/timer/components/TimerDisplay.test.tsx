import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimerDisplay } from "./TimerDisplay";
import { useTimerStore } from "../stores/timerStore";

describe("TimerDisplay", () => {
  beforeEach(() => {
    useTimerStore.getState().reset();
  });

  describe("time formatting", () => {
    it("displays 00:00 when remainingSeconds is 0", () => {
      useTimerStore.getState().setRemainingSeconds(0);
      render(<TimerDisplay />);
      expect(screen.getByText("00:00")).toBeInTheDocument();
    });

    it("displays 25:00 for 1500 seconds", () => {
      useTimerStore.getState().setRemainingSeconds(1500);
      render(<TimerDisplay />);
      expect(screen.getByText("25:00")).toBeInTheDocument();
    });

    it("displays 05:00 for 300 seconds", () => {
      useTimerStore.getState().setRemainingSeconds(300);
      render(<TimerDisplay />);
      expect(screen.getByText("05:00")).toBeInTheDocument();
    });

    it("displays 04:32 for 272 seconds", () => {
      useTimerStore.getState().setRemainingSeconds(272);
      render(<TimerDisplay />);
      expect(screen.getByText("04:32")).toBeInTheDocument();
    });
  });

  describe("status indicator", () => {
    it("does not show status label when idle", () => {
      useTimerStore.getState().setStatus("idle");
      render(<TimerDisplay />);
      expect(screen.queryByText("Ready")).not.toBeInTheDocument();
    });

    it("shows Focus label when in focus mode", () => {
      useTimerStore.getState().setStatus("focus");
      render(<TimerDisplay />);
      expect(screen.getByText("Focus")).toBeInTheDocument();
    });

    it("shows Break label when in break mode", () => {
      useTimerStore.getState().setStatus("break");
      render(<TimerDisplay />);
      expect(screen.getByText("Break")).toBeInTheDocument();
    });

    it("shows Paused label when paused", () => {
      useTimerStore.getState().setStatus("paused");
      render(<TimerDisplay />);
      expect(screen.getByText("Paused")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("announces idle state as ready to start", () => {
      useTimerStore.getState().setStatus("idle");
      render(<TimerDisplay />);
      expect(screen.getByLabelText("Timer ready to start")).toBeInTheDocument();
    });

    it("announces focus time with minutes and seconds", () => {
      useTimerStore.getState().setStatus("focus");
      useTimerStore.getState().setRemainingSeconds(1500);
      render(<TimerDisplay />);
      expect(
        screen.getByLabelText("Focus time remaining: 25 minutes 00 seconds")
      ).toBeInTheDocument();
    });

    it("announces break time with minutes and seconds", () => {
      useTimerStore.getState().setStatus("break");
      useTimerStore.getState().setRemainingSeconds(300);
      render(<TimerDisplay />);
      expect(
        screen.getByLabelText("Break time remaining: 05 minutes 00 seconds")
      ).toBeInTheDocument();
    });

    it("announces paused state with current time", () => {
      useTimerStore.getState().setStatus("paused");
      useTimerStore.getState().setRemainingSeconds(720);
      render(<TimerDisplay />);
      expect(
        screen.getByLabelText("Timer paused at 12 minutes 00 seconds")
      ).toBeInTheDocument();
    });

    it("has aria-live for screen reader updates", () => {
      render(<TimerDisplay />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("styling", () => {
    it("applies correct class for idle status", () => {
      useTimerStore.getState().setStatus("idle");
      render(<TimerDisplay />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveClass("text-cozy-muted");
    });

    it("applies correct class for focus status", () => {
      useTimerStore.getState().setStatus("focus");
      render(<TimerDisplay />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveClass("text-cozy-accent");
    });

    it("applies correct class for break status", () => {
      useTimerStore.getState().setStatus("break");
      render(<TimerDisplay />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveClass("text-cozy-success");
    });

    it("has transition classes for smooth color changes", () => {
      useTimerStore.getState().setStatus("focus");
      render(<TimerDisplay />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveClass("transition-colors");
      expect(timeElement).toHaveClass("duration-300");
    });

    it("respects reduced motion preference", () => {
      useTimerStore.getState().setStatus("focus");
      render(<TimerDisplay />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveClass("motion-reduce:transition-none");
    });
  });
});
