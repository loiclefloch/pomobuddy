import { Coffee } from "lucide-react";
import { TimerDisplay, TimerControls, useTimer } from "@/features/timer";
import { TodayStats, SessionHistoryContainer } from "@/features/stats/components";

function App() {
  const { start, pause, resume, stop } = useTimer();

  return (
    <main className="min-h-screen bg-cozy-bg flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-heading text-cozy-text">test-bmad</h1>
        <Coffee className="size-8 text-cozy-success" />
      </div>

      <div className="flex flex-col items-center gap-8">
        <TimerDisplay />
        <TimerControls
          onStart={start}
          onPause={pause}
          onResume={resume}
          onStop={stop}
        />
      </div>

      <div className="mt-8">
        <TodayStats />
      </div>

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-cozy-text mb-4">Session History</h2>
        <SessionHistoryContainer />
      </div>

      <p className="mt-8 text-sm text-cozy-muted">Your cozy focus companion</p>
    </main>
  );
}

export default App;
