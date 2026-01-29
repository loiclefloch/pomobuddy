import type { Achievement, UnlockedAchievement } from "../types";
import { ACHIEVEMENTS, ACHIEVEMENTS_BY_ID } from "../data/achievements";

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS_BY_ID.get(id);
}

export function isAchievementUnlocked(
  achievementId: string,
  unlockedAchievements: UnlockedAchievement[]
): boolean {
  return unlockedAchievements.some((ua) => ua.id === achievementId);
}

export interface AchievementProgress {
  current: number;
  target: number;
  percentage: number;
  isComplete: boolean;
}

export function getProgress(
  achievementId: string,
  currentStreak: number,
  totalSessions: number
): AchievementProgress | null {
  const achievement = getAchievementById(achievementId);
  if (!achievement) {
    return null;
  }

  const target = achievement.requirement.value;
  const current =
    achievement.requirement.type === "streak" ? currentStreak : totalSessions;
  const percentage = Math.min(100, Math.round((current / target) * 100));

  return {
    current,
    target,
    percentage,
    isComplete: current >= target,
  };
}

export function getUnlockedAchievements(
  unlockedIds: string[]
): (Achievement & { unlockedAt: string | null })[] {
  return unlockedIds
    .map((id) => {
      const achievement = getAchievementById(id);
      if (!achievement) return null;
      return { ...achievement, unlockedAt: null };
    })
    .filter((a): a is Achievement & { unlockedAt: string | null } => a !== null);
}

export function getLockedAchievements(unlockedIds: string[]): Achievement[] {
  const unlockedSet = new Set(unlockedIds);
  return ACHIEVEMENTS.filter((a) => !unlockedSet.has(a.id));
}
