export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export type AchievementRequirementType = "streak" | "sessions";

export interface AchievementRequirement {
  type: AchievementRequirementType;
  value: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  requirement: AchievementRequirement;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string | null;
}

export interface TierColor {
  primary: string;
  glow: "subtle" | "medium" | "strong" | "intense";
  animation: "none" | "shimmer" | "sparkle" | "pulse";
}

export const TIER_COLORS: Record<AchievementTier, TierColor> = {
  bronze: {
    primary: "#CD7F32",
    glow: "subtle",
    animation: "none",
  },
  silver: {
    primary: "#C0C0C0",
    glow: "medium",
    animation: "shimmer",
  },
  gold: {
    primary: "#FFD700",
    glow: "strong",
    animation: "sparkle",
  },
  platinum: {
    primary: "#E5E4E2",
    glow: "intense",
    animation: "pulse",
  },
};
