import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTimerStore } from "../stores/timerStore";
import type { TimerStatus } from "../types";

interface TimerControlsProps {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

function getPrimaryAction(status: TimerStatus) {
  switch (status) {
    case "idle":
      return "start";
    case "focus":
    case "break":
      return "pause";
    case "paused":
      return "resume";
  }
}

export function TimerControls({
  onStart,
  onPause,
  onResume,
  onStop,
}: TimerControlsProps) {
  const status = useTimerStore((state) => state.status);
  const primaryAction = getPrimaryAction(status);
  const showStop = status !== "idle";

  return (
    <div className="flex items-center gap-4">
      {primaryAction === "start" && (
        <Button
          onClick={onStart}
          size="lg"
          className="rounded-xl bg-cozy-accent hover:bg-cozy-accent/90"
          aria-label="Start timer"
        >
          <Play className="size-5" />
          Start
        </Button>
      )}

      {primaryAction === "pause" && (
        <Button
          onClick={onPause}
          size="lg"
          className="rounded-xl"
          variant="secondary"
          aria-label="Pause timer"
        >
          <Pause className="size-5" />
          Pause
        </Button>
      )}

      {primaryAction === "resume" && (
        <Button
          onClick={onResume}
          size="lg"
          className="rounded-xl bg-cozy-accent hover:bg-cozy-accent/90"
          aria-label="Resume timer"
        >
          <Play className="size-5" />
          Resume
        </Button>
      )}

      {showStop && (
        <Button
          onClick={onStop}
          size="lg"
          variant="outline"
          className="rounded-xl"
          aria-label="Stop timer"
        >
          <Square className="size-5" />
          Stop
        </Button>
      )}
    </div>
  );
}
