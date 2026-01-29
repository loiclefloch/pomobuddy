import { describe, it, expect, beforeEach } from "vitest";
import { useAchievementStore } from "./achievementStore";

describe("achievementStore", () => {
  beforeEach(() => {
    useAchievementStore.getState().reset();
  });

  it("should have initial state", () => {
    const state = useAchievementStore.getState();
    expect(state.achievements).toEqual([]);
    expect(state.celebrationQueue).toEqual([]);
    expect(state.totalSessions).toBe(0);
    expect(state.isLoading).toBe(true);
    expect(state.viewedAchievements).toBeInstanceOf(Set);
    expect(state.viewedAchievements.size).toBe(0);
  });

  it("should set achievements", () => {
    const achievements = [
      {
        id: "first_session",
        title: "First Focus",
        description: "Complete your first session",
        icon: "Flame",
        tier: "bronze",
        requirement: { type: "sessions", value: 1 },
        unlocked: false,
        unlockedAt: null,
      },
    ];

    useAchievementStore.getState().setAchievements(achievements);

    const state = useAchievementStore.getState();
    expect(state.achievements).toEqual(achievements);
  });

  it("should set total sessions", () => {
    useAchievementStore.getState().setTotalSessions(42);

    const state = useAchievementStore.getState();
    expect(state.totalSessions).toBe(42);
  });

  it("should add achievement to celebration queue", () => {
    const payload = {
      id: "first_session",
      title: "First Focus",
      description: "Complete your first session",
      tier: "bronze",
      icon: "Flame",
      unlockedAt: "2026-01-29T10:00:00Z",
    };

    useAchievementStore.getState().addToCelebrationQueue(payload);

    const state = useAchievementStore.getState();
    expect(state.celebrationQueue).toHaveLength(1);
    expect(state.celebrationQueue[0]).toEqual(payload);
  });

  it("should dismiss celebration from front of queue", () => {
    const payload1 = {
      id: "first_session",
      title: "First Focus",
      description: "Complete your first session",
      tier: "bronze",
      icon: "Flame",
      unlockedAt: "2026-01-29T10:00:00Z",
    };
    const payload2 = {
      id: "streak_7",
      title: "Week Warrior",
      description: "7-day streak",
      tier: "silver",
      icon: "Zap",
      unlockedAt: "2026-01-29T10:00:01Z",
    };

    useAchievementStore.getState().addToCelebrationQueue(payload1);
    useAchievementStore.getState().addToCelebrationQueue(payload2);

    expect(useAchievementStore.getState().celebrationQueue).toHaveLength(2);

    useAchievementStore.getState().dismissCelebration();

    const state = useAchievementStore.getState();
    expect(state.celebrationQueue).toHaveLength(1);
    expect(state.celebrationQueue[0]).toEqual(payload2);
  });

  it("should get current celebration", () => {
    expect(useAchievementStore.getState().getCurrentCelebration()).toBeNull();

    const payload = {
      id: "first_session",
      title: "First Focus",
      description: "Complete your first session",
      tier: "bronze",
      icon: "Flame",
      unlockedAt: "2026-01-29T10:00:00Z",
    };

    useAchievementStore.getState().addToCelebrationQueue(payload);

    expect(useAchievementStore.getState().getCurrentCelebration()).toEqual(
      payload
    );
  });

  it("should update achievement unlock status when adding to queue", () => {
    const achievements = [
      {
        id: "first_session",
        title: "First Focus",
        description: "Complete your first session",
        icon: "Flame",
        tier: "bronze",
        requirement: { type: "sessions", value: 1 },
        unlocked: false,
        unlockedAt: null,
      },
    ];

    useAchievementStore.getState().setAchievements(achievements);

    const payload = {
      id: "first_session",
      title: "First Focus",
      description: "Complete your first session",
      tier: "bronze",
      icon: "Flame",
      unlockedAt: "2026-01-29T10:00:00Z",
    };

    useAchievementStore.getState().addToCelebrationQueue(payload);

    const state = useAchievementStore.getState();
    expect(state.achievements[0].unlocked).toBe(true);
    expect(state.achievements[0].unlockedAt).toBe("2026-01-29T10:00:00Z");
  });

  it("should set loading state", () => {
    useAchievementStore.getState().setLoading(false);
    expect(useAchievementStore.getState().isLoading).toBe(false);

    useAchievementStore.getState().setLoading(true);
    expect(useAchievementStore.getState().isLoading).toBe(true);
  });

  it("should reset to initial state", () => {
    useAchievementStore.getState().setTotalSessions(100);
    useAchievementStore.getState().setLoading(false);
    useAchievementStore.getState().addToCelebrationQueue({
      id: "test",
      title: "Test",
      description: "Test",
      tier: "bronze",
      icon: "Star",
      unlockedAt: "2026-01-29T10:00:00Z",
    });

    useAchievementStore.getState().reset();

    const state = useAchievementStore.getState();
    expect(state.achievements).toEqual([]);
    expect(state.celebrationQueue).toEqual([]);
    expect(state.totalSessions).toBe(0);
    expect(state.isLoading).toBe(true);
  });

  describe("viewed achievements tracking", () => {
    it("should mark achievement as viewed", () => {
      useAchievementStore.getState().markAchievementViewed("first_session");

      const state = useAchievementStore.getState();
      expect(state.viewedAchievements.has("first_session")).toBe(true);
    });

    it("should correctly identify new achievements", () => {
      const achievements = [
        {
          id: "first_session",
          title: "First Focus",
          description: "Complete your first session",
          icon: "Flame",
          tier: "bronze",
          requirement: { type: "sessions", value: 1 },
          unlocked: true,
          unlockedAt: "2026-01-29T10:00:00Z",
        },
      ];

      useAchievementStore.getState().setAchievements(achievements);

      expect(useAchievementStore.getState().isAchievementNew("first_session")).toBe(true);

      useAchievementStore.getState().markAchievementViewed("first_session");

      expect(useAchievementStore.getState().isAchievementNew("first_session")).toBe(false);
    });

    it("should return false for locked achievements in isAchievementNew", () => {
      const achievements = [
        {
          id: "streak_30",
          title: "Monthly Master",
          description: "30-day streak",
          icon: "Crown",
          tier: "platinum",
          requirement: { type: "streak", value: 30 },
          unlocked: false,
          unlockedAt: null,
        },
      ];

      useAchievementStore.getState().setAchievements(achievements);

      expect(useAchievementStore.getState().isAchievementNew("streak_30")).toBe(false);
    });
  });
});
