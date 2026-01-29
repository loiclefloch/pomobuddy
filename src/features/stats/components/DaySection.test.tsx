import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DaySection } from "./DaySection";

describe("DaySection", () => {
  const mockSessions = [
    {
      startTime: "2026-01-29T09:15:00",
      endTime: "2026-01-29T09:40:00",
      durationSeconds: 25 * 60,
      status: "complete" as const,
    },
    {
      startTime: "2026-01-29T10:02:00",
      endTime: "2026-01-29T10:16:00",
      durationSeconds: 14 * 60,
      status: "interrupted" as const,
    },
    {
      startTime: "2026-01-29T14:30:00",
      endTime: "2026-01-29T14:55:00",
      durationSeconds: 25 * 60,
      status: "complete" as const,
    },
  ];

  describe("date header", () => {
    it("renders the date label", () => {
      render(<DaySection date="2026-01-29" sessions={mockSessions} />);
      // getDateLabel returns "Today", "Yesterday", or formatted date
      // We'll check that something is rendered in the header area
      const header = screen.getByRole("heading", { level: 3 });
      expect(header).toBeInTheDocument();
    });

    it("displays session count in header", () => {
      render(<DaySection date="2026-01-29" sessions={mockSessions} />);
      expect(screen.getByText("3 sessions")).toBeInTheDocument();
    });

    it("displays singular 'session' for single session", () => {
      render(
        <DaySection date="2026-01-29" sessions={[mockSessions[0]]} />
      );
      expect(screen.getByText("1 session")).toBeInTheDocument();
    });
  });

  describe("sessions list", () => {
    it("renders all sessions", () => {
      render(<DaySection date="2026-01-29" sessions={mockSessions} />);
      // Check for time ranges from sessions
      expect(screen.getByText("09:15 - 09:40")).toBeInTheDocument();
      expect(screen.getByText("10:02 - 10:16")).toBeInTheDocument();
      expect(screen.getByText("14:30 - 14:55")).toBeInTheDocument();
    });

    it("renders status indicators for each session", () => {
      render(<DaySection date="2026-01-29" sessions={mockSessions} />);
      // 2 complete (✓) and 1 interrupted (○)
      const checkmarks = screen.getAllByText("✓");
      const circles = screen.getAllByText("○");
      expect(checkmarks).toHaveLength(2);
      expect(circles).toHaveLength(1);
    });
  });

  describe("daily summary", () => {
    it("renders total focus time", () => {
      render(<DaySection date="2026-01-29" sessions={mockSessions} />);
      // Total: 25 + 14 + 25 = 64 minutes = 1h 4m
      expect(screen.getByText(/1h 4m/)).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty state when no sessions", () => {
      render(<DaySection date="2026-01-29" sessions={[]} />);
      const noSessionsElements = screen.getAllByText("No sessions");
      expect(noSessionsElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("styling", () => {
    it("applies surface background", () => {
      const { container } = render(
        <DaySection date="2026-01-29" sessions={mockSessions} />
      );
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass("bg-cozy-surface");
    });

    it("has rounded corners", () => {
      const { container } = render(
        <DaySection date="2026-01-29" sessions={mockSessions} />
      );
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass("rounded-xl");
    });
  });
});
