import { Target, Clock } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useStats } from "../hooks/useStats";
import { formatFocusTime } from "@/shared/lib/formatTime";

export function TodayStats() {
  const { sessionsToday, focusTimeToday } = useStats();

  return (
    <div className="flex gap-4">
      <StatsCard
        icon={<Target className="size-6 text-cozy-accent" />}
        value={sessionsToday.toString()}
        label="Sessions Today"
      />
      <StatsCard
        icon={<Clock className="size-6 text-cozy-accent" />}
        value={formatFocusTime(focusTimeToday)}
        label="Focus Time"
      />
    </div>
  );
}
