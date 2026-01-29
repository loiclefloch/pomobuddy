export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  unlockedAt: string | null;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string | null;
}
