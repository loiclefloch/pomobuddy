import { Flame } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  isMilestone?: boolean;
}

function formatStreakValue(days: number): string {
  if (days === 0) return "Start streak!";
  return `${days} ${days === 1 ? "day" : "days"}`;
}

function formatBestStreak(days: number): string {
  return `Best: ${days} ${days === 1 ? "day" : "days"}`;
}

function getStreakLabel(currentStreak: number, longestStreak: number): string {
  if (currentStreak === 0 && longestStreak === 0) return "Ready to begin?";
  if (currentStreak === 0) return "Current Streak";
  return "Current Streak";
}

export function StreakCard({
  currentStreak,
  longestStreak,
  isMilestone = false,
}: StreakCardProps) {
  const showMilestone = isMilestone && currentStreak > 0;

  return (
    <div
      data-testid="streak-card"
      className={`bg-cozy-surface rounded-xl p-5 relative ${
        showMilestone ? "ring-2 ring-cozy-accent/30" : ""
      }`}
    >
      {showMilestone && (
        <div
          data-testid="milestone-indicator"
          className="absolute -top-1 -right-1 size-4 bg-cozy-accent rounded-full animate-pulse"
        />
      )}

      <div className="flex items-center gap-3">
        <Flame
          className={`size-6 ${
            currentStreak > 0 ? "text-cozy-accent" : "text-cozy-muted"
          }`}
        />
        <span className="text-3xl font-bold text-cozy-text">
          {formatStreakValue(currentStreak)}
        </span>
      </div>

      <p className="text-sm text-cozy-muted mt-1">
        {getStreakLabel(currentStreak, longestStreak)}
      </p>

      <p className="text-xs text-cozy-muted/70 mt-1">
        {formatBestStreak(longestStreak)}
      </p>
    </div>
  );
}
