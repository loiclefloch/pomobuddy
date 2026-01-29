import { useState, useEffect } from "react";
import { Coffee, Trophy, ArrowLeft } from "lucide-react";
import { listen } from "@tauri-apps/api/event";
import { TimerDisplay, TimerControls, useTimer } from "@/features/timer";
import { TodayStats, SessionHistoryContainer, WeeklyBarChart } from "@/features/stats/components";
import { StreakCard, AchievementGallery } from "@/features/achievements/components";
import { useStreak, useAchievements } from "@/features/achievements/hooks";

type AppView = "timer" | "achievements";

function TimerView() {
  const { start, pause, resume, stop } = useTimer();
  const { currentStreak, longestStreak, isMilestone } = useStreak();

  return (
    <>
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
    </>
  );
}

function AchievementsView({ onBack }: { onBack: () => void }) {
  const { currentStreak } = useStreak();
  const { totalSessions } = useAchievements();

  return (
    <div className="w-full max-w-4xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cozy-muted hover:text-cozy-text transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        <span className="text-sm">Back to Timer</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Trophy className="size-6 text-cozy-accent" />
        <h1 className="text-2xl font-heading text-cozy-text">Achievements</h1>
      </div>

      <AchievementGallery currentStreak={currentStreak} totalSessions={totalSessions} />
    </div>
  );
}

function App() {
  const [view, setView] = useState<AppView>("timer");

  useEffect(() => {
    const unlistenShowAchievements = listen("show-achievements", () => {
      setView("achievements");
    });

    return () => {
      unlistenShowAchievements.then((fn) => fn());
    };
  }, []);

  const handleShowAchievements = () => setView("achievements");
  const handleBackToTimer = () => setView("timer");

  return (
    <main className="min-h-screen bg-cozy-bg flex flex-col items-center p-8">
      {view === "timer" && (
        <>
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-heading text-cozy-text">test-bmad</h1>
            <Coffee className="size-8 text-cozy-success" />
          </div>

          <button
            onClick={handleShowAchievements}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-cozy-surface transition-colors"
            aria-label="View Achievements"
          >
            <Trophy className="size-5 text-cozy-muted hover:text-cozy-accent" />
          </button>

          <TimerView />

          <p className="mt-8 text-sm text-cozy-muted">Your cozy focus companion</p>
        </>
      )}

      {view === "achievements" && <AchievementsView onBack={handleBackToTimer} />}
    </main>
  );
}

export default App;
