import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { CelebrationOverlay } from "./CelebrationOverlay";
import { useAchievementStore } from "../stores/achievementStore";
import type { AchievementUnlockedPayload } from "../stores/achievementStore";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

vi.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

const mockAchievement: AchievementUnlockedPayload = {
  id: "streak_7",
  title: "Week Warrior",
  description: "7-day streak achieved!",
  tier: "silver",
  icon: "Zap",
  unlockedAt: "2026-01-15T10:00:00Z",
};

const mockPlatinumAchievement: AchievementUnlockedPayload = {
  id: "streak_30",
  title: "Monthly Master",
  description: "30-day streak achieved!",
  tier: "platinum",
  icon: "Crown",
  unlockedAt: "2026-01-15T10:00:00Z",
};

function CelebrationOverlayWithStore() {
  const celebrationQueue = useAchievementStore((state) => state.celebrationQueue);
  return (
    <>
      <div data-testid="queue-length">{celebrationQueue.length}</div>
      <CelebrationOverlay />
    </>
  );
}

describe("CelebrationOverlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useAchievementStore.setState({
      achievements: [],
      celebrationQueue: [],
      viewedAchievements: new Set(),
      totalSessions: 0,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("renders nothing when no celebration in queue", () => {
      render(<CelebrationOverlay />);
      expect(screen.queryByTestId("celebration-overlay")).not.toBeInTheDocument();
    });

    it("renders overlay when celebration is in queue", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId("celebration-overlay")).toBeInTheDocument();
    });

    it("displays achievement title", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByText("Week Warrior")).toBeInTheDocument();
    });

    it("displays achievement description", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByText("7-day streak achieved!")).toBeInTheDocument();
    });

    it("displays Continue button", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });
  });

  describe("dismiss behavior", () => {
    it("dismisses when Continue button clicked", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlayWithStore />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const button = screen.getByRole("button", { name: /continue/i });
      
      await act(async () => {
        fireEvent.click(button);
        vi.advanceTimersByTime(500);
      });

      expect(screen.queryByText("Week Warrior")).not.toBeInTheDocument();
    });

    it("dismisses when clicking overlay background", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlayWithStore />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const overlay = screen.getByTestId("celebration-overlay");
      
      await act(async () => {
        fireEvent.click(overlay);
        vi.advanceTimersByTime(500);
      });

      expect(screen.queryByText("Week Warrior")).not.toBeInTheDocument();
    });

    it("marks achievement as viewed when dismissed", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
        viewedAchievements: new Set(),
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const button = screen.getByRole("button", { name: /continue/i });
      
      await act(async () => {
        fireEvent.click(button);
        vi.advanceTimersByTime(500);
      });

      const state = useAchievementStore.getState();
      expect(state.viewedAchievements.has("streak_7")).toBe(true);
    });
  });

  describe("auto-dismiss", () => {
    it("auto-dismisses after silver tier duration (4s)", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlayWithStore />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByText("Week Warrior")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(4500);
      });

      expect(screen.queryByText("Week Warrior")).not.toBeInTheDocument();
    });

    it("auto-dismisses after platinum tier duration (6s)", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockPlatinumAchievement],
      });

      render(<CelebrationOverlayWithStore />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByText("Monthly Master")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(6500);
      });

      expect(screen.queryByText("Monthly Master")).not.toBeInTheDocument();
    });
  });

  describe("queue processing", () => {
    it("shows next celebration after dismissing first", async () => {
      const secondAchievement: AchievementUnlockedPayload = {
        id: "sessions_100",
        title: "Century Club",
        description: "100 sessions completed!",
        tier: "gold",
        icon: "Trophy",
        unlockedAt: "2026-01-15T10:00:00Z",
      };

      useAchievementStore.setState({
        celebrationQueue: [mockAchievement, secondAchievement],
      });

      render(<CelebrationOverlayWithStore />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByText("Week Warrior")).toBeInTheDocument();

      const button = screen.getByRole("button", { name: /continue/i });
      
      await act(async () => {
        fireEvent.click(button);
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText("Century Club")).toBeInTheDocument();
    });

    it("has delay between celebrations", async () => {
      const secondAchievement: AchievementUnlockedPayload = {
        id: "sessions_100",
        title: "Century Club",
        description: "100 sessions completed!",
        tier: "gold",
        icon: "Trophy",
        unlockedAt: "2026-01-15T10:00:00Z",
      };

      useAchievementStore.setState({
        celebrationQueue: [mockAchievement, secondAchievement],
      });

      render(<CelebrationOverlayWithStore />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByText("Week Warrior")).toBeInTheDocument();

      const button = screen.getByRole("button", { name: /continue/i });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.queryByText("Century Club")).not.toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      expect(screen.getByText("Century Club")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has dialog role", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const overlay = screen.getByTestId("celebration-overlay");
      expect(overlay).toHaveAttribute("role", "dialog");
    });

    it("has aria-modal attribute", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const overlay = screen.getByTestId("celebration-overlay");
      expect(overlay).toHaveAttribute("aria-modal", "true");
    });

    it("has aria-labelledby pointing to title", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const overlay = screen.getByTestId("celebration-overlay");
      expect(overlay).toHaveAttribute("aria-labelledby", "celebration-title");
      
      const title = document.getElementById("celebration-title");
      expect(title).toHaveTextContent("Week Warrior");
    });
  });

  describe("styling", () => {
    it("has full-screen overlay with dark background", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const overlay = screen.getByTestId("celebration-overlay");
      expect(overlay).toHaveClass("fixed", "inset-0");
      expect(overlay).toHaveClass("bg-cozy-bg/95");
    });

    it("centers content", async () => {
      useAchievementStore.setState({
        celebrationQueue: [mockAchievement],
      });

      render(<CelebrationOverlay />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const overlay = screen.getByTestId("celebration-overlay");
      expect(overlay).toHaveClass("flex", "items-center", "justify-center");
    });
  });
});
