import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { AchievementGallery } from "./AchievementGallery";
import { useAchievementStore } from "../stores/achievementStore";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

describe("AchievementGallery", () => {
  const mockAchievements = [
    {
      id: "first_session",
      title: "First Focus",
      description: "Complete your first session",
      icon: "Flame",
      tier: "bronze",
      requirement: { type: "sessions", value: 1 },
      unlocked: true,
      unlockedAt: "2026-01-10T10:00:00Z",
    },
    {
      id: "streak_7",
      title: "Week Warrior",
      description: "7-day streak",
      icon: "Zap",
      tier: "silver",
      requirement: { type: "streak", value: 7 },
      unlocked: true,
      unlockedAt: "2026-01-15T10:00:00Z",
    },
    {
      id: "streak_14",
      title: "Fortnight Focus",
      description: "14-day streak",
      icon: "Award",
      tier: "gold",
      requirement: { type: "streak", value: 14 },
      unlocked: false,
      unlockedAt: null,
    },
    {
      id: "streak_30",
      title: "Monthly Master",
      description: "30-day streak",
      icon: "Crown",
      tier: "platinum",
      requirement: { type: "streak", value: 30 },
      unlocked: false,
      unlockedAt: null,
    },
    {
      id: "sessions_10",
      title: "Getting Started",
      description: "10 total sessions",
      icon: "Target",
      tier: "bronze",
      requirement: { type: "sessions", value: 10 },
      unlocked: false,
      unlockedAt: null,
    },
    {
      id: "sessions_50",
      title: "Half Century",
      description: "50 total sessions",
      icon: "Trophy",
      tier: "silver",
      requirement: { type: "sessions", value: 50 },
      unlocked: false,
      unlockedAt: null,
    },
  ];

  beforeEach(() => {
    useAchievementStore.setState({
      achievements: mockAchievements,
      totalSessions: 5,
      celebrationQueue: [],
      isLoading: false,
    });
  });

  describe("grouping", () => {
    it("displays achievements grouped by category", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={5} />);
      
      expect(screen.getByText("Streak Achievements")).toBeInTheDocument();
      expect(screen.getByText("Session Achievements")).toBeInTheDocument();
    });

    it("shows streak achievements in Streak section", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={5} />);
      
      const streakSection = screen.getByTestId("streak-achievements-section");
      expect(within(streakSection).getByText("Week Warrior")).toBeInTheDocument();
      expect(within(streakSection).getByText("Fortnight Focus")).toBeInTheDocument();
    });

    it("shows session achievements in Session section", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={5} />);
      
      const sessionSection = screen.getByTestId("session-achievements-section");
      expect(within(sessionSection).getByText("First Focus")).toBeInTheDocument();
      expect(within(sessionSection).getByText("Getting Started")).toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("displays unlocked achievements first within each group", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={5} />);
      
      const streakSection = screen.getByTestId("streak-achievements-section");
      const badges = within(streakSection).getAllByTestId("achievement-badge");
      
      expect(badges.length).toBeGreaterThan(0);
      expect(within(badges[0]).getByText("Week Warrior")).toBeInTheDocument();
    });
  });

  describe("responsive layout", () => {
    it("renders achievements in a grid layout", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={5} />);
      
      const streakSection = screen.getByTestId("streak-achievements-section");
      const grid = within(streakSection).getByTestId("achievements-grid");
      expect(grid).toHaveClass("grid");
    });

    it("uses responsive grid columns", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={5} />);
      
      const streakSection = screen.getByTestId("streak-achievements-section");
      const grid = within(streakSection).getByTestId("achievements-grid");
      expect(grid).toHaveClass("grid-cols-2");
      expect(grid).toHaveClass("md:grid-cols-3");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });
  });

  describe("loading state", () => {
    it("shows loading state when isLoading is true", () => {
      useAchievementStore.setState({
        achievements: [],
        totalSessions: 0,
        celebrationQueue: [],
        isLoading: true,
      });
      
      render(<AchievementGallery currentStreak={0} totalSessions={0} />);
      
      expect(screen.getByTestId("achievements-loading")).toBeInTheDocument();
    });

    it("does not show loading state when isLoading is false", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={5} />);
      
      expect(screen.queryByTestId("achievements-loading")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows empty state when no achievements exist", () => {
      useAchievementStore.setState({
        achievements: [],
        totalSessions: 0,
        celebrationQueue: [],
        isLoading: false,
      });
      
      render(<AchievementGallery currentStreak={0} totalSessions={0} />);
      
      expect(screen.getByText(/No achievements available/)).toBeInTheDocument();
    });
  });

  describe("progress calculation", () => {
    it("shows progress for locked streak achievements", () => {
      render(<AchievementGallery currentStreak={10} totalSessions={5} />);
      
      expect(screen.getByText("10/14 days")).toBeInTheDocument();
    });

    it("shows progress for locked session achievements", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={25} />);
      
      expect(screen.getByText("25/50 sessions")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("uses bg-cozy-bg background", () => {
      render(<AchievementGallery currentStreak={7} totalSessions={5} />);
      
      const gallery = screen.getByTestId("achievement-gallery");
      expect(gallery).toHaveClass("bg-cozy-bg");
    });
  });
});
