import { useTimerStore } from "../stores/timerStore";
import { formatDuration } from "@/shared/lib/formatTime";
import { cn } from "@/shared/lib/utils";
import type { TimerStatus } from "../types";

const statusConfig: Record<
  TimerStatus,
  { timeClass: string; labelClass: string; label: string }
> = {
  idle: {
    timeClass: "text-cozy-muted",
    labelClass: "text-cozy-muted",
    label: "Ready",
  },
  focus: {
    timeClass: "text-cozy-accent",
    labelClass: "text-cozy-accent",
    label: "Focus",
  },
  break: {
    timeClass: "text-cozy-success",
    labelClass: "text-cozy-success",
    label: "Break",
  },
  paused: {
    timeClass: "text-cozy-muted opacity-70",
    labelClass: "text-cozy-muted",
    label: "Paused",
  },
};

function getAriaLabel(status: TimerStatus, formattedTime: string): string {
  const minutes = formattedTime.split(":")[0];
  const seconds = formattedTime.split(":")[1];

  if (status === "idle") {
    return "Timer ready to start";
  }

  if (status === "break") {
    return `Break time remaining: ${minutes} minutes ${seconds} seconds`;
  }

  if (status === "focus") {
    return `Focus time remaining: ${minutes} minutes ${seconds} seconds`;
  }

  return `Timer paused at ${minutes} minutes ${seconds} seconds`;
}

export function TimerDisplay() {
  const { status, remainingSeconds } = useTimerStore();
  const formattedTime = formatDuration(remainingSeconds);
  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center gap-2">
      <time
        className={cn(
          "font-heading text-7xl tabular-nums tracking-tight transition-colors duration-300 motion-reduce:transition-none",
          config.timeClass
        )}
        aria-label={getAriaLabel(status, formattedTime)}
        aria-live="polite"
      >
        {formattedTime}
      </time>
      {status !== "idle" && (
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-300 motion-reduce:transition-none",
            config.labelClass
          )}
          aria-hidden="true"
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
