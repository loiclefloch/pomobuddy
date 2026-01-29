import { Play, Square } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { TimerStatus } from "../types";

interface ActionButtonProps {
  status: TimerStatus;
  onStart: () => void;
  onStop: () => void;
  onResume: () => void;
}

export function ActionButton({
  status,
  onStart,
  onStop,
  onResume,
}: ActionButtonProps) {
  if (status === "idle") {
    return (
      <Button
        onClick={onStart}
        className="w-full bg-cozy-accent hover:bg-cozy-accent/90"
      >
        <Play className="w-4 h-4 mr-2" />
        Start Session
      </Button>
    );
  }

  if (status === "paused") {
    return (
      <Button
        onClick={onResume}
        className="w-full bg-cozy-accent hover:bg-cozy-accent/90"
      >
        <Play className="w-4 h-4 mr-2" />
        Resume
      </Button>
    );
  }

  return (
    <Button onClick={onStop} variant="secondary" className="w-full">
      <Square className="w-4 h-4 mr-2" />
      Stop
    </Button>
  );
}
