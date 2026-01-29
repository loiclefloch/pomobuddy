export interface SessionHistoryItemProps {
  session: {
    startTime: string;
    endTime: string;
    durationSeconds: number;
    status: "complete" | "interrupted";
  };
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function SessionHistoryItem({ session }: SessionHistoryItemProps) {
  const startTime = formatTime(session.startTime);
  const endTime = formatTime(session.endTime);
  const durationMinutes = Math.floor(session.durationSeconds / 60);
  const isComplete = session.status === "complete";

  return (
    <div className="flex items-center justify-between py-2 px-3 text-sm">
      <span className="text-cozy-text font-mono">
        {startTime} - {endTime}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={isComplete ? "text-cozy-success" : "text-cozy-muted"}
        >
          {isComplete ? "✓" : "○"}
        </span>
        <span className="text-cozy-muted w-20">
          {isComplete ? "Complete" : "Interrupted"}
        </span>
        <span className="text-cozy-text font-mono w-10 text-right">
          {durationMinutes}m
        </span>
      </div>
    </div>
  );
}
