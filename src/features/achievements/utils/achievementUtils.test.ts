import { describe, it, expect } from "vitest";
import {
  getAchievementById,
  isAchievementUnlocked,
  getProgress,
  getUnlockedAchievements,
  getLockedAchievements,
} from "./achievementUtils";
import { ACHIEVEMENTS } from "../data/achievements";
import type { UnlockedAchievement } from "../types";

describe("getAchievementById", () => {
  it("returns achievement when id exists", () => {
    const achievement = getAchievementById("first_session");
    expect(achievement).toBeDefined();
    expect(achievement?.title).toBe("First Focus");
    expect(achievement?.tier).toBe("bronze");
  });

  it("returns undefined for non-existent id", () => {
    const achievement = getAchievementById("non_existent");
    expect(achievement).toBeUndefined();
  });

  it("returns correct data for streak achievement", () => {
    const achievement = getAchievementById("streak_7");
    expect(achievement).toBeDefined();
    expect(achievement?.title).toBe("Week Warrior");
    expect(achievement?.requirement.type).toBe("streak");
    expect(achievement?.requirement.value).toBe(7);
  });

  it("returns correct data for session achievement", () => {
    const achievement = getAchievementById("sessions_100");
    expect(achievement).toBeDefined();
    expect(achievement?.title).toBe("Centurion");
    expect(achievement?.requirement.type).toBe("sessions");
    expect(achievement?.requirement.value).toBe(100);
  });
});

describe("isAchievementUnlocked", () => {
  const unlockedAchievements: UnlockedAchievement[] = [
    { id: "first_session", unlockedAt: "2026-01-15T10:00:00Z" },
    { id: "sessions_10", unlockedAt: "2026-01-20T14:30:00Z" },
  ];

  it("returns true for unlocked achievement", () => {
    expect(isAchievementUnlocked("first_session", unlockedAchievements)).toBe(
      true
    );
    expect(isAchievementUnlocked("sessions_10", unlockedAchievements)).toBe(
      true
    );
  });

  it("returns false for locked achievement", () => {
    expect(isAchievementUnlocked("streak_7", unlockedAchievements)).toBe(false);
    expect(isAchievementUnlocked("sessions_500", unlockedAchievements)).toBe(
      false
    );
  });

  it("returns false for empty unlocked list", () => {
    expect(isAchievementUnlocked("first_session", [])).toBe(false);
  });
});

describe("getProgress", () => {
  it("calculates streak progress correctly", () => {
    const progress = getProgress("streak_7", 3, 50);
    expect(progress).toEqual({
      current: 3,
      target: 7,
      percentage: 43,
      isComplete: false,
    });
  });

  it("calculates session progress correctly", () => {
    const progress = getProgress("sessions_100", 5, 75);
    expect(progress).toEqual({
      current: 75,
      target: 100,
      percentage: 75,
      isComplete: false,
    });
  });

  it("marks achievement as complete when target reached", () => {
    const progress = getProgress("streak_7", 10, 50);
    expect(progress?.isComplete).toBe(true);
    expect(progress?.percentage).toBe(100);
  });

  it("caps percentage at 100", () => {
    const progress = getProgress("sessions_10", 5, 25);
    expect(progress?.percentage).toBe(100);
  });

  it("returns null for non-existent achievement", () => {
    const progress = getProgress("non_existent", 5, 50);
    expect(progress).toBeNull();
  });

  it("handles zero values", () => {
    const progress = getProgress("streak_7", 0, 0);
    expect(progress).toEqual({
      current: 0,
      target: 7,
      percentage: 0,
      isComplete: false,
    });
  });
});

describe("getUnlockedAchievements", () => {
  it("returns empty array for no unlocked ids", () => {
    const unlocked = getUnlockedAchievements([]);
    expect(unlocked).toEqual([]);
  });

  it("returns achievements for valid ids", () => {
    const unlocked = getUnlockedAchievements(["first_session", "streak_7"]);
    expect(unlocked).toHaveLength(2);
    expect(unlocked[0].id).toBe("first_session");
    expect(unlocked[1].id).toBe("streak_7");
  });

  it("filters out invalid ids", () => {
    const unlocked = getUnlockedAchievements([
      "first_session",
      "invalid_id",
      "streak_7",
    ]);
    expect(unlocked).toHaveLength(2);
  });
});

describe("getLockedAchievements", () => {
  it("returns all achievements when none unlocked", () => {
    const locked = getLockedAchievements([]);
    expect(locked).toHaveLength(ACHIEVEMENTS.length);
  });

  it("excludes unlocked achievements", () => {
    const locked = getLockedAchievements(["first_session", "streak_7"]);
    expect(locked).toHaveLength(ACHIEVEMENTS.length - 2);
    expect(locked.find((a) => a.id === "first_session")).toBeUndefined();
    expect(locked.find((a) => a.id === "streak_7")).toBeUndefined();
  });

  it("returns empty when all unlocked", () => {
    const allIds = ACHIEVEMENTS.map((a) => a.id);
    const locked = getLockedAchievements(allIds);
    expect(locked).toHaveLength(0);
  });
});

describe("Achievement definitions", () => {
  it("has all required streak achievements", () => {
    const streakIds = ["first_session", "streak_7", "streak_14", "streak_30"];
    streakIds.forEach((id) => {
      expect(getAchievementById(id)).toBeDefined();
    });
  });

  it("has all required session achievements", () => {
    const sessionIds = [
      "sessions_10",
      "sessions_50",
      "sessions_100",
      "sessions_500",
    ];
    sessionIds.forEach((id) => {
      expect(getAchievementById(id)).toBeDefined();
    });
  });

  it("has correct tier progression for streaks", () => {
    expect(getAchievementById("first_session")?.tier).toBe("bronze");
    expect(getAchievementById("streak_7")?.tier).toBe("silver");
    expect(getAchievementById("streak_14")?.tier).toBe("gold");
    expect(getAchievementById("streak_30")?.tier).toBe("platinum");
  });

  it("has correct tier progression for sessions", () => {
    expect(getAchievementById("sessions_10")?.tier).toBe("bronze");
    expect(getAchievementById("sessions_50")?.tier).toBe("silver");
    expect(getAchievementById("sessions_100")?.tier).toBe("gold");
    expect(getAchievementById("sessions_500")?.tier).toBe("platinum");
  });

  it("has icons assigned to all achievements", () => {
    ACHIEVEMENTS.forEach((achievement) => {
      expect(achievement.icon).toBeTruthy();
      expect(typeof achievement.icon).toBe("string");
    });
  });
});
