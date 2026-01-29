import { DaySection, DaySectionProps } from "./DaySection";

export interface DayHistory {
  date: string;
  sessions: DaySectionProps["sessions"];
}

export interface SessionHistoryProps {
  days: DayHistory[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function SessionHistory({
  days,
  isLoading,
  hasMore,
  onLoadMore,
}: SessionHistoryProps) {
  if (isLoading && days.length === 0) {
    return (
      <div className="text-cozy-muted text-center py-8">
        Loading history...
      </div>
    );
  }

  if (!isLoading && days.length === 0) {
    return (
      <div className="text-cozy-muted text-center py-8">
        No session history yet. Complete your first focus session!
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-96 space-y-4 pr-2">
      {days.map((day) => (
        <DaySection key={day.date} date={day.date} sessions={day.sessions} />
      ))}

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full py-2 text-sm text-cozy-accent hover:text-cozy-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
