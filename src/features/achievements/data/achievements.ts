import type { Achievement } from "../types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_session",
    title: "First Focus",
    description: "Complete your first session",
    icon: "Flame",
    tier: "bronze",
    requirement: { type: "sessions", value: 1 },
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "7-day streak",
    icon: "Zap",
    tier: "silver",
    requirement: { type: "streak", value: 7 },
  },
  {
    id: "streak_14",
    title: "Fortnight Focus",
    description: "14-day streak",
    icon: "Award",
    tier: "gold",
    requirement: { type: "streak", value: 14 },
  },
  {
    id: "streak_30",
    title: "Monthly Master",
    description: "30-day streak",
    icon: "Crown",
    tier: "platinum",
    requirement: { type: "streak", value: 30 },
  },
  {
    id: "sessions_10",
    title: "Getting Started",
    description: "10 total sessions",
    icon: "Target",
    tier: "bronze",
    requirement: { type: "sessions", value: 10 },
  },
  {
    id: "sessions_50",
    title: "Half Century",
    description: "50 total sessions",
    icon: "Trophy",
    tier: "silver",
    requirement: { type: "sessions", value: 50 },
  },
  {
    id: "sessions_100",
    title: "Centurion",
    description: "100 total sessions",
    icon: "Medal",
    tier: "gold",
    requirement: { type: "sessions", value: 100 },
  },
  {
    id: "sessions_500",
    title: "Focus Legend",
    description: "500 total sessions",
    icon: "Crown",
    tier: "platinum",
    requirement: { type: "sessions", value: 500 },
  },
];

export const ACHIEVEMENTS_BY_ID = new Map(
  ACHIEVEMENTS.map((achievement) => [achievement.id, achievement])
);
