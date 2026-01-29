import { useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import {
  useAchievementStore,
  AchievementWithStatus,
  AchievementUnlockedPayload,
} from "../stores/achievementStore";

export function useAchievements() {
  const {
    achievements,
    totalSessions,
    celebrationQueue,
    isLoading,
    setAchievements,
    setTotalSessions,
    addToCelebrationQueue,
    dismissCelebration,
    getCurrentCelebration,
    setLoading,
  } = useAchievementStore();

  const refreshAchievements = useCallback(async () => {
    try {
      const [achievementsData, sessionsCount] = await Promise.all([
        invoke<AchievementWithStatus[]>("get_achievements"),
        invoke<number>("get_total_sessions"),
      ]);
      setAchievements(achievementsData);
      setTotalSessions(sessionsCount);
    } catch (error) {
      console.error("Failed to load achievements:", error);
    }
  }, [setAchievements, setTotalSessions]);

  useEffect(() => {
    setLoading(true);
    refreshAchievements().finally(() => setLoading(false));

    const unlistenAchievementUnlocked = listen<AchievementUnlockedPayload>(
      "AchievementUnlocked",
      (event) => {
        addToCelebrationQueue(event.payload);
      }
    );

    return () => {
      unlistenAchievementUnlocked.then((fn) => fn());
    };
  }, [refreshAchievements, addToCelebrationQueue, setLoading]);

  const currentCelebration = getCurrentCelebration();

  return {
    achievements,
    totalSessions,
    isLoading,
    celebrationQueue,
    currentCelebration,
    dismissCelebration,
    refreshAchievements,
  };
}
