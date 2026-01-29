import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimerControls } from "./TimerControls";
import { useTimerStore } from "../stores/timerStore";

describe("TimerControls", () => {
  const mockHandlers = {
    onStart: vi.fn(),
    onPause: vi.fn(),
    onResume: vi.fn(),
    onStop: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTimerStore.getState().reset();
  });

  describe("idle state", () => {
    beforeEach(() => {
      useTimerStore.getState().setStatus("idle");
    });

    it("shows Start button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
    });

    it("does not show Pause button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.queryByRole("button", { name: /pause/i })).not.toBeInTheDocument();
    });

    it("does not show Resume button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.queryByRole("button", { name: /resume/i })).not.toBeInTheDocument();
    });

    it("does not show Stop button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.queryByRole("button", { name: /stop/i })).not.toBeInTheDocument();
    });

    it("calls onStart when Start is clicked", () => {
      render(<TimerControls {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /start/i }));
      expect(mockHandlers.onStart).toHaveBeenCalledTimes(1);
    });
  });

  describe("focus state", () => {
    beforeEach(() => {
      useTimerStore.getState().setStatus("focus");
    });

    it("shows Pause button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
    });

    it("shows Stop button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    });

    it("does not show Start button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.queryByRole("button", { name: /start/i })).not.toBeInTheDocument();
    });

    it("calls onPause when Pause is clicked", () => {
      render(<TimerControls {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /pause/i }));
      expect(mockHandlers.onPause).toHaveBeenCalledTimes(1);
    });

    it("calls onStop when Stop is clicked", () => {
      render(<TimerControls {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /stop/i }));
      expect(mockHandlers.onStop).toHaveBeenCalledTimes(1);
    });
  });

  describe("break state", () => {
    beforeEach(() => {
      useTimerStore.getState().setStatus("break");
    });

    it("shows Pause button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
    });

    it("shows Stop button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    });
  });

  describe("paused state", () => {
    beforeEach(() => {
      useTimerStore.getState().setStatus("paused");
    });

    it("shows Resume button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
    });

    it("shows Stop button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    });

    it("does not show Pause button", () => {
      render(<TimerControls {...mockHandlers} />);
      expect(screen.queryByRole("button", { name: /pause/i })).not.toBeInTheDocument();
    });

    it("calls onResume when Resume is clicked", () => {
      render(<TimerControls {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /resume/i }));
      expect(mockHandlers.onResume).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("has accessible aria-labels on all buttons", () => {
      useTimerStore.getState().setStatus("focus");
      render(<TimerControls {...mockHandlers} />);

      expect(screen.getByLabelText("Pause timer")).toBeInTheDocument();
      expect(screen.getByLabelText("Stop timer")).toBeInTheDocument();
    });
  });
});
