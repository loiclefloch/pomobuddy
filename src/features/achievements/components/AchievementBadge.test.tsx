import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AchievementBadge } from "./AchievementBadge";
import type { AchievementTier } from "../types";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

describe("AchievementBadge", () => {
  const mockUnlockedAchievement = {
    id: "streak_7",
    title: "Week Warrior",
    description: "7-day streak",
    icon: "Zap",
    tier: "silver" as AchievementTier,
    requirement: { type: "streak" as const, value: 7 },
  };

  const mockLockedAchievement = {
    id: "streak_30",
    title: "Monthly Master",
    description: "30-day streak",
    icon: "Crown",
    tier: "platinum" as AchievementTier,
    requirement: { type: "streak" as const, value: 30 },
  };

  describe("unlocked state", () => {
    it("renders achievement title", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
        />
      );
      expect(screen.getByText("Week Warrior")).toBeInTheDocument();
    });

    it("displays unlock date for unlocked achievement", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
        />
      );
      expect(screen.getByText(/Jan 15/)).toBeInTheDocument();
    });

    it("renders icon", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
        />
      );
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("has full opacity when unlocked", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
        />
      );
      const badge = screen.getByTestId("achievement-badge");
      expect(badge).not.toHaveClass("opacity-50");
      expect(badge).not.toHaveClass("opacity-60");
    });

    it("does not show progress for unlocked achievements", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
          progress={{ current: 7, target: 7, percentage: 100, isComplete: true }}
        />
      );
      expect(screen.queryByText(/\/7/)).not.toBeInTheDocument();
    });
  });

  describe("locked state", () => {
    it("renders achievement title when locked", () => {
      render(
        <AchievementBadge
          achievement={mockLockedAchievement}
          isUnlocked={false}
          progress={{ current: 5, target: 30, percentage: 17, isComplete: false }}
        />
      );
      expect(screen.getByText("Monthly Master")).toBeInTheDocument();
    });

    it("shows progress for locked achievements", () => {
      render(
        <AchievementBadge
          achievement={mockLockedAchievement}
          isUnlocked={false}
          progress={{ current: 5, target: 30, percentage: 17, isComplete: false }}
        />
      );
      expect(screen.getByText("5/30 days")).toBeInTheDocument();
    });

    it("shows sessions progress for session achievements", () => {
      const sessionAchievement = {
        ...mockLockedAchievement,
        id: "sessions_100",
        requirement: { type: "sessions" as const, value: 100 },
      };
      render(
        <AchievementBadge
          achievement={sessionAchievement}
          isUnlocked={false}
          progress={{ current: 45, target: 100, percentage: 45, isComplete: false }}
        />
      );
      expect(screen.getByText("45/100 sessions")).toBeInTheDocument();
    });

    it("has reduced opacity when locked", () => {
      render(
        <AchievementBadge
          achievement={mockLockedAchievement}
          isUnlocked={false}
          progress={{ current: 5, target: 30, percentage: 17, isComplete: false }}
        />
      );
      const badge = screen.getByTestId("achievement-badge");
      expect(badge).toHaveClass("opacity-50");
    });

    it("has grayscale filter when locked", () => {
      render(
        <AchievementBadge
          achievement={mockLockedAchievement}
          isUnlocked={false}
          progress={{ current: 5, target: 30, percentage: 17, isComplete: false }}
        />
      );
      const iconContainer = screen.getByTestId("achievement-icon-container");
      expect(iconContainer).toHaveClass("grayscale");
    });

    it("does not show unlock date when locked", () => {
      render(
        <AchievementBadge
          achievement={mockLockedAchievement}
          isUnlocked={false}
          progress={{ current: 5, target: 30, percentage: 17, isComplete: false }}
        />
      );
      expect(screen.queryByText(/Jan/)).not.toBeInTheDocument();
    });
  });

  describe("tier coloring", () => {
    const tiers: AchievementTier[] = ["bronze", "silver", "gold", "platinum"];

    tiers.forEach((tier) => {
      it(`applies ${tier} tier styling`, () => {
        const achievement = { ...mockUnlockedAchievement, tier };
        render(
          <AchievementBadge
            achievement={achievement}
            isUnlocked={true}
            unlockedAt="2026-01-15T10:00:00Z"
          />
        );
        const badge = screen.getByTestId("achievement-badge");
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe("hover state", () => {
    it("shows tooltip with description on hover for locked achievement", () => {
      render(
        <AchievementBadge
          achievement={mockLockedAchievement}
          isUnlocked={false}
          progress={{ current: 5, target: 30, percentage: 17, isComplete: false }}
        />
      );
      const badge = screen.getByTestId("achievement-badge");
      fireEvent.mouseEnter(badge);
      expect(screen.getByText("30-day streak")).toBeInTheDocument();
    });
  });

  describe("NEW indicator", () => {
    it("shows NEW indicator when isNew is true", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
          isNew={true}
        />
      );
      expect(screen.getByTestId("new-indicator")).toBeInTheDocument();
    });

    it("does not show NEW indicator when isNew is false", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
          isNew={false}
        />
      );
      expect(screen.queryByTestId("new-indicator")).not.toBeInTheDocument();
    });

    it("does not show NEW indicator for locked achievements", () => {
      render(
        <AchievementBadge
          achievement={mockLockedAchievement}
          isUnlocked={false}
          isNew={true}
          progress={{ current: 5, target: 30, percentage: 17, isComplete: false }}
        />
      );
      expect(screen.queryByTestId("new-indicator")).not.toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("uses bg-cozy-surface background", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
        />
      );
      const badge = screen.getByTestId("achievement-badge");
      expect(badge).toHaveClass("bg-cozy-surface");
    });

    it("uses rounded-xl border radius", () => {
      render(
        <AchievementBadge
          achievement={mockUnlockedAchievement}
          isUnlocked={true}
          unlockedAt="2026-01-15T10:00:00Z"
        />
      );
      const badge = screen.getByTestId("achievement-badge");
      expect(badge).toHaveClass("rounded-xl");
    });
  });
});
