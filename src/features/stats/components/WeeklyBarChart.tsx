import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { formatFocusTime } from "@/shared/lib/formatTime";
import { useWeeklyData, DayStats } from "../hooks/useWeeklyData";

const MAX_BAR_HEIGHT = 100;
const MIN_BAR_HEIGHT = 4;

interface BarTooltipProps {
  day: DayStats;
}

function BarTooltip({ day }: BarTooltipProps) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-cozy-surface rounded-lg shadow-lg z-10 whitespace-nowrap">
      <p className="font-medium text-cozy-text">
        {day.dayName} - {day.date}
      </p>
      <p className="text-sm text-cozy-muted">{formatFocusTime(day.focusMinutes)}</p>
      <p className="text-sm text-cozy-muted">
        {day.sessionCount} session{day.sessionCount !== 1 ? "s" : ""}
      </p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-cozy-surface" />
    </div>
  );
}

interface BarProps {
  day: DayStats;
  heightPx: number;
}

function Bar({ day, heightPx }: BarProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ height: `${MAX_BAR_HEIGHT}px` }}>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div
            data-testid={`bar-${day.dayName}`}
            className={cn(
              "w-8 rounded-t-md transition-all duration-200 bg-cozy-accent cursor-pointer",
              day.isToday ? "opacity-100" : "opacity-60",
              "hover:opacity-80"
            )}
            style={{ height: `${heightPx}px` }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && <BarTooltip day={day} />}
        </div>
      </div>
      <span className="text-xs text-cozy-muted">{day.dayName}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div data-testid="weekly-chart-loading" className="bg-cozy-surface rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 w-24 bg-cozy-muted/20 rounded animate-pulse" />
        <div className="h-4 w-16 bg-cozy-muted/20 rounded animate-pulse" />
      </div>
      <div className="flex justify-between items-end gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-8 bg-cozy-muted/20 rounded-t-md animate-pulse" style={{ height: `${20 + Math.random() * 60}px` }} />
            <div className="h-3 w-6 bg-cozy-muted/20 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeeklyBarChart() {
  const { days, weeklyTotalMinutes, isLoading } = useWeeklyData();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const maxMinutes = Math.max(...days.map((d) => d.focusMinutes), 60);

  const calculateBarHeight = (focusMinutes: number): number => {
    if (focusMinutes === 0) return MIN_BAR_HEIGHT;
    return Math.max((focusMinutes / maxMinutes) * MAX_BAR_HEIGHT, MIN_BAR_HEIGHT);
  };

  return (
    <div className="bg-cozy-surface rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-cozy-text">This Week</h3>
        <span className="text-sm text-cozy-muted">{formatFocusTime(weeklyTotalMinutes)} total</span>
      </div>
      <div className="flex justify-between items-end gap-2">
        {days.map((day) => (
          <Bar key={day.date} day={day} heightPx={calculateBarHeight(day.focusMinutes)} />
        ))}
      </div>
    </div>
  );
}
