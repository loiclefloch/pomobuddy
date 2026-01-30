import { useEffect, useState, useCallback } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useAchievementStore } from "../stores/achievementStore";
import type { AchievementTier } from "../types";
import { cn } from "@/shared/lib/utils";
import { ParticleSystem } from "./ParticleSystem";
import { SimpleCelebration } from "./SimpleCelebration";

export type ParticleType = "sparkle" | "confetti" | "confetti-rain" | "fireworks";

interface CelebrationConfig {
  duration: number;
  particleCount: number;
  particleType: ParticleType;
}

const CELEBRATION_CONFIG: Record<AchievementTier, CelebrationConfig> = {
  bronze: {
    duration: 3000,
    particleCount: 20,
    particleType: "sparkle",
  },
  silver: {
    duration: 4000,
    particleCount: 40,
    particleType: "confetti",
  },
  gold: {
    duration: 5000,
    particleCount: 60,
    particleType: "confetti-rain",
  },
  platinum: {
    duration: 6000,
    particleCount: 100,
    particleType: "fireworks",
  },
};

const tierGlowStyles: Record<AchievementTier, string> = {
  bronze: "shadow-[0_0_30px_rgba(205,127,50,0.5)]",
  silver: "shadow-[0_0_40px_rgba(192,192,192,0.6)]",
  gold: "shadow-[0_0_50px_rgba(255,215,0,0.7)]",
  platinum: "shadow-[0_0_60px_rgba(229,228,226,0.8)]",
};

const tierIconColors: Record<AchievementTier, string> = {
  bronze: "text-[#CD7F32]",
  silver: "text-[#C0C0C0]",
  gold: "text-[#FFD700]",
  platinum: "text-[#E5E4E2]",
};

function getIcon(iconName: string): React.ComponentType<{ className?: string }> | null {
  const IconComponent = (Icons as Record<string, unknown>)[iconName];
  if (typeof IconComponent === "function") {
    return IconComponent as React.ComponentType<{ className?: string }>;
  }
  return Icons.Award;
}

const QUEUE_DELAY_MS = 500;
const ENTRANCE_DELAY_MS = 50;
const EXIT_ANIMATION_DURATION_MS = 300;

export function CelebrationOverlay() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  const getCurrentCelebration = useAchievementStore((state) => state.getCurrentCelebration);
  const dismissCelebration = useAchievementStore((state) => state.dismissCelebration);
  const markAchievementViewed = useAchievementStore((state) => state.markAchievementViewed);

  const currentCelebration = getCurrentCelebration();
  const tier = (currentCelebration?.tier as AchievementTier) || "bronze";
  const config = CELEBRATION_CONFIG[tier];
  const Icon = currentCelebration ? getIcon(currentCelebration.icon) : null;

  const handleDismiss = useCallback(() => {
    if (isExiting || !currentCelebration) return;

    setIsExiting(true);
    markAchievementViewed(currentCelebration.id);

    setTimeout(() => {
      dismissCelebration();
      setIsExiting(false);
      setIsVisible(false);
      setIsProcessingQueue(true);
    }, EXIT_ANIMATION_DURATION_MS);
  }, [isExiting, currentCelebration, markAchievementViewed, dismissCelebration]);

  useEffect(() => {
    if (currentCelebration && !isVisible && !isProcessingQueue) {
      const timer = setTimeout(() => setIsVisible(true), ENTRANCE_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [currentCelebration, isVisible, isProcessingQueue]);

  useEffect(() => {
    if (isProcessingQueue) {
      const timer = setTimeout(() => {
        setIsProcessingQueue(false);
      }, QUEUE_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [isProcessingQueue]);

  useEffect(() => {
    if (!currentCelebration || !isVisible || isExiting) return;

    const autoDismissTimer = setTimeout(() => {
      handleDismiss();
    }, config.duration);

    return () => clearTimeout(autoDismissTimer);
  }, [currentCelebration, isVisible, isExiting, config.duration, handleDismiss]);

  if (!currentCelebration) return null;

  const shouldShowParticles = !prefersReducedMotion && isVisible && !isExiting;

  return (
    <div
      data-testid="celebration-overlay"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-cozy-bg/95 transition-opacity duration-300",
        isVisible && !isExiting ? "opacity-100" : "opacity-0"
      )}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      {shouldShowParticles && (
        <ParticleSystem
          particleCount={config.particleCount}
          particleType={config.particleType}
          tier={tier}
        />
      )}

      <div
        className={cn(
          "flex flex-col items-center text-center p-8 transition-all duration-300",
          isVisible && !isExiting
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {prefersReducedMotion ? (
          <SimpleCelebration
            icon={currentCelebration.icon}
            tier={tier}
            title={currentCelebration.title}
            description={currentCelebration.description}
            onDismiss={handleDismiss}
          />
        ) : (
          <>
            <div
              className={cn(
                "flex items-center justify-center w-[100px] h-[100px] rounded-full bg-cozy-elevated mb-6",
                tierGlowStyles[tier]
              )}
            >
              {Icon && (
                <Icon className={cn("size-12", tierIconColors[tier])} />
              )}
            </div>

            <h2
              id="celebration-title"
              className="font-heading text-[32px] text-cozy-text mb-3"
            >
              {currentCelebration.title}
            </h2>

            <p className="text-lg text-cozy-muted mb-8 max-w-md">
              {currentCelebration.description}
            </p>

            <Button
              onClick={handleDismiss}
              variant="default"
              size="lg"
              className="bg-cozy-accent hover:bg-cozy-accent/90 text-cozy-bg"
            >
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
