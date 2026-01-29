import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { TimerRing } from "@/features/timer/components/TimerRing";
import { ActionButton } from "@/features/timer/components/ActionButton";
import { QuickStats } from "@/features/stats/components/QuickStats";
import { useQuickStats } from "@/features/stats/hooks/useQuickStats";
import { TrayMenuItems } from "./components/TrayMenuItems";
import {
  openMainWindow,
  openMainWindowWithView,
  openSettingsWindow,
  quitApp,
} from "@/shared/utils/window";

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
  const { currentStreak, todaySessions, todayFocusMinutes } = useQuickStats();

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

  const handleStart = () => {
    invoke("start_timer").catch(console.error);
  };

  const handleStop = () => {
    invoke("stop_timer").catch(console.error);
  };

  const handleResume = () => {
    invoke("resume_timer").catch(console.error);
  };

  const handleOpenStats = () => {
    openMainWindow().catch(console.error);
  };

  const handleOpenAchievements = () => {
    openMainWindowWithView("achievements").catch(console.error);
  };

  const handleOpenSettings = () => {
    openSettingsWindow().catch(console.error);
  };

  const handleQuit = () => {
    quitApp().catch(console.error);
  };

  const totalSeconds = status === "break" ? BREAK_DURATION : FOCUS_DURATION;
  const progress =
    status === "idle"
      ? 0
      : ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="bg-cozy-bg min-h-screen p-5 flex flex-col items-center gap-4">
      <TimerRing
        progress={progress}
        status={status}
        remainingSeconds={remainingSeconds}
      />

      <div className="w-full h-px bg-cozy-border" />

      <QuickStats
        currentStreak={currentStreak}
        todaySessions={todaySessions}
        todayFocusMinutes={todayFocusMinutes}
      />

      <ActionButton
        status={status}
        onStart={handleStart}
        onStop={handleStop}
        onResume={handleResume}
      />

      <div className="w-full h-px bg-cozy-border" />

      <TrayMenuItems
        onOpenStats={handleOpenStats}
        onOpenAchievements={handleOpenAchievements}
        onOpenSettings={handleOpenSettings}
        onQuit={handleQuit}
      />
    </div>
  );
}
