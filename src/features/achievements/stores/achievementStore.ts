import { create, type StateCreator } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";

interface AchievementWithStatus {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: string;
  requirement: { type: string; value: number };
  unlocked: boolean;
  unlockedAt: string | null;
}

interface AchievementUnlockedPayload {
  id: string;
  title: string;
  description: string;
  tier: string;
  icon: string;
  unlockedAt: string;
}

interface AchievementState {
  achievements: AchievementWithStatus[];
  celebrationQueue: AchievementUnlockedPayload[];
  viewedAchievements: Set<string>;
  totalSessions: number;
  isLoading: boolean;
  setAchievements: (achievements: AchievementWithStatus[]) => void;
  setTotalSessions: (count: number) => void;
  addToCelebrationQueue: (achievement: AchievementUnlockedPayload) => void;
  dismissCelebration: () => void;
  getCurrentCelebration: () => AchievementUnlockedPayload | null;
  markAchievementViewed: (id: string) => void;
  isAchievementNew: (id: string) => boolean;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  achievements: [] as AchievementWithStatus[],
  celebrationQueue: [] as AchievementUnlockedPayload[],
  viewedAchievements: new Set<string>(),
  totalSessions: 0,
  isLoading: true,
};

type AchievementPersist = Pick<AchievementState, "viewedAchievements">;

const storeCreator: StateCreator<AchievementState, [], [["zustand/persist", AchievementPersist]]> = (set, get) => ({
  ...initialState,

  setAchievements: (achievements) => set({ achievements }),

  setTotalSessions: (count) => set({ totalSessions: count }),

  addToCelebrationQueue: (achievement) =>
    set((state) => ({
      celebrationQueue: [...state.celebrationQueue, achievement],
      achievements: state.achievements.map((a) =>
        a.id === achievement.id
          ? { ...a, unlocked: true, unlockedAt: achievement.unlockedAt }
          : a
      ),
    })),

  dismissCelebration: () =>
    set((state) => ({
      celebrationQueue: state.celebrationQueue.slice(1),
    })),

  getCurrentCelebration: () => {
    const { celebrationQueue } = get();
    return celebrationQueue.length > 0 ? celebrationQueue[0] : null;
  },

  markAchievementViewed: (id: string) =>
    set((state) => ({
      viewedAchievements: new Set([...state.viewedAchievements, id]),
    })),

  isAchievementNew: (id: string) => {
    const { achievements, viewedAchievements } = get();
    const achievement = achievements.find((a) => a.id === id);
    if (!achievement || !achievement.unlocked) return false;
    return !viewedAchievements.has(id);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () => set(initialState),
});

const persistOptions: PersistOptions<AchievementState, AchievementPersist> = {
  name: "cozy-achievements",
  partialize: (state) => ({
    viewedAchievements: state.viewedAchievements,
  }),
  storage: {
    getItem: (name) => {
      try {
        const str = localStorage.getItem(name);
        if (!str) return null;
        const parsed = JSON.parse(str);
        if (parsed?.state?.viewedAchievements) {
          parsed.state.viewedAchievements = new Set(parsed.state.viewedAchievements);
        }
        return parsed;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        const toStore = {
          ...value,
          state: {
            ...value.state,
            viewedAchievements: value.state?.viewedAchievements 
              ? Array.from(value.state.viewedAchievements)
              : [],
          },
        };
        localStorage.setItem(name, JSON.stringify(toStore));
      } catch {
      }
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(name);
      } catch {
      }
    },
  },
};

export const useAchievementStore = create<AchievementState>()(
  persist(storeCreator, persistOptions)
);

export type { AchievementWithStatus, AchievementUnlockedPayload };
