import { getDateLabel } from "@/shared/lib/dateUtils";
import {
  SessionHistoryItem,
  SessionHistoryItemProps,
} from "./SessionHistoryItem";

export interface DaySectionProps {
  date: string;
  sessions: SessionHistoryItemProps["session"][];
}

function formatTotalTime(totalMinutes: number): string {
  if (totalMinutes === 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function DaySection({ date, sessions }: DaySectionProps) {
  const dateLabel = getDateLabel(date);
  const sessionCount = sessions.length;
  const totalMinutes = sessions.reduce(
    (sum, s) => sum + Math.floor(s.durationSeconds / 60),
    0
  );

  return (
    <section className="bg-cozy-surface rounded-xl p-4">
      <header className="flex items-center justify-between mb-3 pb-2 border-b border-cozy-muted/20">
        <h3 className="text-cozy-text font-medium">{dateLabel}</h3>
        <span className="text-cozy-muted text-sm">
          {sessionCount === 0
            ? "No sessions"
            : `${sessionCount} session${sessionCount !== 1 ? "s" : ""}`}
        </span>
      </header>

      {sessions.length === 0 ? (
        <p className="text-cozy-muted text-sm py-2">No sessions</p>
      ) : (
        <>
          <div className="space-y-1">
            {sessions.map((session, index) => (
              <SessionHistoryItem key={index} session={session} />
            ))}
          </div>

          <footer className="mt-3 pt-2 border-t border-cozy-muted/20 text-sm text-cozy-muted">
            Total: {formatTotalTime(totalMinutes)}
          </footer>
        </>
      )}
    </section>
  );
}
