import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionHistoryItem } from "./SessionHistoryItem";

describe("SessionHistoryItem", () => {
  const mockCompleteSession = {
    startTime: "2026-01-29T09:15:00",
    endTime: "2026-01-29T09:40:00",
    durationSeconds: 25 * 60,
    status: "complete" as const,
  };

  const mockInterruptedSession = {
    startTime: "2026-01-29T10:02:00",
    endTime: "2026-01-29T10:16:00",
    durationSeconds: 14 * 60,
    status: "interrupted" as const,
  };

  describe("time range display", () => {
    it("renders start time correctly", () => {
      render(<SessionHistoryItem session={mockCompleteSession} />);
      expect(screen.getByText(/09:15/)).toBeInTheDocument();
    });

    it("renders end time correctly", () => {
      render(<SessionHistoryItem session={mockCompleteSession} />);
      expect(screen.getByText(/09:40/)).toBeInTheDocument();
    });

    it("renders time range with separator", () => {
      render(<SessionHistoryItem session={mockCompleteSession} />);
      expect(screen.getByText("09:15 - 09:40")).toBeInTheDocument();
    });
  });

  describe("duration display", () => {
    it("renders duration in minutes", () => {
      render(<SessionHistoryItem session={mockCompleteSession} />);
      expect(screen.getByText("25m")).toBeInTheDocument();
    });

    it("renders shorter duration correctly", () => {
      render(<SessionHistoryItem session={mockInterruptedSession} />);
      expect(screen.getByText("14m")).toBeInTheDocument();
    });
  });

  describe("status indicator", () => {
    it("shows checkmark for complete sessions", () => {
      render(<SessionHistoryItem session={mockCompleteSession} />);
      expect(screen.getByText("✓")).toBeInTheDocument();
    });

    it("shows circle for interrupted sessions", () => {
      render(<SessionHistoryItem session={mockInterruptedSession} />);
      expect(screen.getByText("○")).toBeInTheDocument();
    });

    it("shows 'Complete' text for complete sessions", () => {
      render(<SessionHistoryItem session={mockCompleteSession} />);
      expect(screen.getByText("Complete")).toBeInTheDocument();
    });

    it("shows 'Interrupted' text for interrupted sessions", () => {
      render(<SessionHistoryItem session={mockInterruptedSession} />);
      expect(screen.getByText("Interrupted")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies success color to complete session indicator", () => {
      render(<SessionHistoryItem session={mockCompleteSession} />);
      const indicator = screen.getByText("✓");
      expect(indicator).toHaveClass("text-cozy-success");
    });

    it("applies muted color to interrupted session indicator", () => {
      render(<SessionHistoryItem session={mockInterruptedSession} />);
      const indicator = screen.getByText("○");
      expect(indicator).toHaveClass("text-cozy-muted");
    });

    it("uses flex layout for alignment", () => {
      const { container } = render(
        <SessionHistoryItem session={mockCompleteSession} />
      );
      const item = container.firstChild as HTMLElement;
      expect(item).toHaveClass("flex");
    });
  });
});
