import { useState } from "react";
import * as Icons from "lucide-react";
import type { Achievement, AchievementTier } from "../types";
import type { AchievementProgress } from "../utils/achievementUtils";
import { cn } from "@/shared/lib/utils";

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: string | null;
  progress?: AchievementProgress | null;
  isNew?: boolean;
  onViewed?: () => void;
}

const tierStyles: Record<AchievementTier, { border: string; glow: string; iconColor: string }> = {
  bronze: {
    border: "border-[#CD7F32]/30",
    glow: "",
    iconColor: "text-[#CD7F32]",
  },
  silver: {
    border: "border-[#C0C0C0]/40",
    glow: "shadow-[0_0_8px_rgba(192,192,192,0.3)]",
    iconColor: "text-[#C0C0C0]",
  },
  gold: {
    border: "border-[#FFD700]/50",
    glow: "shadow-[0_0_12px_rgba(255,215,0,0.4)]",
    iconColor: "text-[#FFD700]",
  },
  platinum: {
    border: "border-[#E5E4E2]/60",
    glow: "shadow-[0_0_16px_rgba(229,228,226,0.5)]",
    iconColor: "text-[#E5E4E2]",
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatProgress(
  progress: AchievementProgress,
  requirementType: "streak" | "sessions"
): string {
  const unit = requirementType === "streak" ? "days" : "sessions";
  return `${progress.current}/${progress.target} ${unit}`;
}

function getIcon(iconName: string): React.ComponentType<{ className?: string }> | null {
  const IconComponent = (Icons as Record<string, unknown>)[iconName];
  if (typeof IconComponent === "function") {
    return IconComponent as React.ComponentType<{ className?: string }>;
  }
  return Icons.Award;
}

export function AchievementBadge({
  achievement,
  isUnlocked,
  unlockedAt,
  progress,
  isNew = false,
  onViewed,
}: AchievementBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tier = achievement.tier;
  const styles = tierStyles[tier];
  const Icon = getIcon(achievement.icon);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    if (isNew && onViewed) {
      onViewed();
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      data-testid="achievement-badge"
      className={cn(
        "bg-cozy-surface rounded-xl p-4 relative border transition-all duration-200",
        "hover:bg-cozy-elevated hover:scale-[1.02]",
        isUnlocked ? styles.border : "border-cozy-border/20",
        isUnlocked && styles.glow,
        !isUnlocked && "opacity-50"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isNew && isUnlocked && (
        <div
          data-testid="new-indicator"
          className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-cozy-accent text-cozy-bg text-xs font-bold rounded-md animate-pulse"
        >
          NEW
        </div>
      )}

      <div
        data-testid="achievement-icon-container"
        className={cn(
          "flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full",
          isUnlocked ? "bg-cozy-elevated" : "bg-cozy-border/20 grayscale"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "size-6",
              isUnlocked ? styles.iconColor : "text-cozy-muted"
            )}
          />
        )}
      </div>

      <h3 className={cn(
        "text-sm font-medium text-center mb-1",
        isUnlocked ? "text-cozy-text" : "text-cozy-muted"
      )}>
        {achievement.title}
      </h3>

      <p className="text-xs text-cozy-muted text-center">
        {isUnlocked && unlockedAt
          ? formatDate(unlockedAt)
          : progress
          ? formatProgress(progress, achievement.requirement.type)
          : null}
      </p>

      {showTooltip && !isUnlocked && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-cozy-elevated rounded-lg text-xs text-cozy-text whitespace-nowrap z-10 shadow-lg">
          {achievement.description}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-cozy-elevated" />
        </div>
      )}
    </div>
  );
}
