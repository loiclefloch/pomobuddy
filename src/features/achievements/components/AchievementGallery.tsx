import { useMemo, useCallback } from "react";
import { useAchievementStore, type AchievementWithStatus } from "../stores/achievementStore";
import { AchievementBadge } from "./AchievementBadge";
import { getProgress } from "../utils/achievementUtils";
import type { AchievementRequirementType } from "../types";

interface AchievementGalleryProps {
  currentStreak: number;
  totalSessions: number;
}

interface GroupedAchievements {
  streak: AchievementWithStatus[];
  sessions: AchievementWithStatus[];
}

function groupAndSortAchievements(
  achievements: AchievementWithStatus[]
): GroupedAchievements {
  const grouped: GroupedAchievements = {
    streak: [],
    sessions: [],
  };

  for (const achievement of achievements) {
    const type = achievement.requirement.type as AchievementRequirementType;
    if (type === "streak") {
      grouped.streak.push(achievement);
    } else {
      grouped.sessions.push(achievement);
    }
  }

  const sortByUnlockedFirst = (a: AchievementWithStatus, b: AchievementWithStatus) => {
    if (a.unlocked === b.unlocked) {
      return a.requirement.value - b.requirement.value;
    }
    return a.unlocked ? -1 : 1;
  };

  grouped.streak.sort(sortByUnlockedFirst);
  grouped.sessions.sort(sortByUnlockedFirst);

  return grouped;
}

function AchievementSection({
  title,
  achievements,
  testId,
  currentStreak,
  totalSessions,
  isAchievementNew,
  onAchievementViewed,
}: {
  title: string;
  achievements: AchievementWithStatus[];
  testId: string;
  currentStreak: number;
  totalSessions: number;
  isAchievementNew: (id: string) => boolean;
  onAchievementViewed: (id: string) => void;
}) {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <section data-testid={testId} className="mb-8">
      <h2 className="text-lg font-medium text-cozy-text mb-4">{title}</h2>
      <div
        data-testid="achievements-grid"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {achievements.map((achievement) => {
          const progress = achievement.unlocked
            ? null
            : getProgress(achievement.id, currentStreak, totalSessions);

          return (
            <AchievementBadge
              key={achievement.id}
              achievement={{
                id: achievement.id,
                title: achievement.title,
                description: achievement.description,
                icon: achievement.icon,
                tier: achievement.tier as "bronze" | "silver" | "gold" | "platinum",
                requirement: achievement.requirement as { type: "streak" | "sessions"; value: number },
              }}
              isUnlocked={achievement.unlocked}
              unlockedAt={achievement.unlockedAt}
              progress={progress}
              isNew={isAchievementNew(achievement.id)}
              onViewed={() => onAchievementViewed(achievement.id)}
            />
          );
        })}
      </div>
    </section>
  );
}

export function AchievementGallery({
  currentStreak,
  totalSessions,
}: AchievementGalleryProps) {
  const { achievements, isLoading, isAchievementNew, markAchievementViewed } = useAchievementStore();

  const grouped = useMemo(
    () => groupAndSortAchievements(achievements),
    [achievements]
  );

  const handleAchievementViewed = useCallback((id: string) => {
    markAchievementViewed(id);
  }, [markAchievementViewed]);

  if (isLoading) {
    return (
      <div
        data-testid="achievements-loading"
        className="flex items-center justify-center p-8"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cozy-accent" />
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div
        data-testid="achievement-gallery"
        className="bg-cozy-bg p-6 text-center"
      >
        <p className="text-cozy-muted">No achievements available</p>
      </div>
    );
  }

  return (
    <div data-testid="achievement-gallery" className="bg-cozy-bg p-6">
      <AchievementSection
        title="Streak Achievements"
        achievements={grouped.streak}
        testId="streak-achievements-section"
        currentStreak={currentStreak}
        totalSessions={totalSessions}
        isAchievementNew={isAchievementNew}
        onAchievementViewed={handleAchievementViewed}
      />
      <AchievementSection
        title="Session Achievements"
        achievements={grouped.sessions}
        testId="session-achievements-section"
        currentStreak={currentStreak}
        totalSessions={totalSessions}
        isAchievementNew={isAchievementNew}
        onAchievementViewed={handleAchievementViewed}
      />
    </div>
  );
}
