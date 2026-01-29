interface TimerRingProps {
  diameter?: number;
  strokeWidth?: number;
  progress: number;
  status: "idle" | "focus" | "break" | "paused";
  remainingSeconds?: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function TimerRing({
  diameter = 120,
  strokeWidth = 8,
  progress,
  status,
  remainingSeconds,
}: TimerRingProps) {
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const progressColor =
    status === "break" ? "var(--cozy-success)" : "var(--cozy-accent)";

  return (
    <div className="relative" style={{ width: diameter, height: diameter }}>
      <svg
        className="transform -rotate-90"
        width={diameter}
        height={diameter}
      >
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="var(--cozy-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {status === "idle" ? (
          <span className="text-cozy-muted text-lg">Start</span>
        ) : (
          <span className="text-cozy-text text-2xl font-mono">
            {formatTime(remainingSeconds ?? 0)}
          </span>
        )}
      </div>
    </div>
  );
}
