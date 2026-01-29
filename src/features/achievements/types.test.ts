import { describe, it, expect } from "vitest";
import { TIER_COLORS } from "./types";
import type {
  Achievement,
  AchievementTier,
  UnlockedAchievement,
  TierColor,
} from "./types";

describe("TIER_COLORS", () => {
  it("has all four tiers", () => {
    expect(TIER_COLORS.bronze).toBeDefined();
    expect(TIER_COLORS.silver).toBeDefined();
    expect(TIER_COLORS.gold).toBeDefined();
    expect(TIER_COLORS.platinum).toBeDefined();
  });

  it("bronze has correct values", () => {
    expect(TIER_COLORS.bronze).toEqual({
      primary: "#CD7F32",
      glow: "subtle",
      animation: "none",
    });
  });

  it("silver has correct values", () => {
    expect(TIER_COLORS.silver).toEqual({
      primary: "#C0C0C0",
      glow: "medium",
      animation: "shimmer",
    });
  });

  it("gold has correct values", () => {
    expect(TIER_COLORS.gold).toEqual({
      primary: "#FFD700",
      glow: "strong",
      animation: "sparkle",
    });
  });

  it("platinum has correct values", () => {
    expect(TIER_COLORS.platinum).toEqual({
      primary: "#E5E4E2",
      glow: "intense",
      animation: "pulse",
    });
  });

  it("all tiers have valid hex color codes", () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    Object.values(TIER_COLORS).forEach((tier) => {
      expect(tier.primary).toMatch(hexPattern);
    });
  });
});

describe("Type definitions", () => {
  it("Achievement type is correctly shaped", () => {
    const achievement: Achievement = {
      id: "test_achievement",
      title: "Test Title",
      description: "Test description",
      icon: "Star",
      tier: "gold",
      requirement: { type: "sessions", value: 10 },
    };
    expect(achievement.id).toBe("test_achievement");
    expect(achievement.requirement.type).toBe("sessions");
  });

  it("UnlockedAchievement type is correctly shaped", () => {
    const unlocked: UnlockedAchievement = {
      id: "test_achievement",
      unlockedAt: "2026-01-29T10:00:00Z",
    };
    expect(unlocked.id).toBe("test_achievement");
    expect(unlocked.unlockedAt).toBe("2026-01-29T10:00:00Z");
  });

  it("AchievementTier type accepts valid values", () => {
    const tiers: AchievementTier[] = ["bronze", "silver", "gold", "platinum"];
    expect(tiers).toHaveLength(4);
  });

  it("TierColor type is correctly shaped", () => {
    const tierColor: TierColor = {
      primary: "#FFD700",
      glow: "strong",
      animation: "sparkle",
    };
    expect(tierColor.primary).toBe("#FFD700");
    expect(tierColor.glow).toBe("strong");
    expect(tierColor.animation).toBe("sparkle");
  });
});
