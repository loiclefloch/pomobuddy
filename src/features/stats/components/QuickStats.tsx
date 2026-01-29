import { Flame, Clock, Coffee } from "lucide-react";

interface QuickStatsProps {
  currentStreak: number;
  todaySessions: number;
  todayFocusMinutes: number;
}

function formatFocusTime(minutes: number): string {
  if (minutes === 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function formatStreak(days: number): string {
  if (days === 0) return "Start streak!";
  return `Day ${days}`;
}

export function QuickStats({
  currentStreak,
  todaySessions,
  todayFocusMinutes,
}: QuickStatsProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3">
        <Flame className="size-4 text-cozy-muted" />
        <span className="text-sm text-cozy-text font-medium">
          {formatStreak(currentStreak)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Clock className="size-4 text-cozy-muted" />
        <span className="text-sm text-cozy-text font-medium">
          {todaySessions} {todaySessions === 1 ? "session" : "sessions"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Coffee className="size-4 text-cozy-muted" />
        <span className="text-sm text-cozy-text font-medium">
          {formatFocusTime(todayFocusMinutes)}
        </span>
      </div>
    </div>
  );
}
