import { Coffee } from "lucide-react";
import { TimerDisplay, TimerControls, useTimer } from "@/features/timer";
import { TodayStats, SessionHistoryContainer, WeeklyBarChart } from "@/features/stats/components";
import { StreakCard } from "@/features/achievements/components";
import { useStreak } from "@/features/achievements/hooks";

function App() {
  const { start, pause, resume, stop } = useTimer();
  const { currentStreak, longestStreak, isMilestone } = useStreak();

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

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <TodayStats />
        <StreakCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          isMilestone={isMilestone}
        />
      </div>

      <div className="mt-6 w-full max-w-md">
        <WeeklyBarChart />
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
