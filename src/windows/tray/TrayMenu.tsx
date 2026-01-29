import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { TimerRing } from "@/features/timer/components/TimerRing";

interface TimerState {
  status: "idle" | "focus" | "break" | "paused";
  remainingSeconds: number;
}

interface TimerTickPayload {
  remainingSeconds: number;
  status: string;
}

const FOCUS_DURATION = 1500;
const BREAK_DURATION = 300;

export default function TrayMenu() {
  const [status, setStatus] = useState<TimerState["status"]>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    invoke<{ status: string; remaining_seconds: number }>("get_timer_state")
      .then((state) => {
        setStatus(state.status as TimerState["status"]);
        setRemainingSeconds(state.remaining_seconds);
      })
      .catch(console.error);

    const unlisten = listen<TimerTickPayload>("TimerTick", (event) => {
      setStatus(event.payload.status as TimerState["status"]);
      setRemainingSeconds(event.payload.remainingSeconds);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const totalSeconds = status === "break" ? BREAK_DURATION : FOCUS_DURATION;
  const progress =
    status === "idle"
      ? 0
      : ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="bg-cozy-bg min-h-screen p-5 flex flex-col items-center">
      <TimerRing
        progress={progress}
        status={status}
        remainingSeconds={remainingSeconds}
      />
    </div>
  );
}
