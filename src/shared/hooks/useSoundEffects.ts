import { useCallback, useEffect, useRef } from "react";
import { useSettingsStore } from "@/features/settings/stores/settingsStore";

type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

const SOUND_PATHS = {
  sessionStart: "/assets/audio/session-start.mp3",
  sessionComplete: "/assets/audio/session-complete.mp3",
  breakComplete: "/assets/audio/break-complete.mp3",
  celebrationBronze: "/assets/audio/celebration-bronze.mp3",
  celebrationSilver: "/assets/audio/celebration-silver.mp3",
  celebrationGold: "/assets/audio/celebration-gold.mp3",
} as const;

export function useSoundEffects() {
  const audioEnabled = useSettingsStore((state) => state.settings.audioEnabled);
  const preloadedAudio = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Preload all sounds on mount
  useEffect(() => {
    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      preloadedAudio.current.set(key, audio);
    });

    return () => {
      preloadedAudio.current.clear();
    };
  }, []);

  const playSound = useCallback((key: keyof typeof SOUND_PATHS) => {
    if (!audioEnabled) return;

    const audio = preloadedAudio.current.get(key);
    if (audio) {
      // Reset to start if already playing
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn(`Failed to play sound ${key}:`, error);
      });
    }
  }, [audioEnabled]);

  const playSessionStart = useCallback(() => {
    playSound("sessionStart");
  }, [playSound]);

  const playSessionComplete = useCallback(() => {
    playSound("sessionComplete");
  }, [playSound]);

  const playBreakComplete = useCallback(() => {
    playSound("breakComplete");
  }, [playSound]);

  const playCelebration = useCallback((tier: AchievementTier) => {
    const soundMap: Record<AchievementTier, keyof typeof SOUND_PATHS> = {
      bronze: "celebrationBronze",
      silver: "celebrationSilver",
      gold: "celebrationGold",
      platinum: "celebrationGold", // Use gold sound for platinum
    };
    playSound(soundMap[tier]);
  }, [playSound]);

  return {
    playSessionStart,
    playSessionComplete,
    playBreakComplete,
    playCelebration,
  };
}
