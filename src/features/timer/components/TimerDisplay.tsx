import { useTimerStore } from "../stores/timerStore";
import { formatDuration } from "@/shared/lib/formatTime";
import { cn } from "@/shared/lib/utils";
import type { TimerStatus } from "../types";

const statusStyles: Record<TimerStatus, string> = {
  idle: "text-cozy-muted",
  focus: "text-cozy-accent",
  break: "text-cozy-success",
  paused: "text-cozy-muted opacity-70",
};

export function TimerDisplay() {
  const { status, remainingSeconds } = useTimerStore();

  return (
    <div className="flex flex-col items-center gap-2">
      <time
        className={cn(
          "font-heading text-7xl tabular-nums tracking-tight",
          statusStyles[status]
        )}
        aria-label={`Timer: ${formatDuration(remainingSeconds)}`}
      >
        {formatDuration(remainingSeconds)}
      </time>
      {status !== "idle" && (
        <span className="text-sm text-cozy-muted capitalize">{status}</span>
      )}
    </div>
  );
}
