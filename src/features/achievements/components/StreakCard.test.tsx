import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreakCard } from "./StreakCard";
import { useStreakStore } from "../stores/streakStore";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

describe("StreakCard", () => {
  beforeEach(() => {
    useStreakStore.setState({
      currentStreak: 0,
      longestStreak: 0,
    });
  });

  describe("streak display", () => {
    it("displays current streak value", () => {
      render(<StreakCard currentStreak={12} longestStreak={21} />);
      expect(screen.getByText("12 days")).toBeInTheDocument();
    });

    it("displays singular 'day' for streak of 1", () => {
      render(<StreakCard currentStreak={1} longestStreak={5} />);
      expect(screen.getByText("1 day")).toBeInTheDocument();
    });

    it("displays 'Current Streak' label", () => {
      render(<StreakCard currentStreak={5} longestStreak={10} />);
      expect(screen.getByText("Current Streak")).toBeInTheDocument();
    });

    it("displays 'Best: X days' secondary text", () => {
      render(<StreakCard currentStreak={5} longestStreak={21} />);
      expect(screen.getByText("Best: 21 days")).toBeInTheDocument();
    });

    it("displays singular 'day' in best for 1 day longest", () => {
      render(<StreakCard currentStreak={1} longestStreak={1} />);
      expect(screen.getByText("Best: 1 day")).toBeInTheDocument();
    });
  });

  describe("zero streak display (encouraging)", () => {
    it('displays "Start streak!" when currentStreak is 0', () => {
      render(<StreakCard currentStreak={0} longestStreak={5} />);
      expect(screen.getByText("Start streak!")).toBeInTheDocument();
    });

    it("displays encouraging message, not guilt", () => {
      render(<StreakCard currentStreak={0} longestStreak={10} />);
      expect(screen.queryByText(/broke/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/lost/i)).not.toBeInTheDocument();
    });

    it("shows best streak even when current is 0", () => {
      render(<StreakCard currentStreak={0} longestStreak={14} />);
      expect(screen.getByText("Best: 14 days")).toBeInTheDocument();
    });

    it('shows "Ready to begin?" label when streak is 0', () => {
      render(<StreakCard currentStreak={0} longestStreak={0} />);
      expect(screen.getByText("Ready to begin?")).toBeInTheDocument();
    });
  });

  describe("milestone indicators", () => {
    it("shows milestone indicator for 7-day streak", () => {
      render(<StreakCard currentStreak={7} longestStreak={7} isMilestone />);
      expect(screen.getByTestId("milestone-indicator")).toBeInTheDocument();
    });

    it("shows milestone indicator for 14-day streak", () => {
      render(<StreakCard currentStreak={14} longestStreak={14} isMilestone />);
      expect(screen.getByTestId("milestone-indicator")).toBeInTheDocument();
    });

    it("shows milestone indicator for 30-day streak", () => {
      render(<StreakCard currentStreak={30} longestStreak={30} isMilestone />);
      expect(screen.getByTestId("milestone-indicator")).toBeInTheDocument();
    });

    it("does not show milestone indicator for non-milestone streaks", () => {
      render(<StreakCard currentStreak={5} longestStreak={5} />);
      expect(screen.queryByTestId("milestone-indicator")).not.toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("uses bg-cozy-surface background", () => {
      render(<StreakCard currentStreak={5} longestStreak={10} />);
      const card = screen.getByTestId("streak-card");
      expect(card).toHaveClass("bg-cozy-surface");
    });

    it("uses rounded-xl border radius", () => {
      render(<StreakCard currentStreak={5} longestStreak={10} />);
      const card = screen.getByTestId("streak-card");
      expect(card).toHaveClass("rounded-xl");
    });

    it("renders flame icon", () => {
      render(<StreakCard currentStreak={5} longestStreak={10} />);
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });
});
