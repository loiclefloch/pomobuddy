import { describe, it, expect } from "vitest";
import { ACHIEVEMENTS, ACHIEVEMENTS_BY_ID } from "./achievements";

describe("ACHIEVEMENTS", () => {
  it("contains 8 achievements total", () => {
    expect(ACHIEVEMENTS).toHaveLength(8);
  });

  it("has unique ids", () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ACHIEVEMENTS.length);
  });

  it("all achievements have required fields", () => {
    ACHIEVEMENTS.forEach((achievement) => {
      expect(achievement.id).toBeTruthy();
      expect(achievement.title).toBeTruthy();
      expect(achievement.description).toBeTruthy();
      expect(achievement.icon).toBeTruthy();
      expect(["bronze", "silver", "gold", "platinum"]).toContain(
        achievement.tier
      );
      expect(achievement.requirement).toBeDefined();
      expect(["streak", "sessions"]).toContain(achievement.requirement.type);
      expect(achievement.requirement.value).toBeGreaterThan(0);
    });
  });

  describe("streak achievements", () => {
    it("first_session has correct values", () => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === "first_session");
      expect(achievement).toEqual({
        id: "first_session",
        title: "First Focus",
        description: "Complete your first session",
        icon: "Flame",
        tier: "bronze",
        requirement: { type: "sessions", value: 1 },
      });
    });

    it("streak_7 has correct values", () => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === "streak_7");
      expect(achievement).toEqual({
        id: "streak_7",
        title: "Week Warrior",
        description: "7-day streak",
        icon: "Zap",
        tier: "silver",
        requirement: { type: "streak", value: 7 },
      });
    });

    it("streak_14 has correct values", () => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === "streak_14");
      expect(achievement).toEqual({
        id: "streak_14",
        title: "Fortnight Focus",
        description: "14-day streak",
        icon: "Award",
        tier: "gold",
        requirement: { type: "streak", value: 14 },
      });
    });

    it("streak_30 has correct values", () => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === "streak_30");
      expect(achievement).toEqual({
        id: "streak_30",
        title: "Monthly Master",
        description: "30-day streak",
        icon: "Crown",
        tier: "platinum",
        requirement: { type: "streak", value: 30 },
      });
    });
  });

  describe("session count achievements", () => {
    it("sessions_10 has correct values", () => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === "sessions_10");
      expect(achievement).toEqual({
        id: "sessions_10",
        title: "Getting Started",
        description: "10 total sessions",
        icon: "Target",
        tier: "bronze",
        requirement: { type: "sessions", value: 10 },
      });
    });

    it("sessions_50 has correct values", () => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === "sessions_50");
      expect(achievement).toEqual({
        id: "sessions_50",
        title: "Half Century",
        description: "50 total sessions",
        icon: "Trophy",
        tier: "silver",
        requirement: { type: "sessions", value: 50 },
      });
    });

    it("sessions_100 has correct values", () => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === "sessions_100");
      expect(achievement).toEqual({
        id: "sessions_100",
        title: "Centurion",
        description: "100 total sessions",
        icon: "Medal",
        tier: "gold",
        requirement: { type: "sessions", value: 100 },
      });
    });

    it("sessions_500 has correct values", () => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === "sessions_500");
      expect(achievement).toEqual({
        id: "sessions_500",
        title: "Focus Legend",
        description: "500 total sessions",
        icon: "Crown",
        tier: "platinum",
        requirement: { type: "sessions", value: 500 },
      });
    });
  });
});

describe("ACHIEVEMENTS_BY_ID", () => {
  it("contains all achievements", () => {
    expect(ACHIEVEMENTS_BY_ID.size).toBe(ACHIEVEMENTS.length);
  });

  it("provides O(1) lookup by id", () => {
    expect(ACHIEVEMENTS_BY_ID.get("first_session")?.title).toBe("First Focus");
    expect(ACHIEVEMENTS_BY_ID.get("streak_7")?.title).toBe("Week Warrior");
    expect(ACHIEVEMENTS_BY_ID.get("sessions_100")?.title).toBe("Centurion");
  });

  it("returns undefined for non-existent id", () => {
    expect(ACHIEVEMENTS_BY_ID.get("non_existent")).toBeUndefined();
  });
});
