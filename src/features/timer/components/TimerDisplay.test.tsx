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
      expect(screen.queryByText("idle")).not.toBeInTheDocument();
    });

    it("shows focus label when in focus mode", () => {
      useTimerStore.getState().setStatus("focus");
      render(<TimerDisplay />);
      expect(screen.getByText("focus")).toBeInTheDocument();
    });

    it("shows break label when in break mode", () => {
      useTimerStore.getState().setStatus("break");
      render(<TimerDisplay />);
      expect(screen.getByText("break")).toBeInTheDocument();
    });

    it("shows paused label when paused", () => {
      useTimerStore.getState().setStatus("paused");
      render(<TimerDisplay />);
      expect(screen.getByText("paused")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has accessible time element with aria-label", () => {
      useTimerStore.getState().setRemainingSeconds(1500);
      render(<TimerDisplay />);
      expect(screen.getByLabelText("Timer: 25:00")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies correct class for idle status", () => {
      useTimerStore.getState().setStatus("idle");
      render(<TimerDisplay />);
      const timeElement = screen.getByLabelText(/Timer:/);
      expect(timeElement).toHaveClass("text-cozy-muted");
    });

    it("applies correct class for focus status", () => {
      useTimerStore.getState().setStatus("focus");
      render(<TimerDisplay />);
      const timeElement = screen.getByLabelText(/Timer:/);
      expect(timeElement).toHaveClass("text-cozy-accent");
    });

    it("applies correct class for break status", () => {
      useTimerStore.getState().setStatus("break");
      render(<TimerDisplay />);
      const timeElement = screen.getByLabelText(/Timer:/);
      expect(timeElement).toHaveClass("text-cozy-success");
    });
  });
});
