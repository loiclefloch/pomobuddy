import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { TodayStats } from "./TodayStats";

describe("TodayStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("with session data", () => {
    beforeEach(() => {
      vi.mocked(invoke).mockResolvedValue({
        completedCount: 3,
        interruptedCount: 1,
        totalFocusMinutes: 100,
      });
    });

    it("renders Sessions Today card with correct count", async () => {
      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("4")).toBeInTheDocument();
      });
      expect(screen.getByText("Sessions Today")).toBeInTheDocument();
    });

    it("renders Focus Time card with formatted time", async () => {
      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("1h 40m")).toBeInTheDocument();
      });
      expect(screen.getByText("Focus Time")).toBeInTheDocument();
    });

    it("renders both StatsCard components in a flex container", async () => {
      const { container } = render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("Sessions Today")).toBeInTheDocument();
      });

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("flex");
    });
  });

  describe("with empty state (no sessions)", () => {
    beforeEach(() => {
      vi.mocked(invoke).mockResolvedValue({
        completedCount: 0,
        interruptedCount: 0,
        totalFocusMinutes: 0,
      });
    });

    it('displays "0" for Sessions Today', async () => {
      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("0")).toBeInTheDocument();
      });
    });

    it('displays "0m" for Focus Time', async () => {
      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("0m")).toBeInTheDocument();
      });
    });
  });

  describe("formatting", () => {
    it("displays minutes only when less than 60", async () => {
      vi.mocked(invoke).mockResolvedValue({
        completedCount: 1,
        interruptedCount: 0,
        totalFocusMinutes: 45,
      });

      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("45m")).toBeInTheDocument();
      });
    });

    it("displays hours only when exact hour", async () => {
      vi.mocked(invoke).mockResolvedValue({
        completedCount: 2,
        interruptedCount: 0,
        totalFocusMinutes: 120,
      });

      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("2h")).toBeInTheDocument();
      });
    });

    it("displays hours and minutes when combined", async () => {
      vi.mocked(invoke).mockResolvedValue({
        completedCount: 3,
        interruptedCount: 0,
        totalFocusMinutes: 150,
      });

      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("2h 30m")).toBeInTheDocument();
      });
    });
  });

  describe("icons", () => {
    it("renders target icon for sessions", async () => {
      vi.mocked(invoke).mockResolvedValue({
        completedCount: 1,
        interruptedCount: 0,
        totalFocusMinutes: 25,
      });

      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("Sessions Today")).toBeInTheDocument();
      });

      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThanOrEqual(2);
    });

    it("renders clock icon for focus time", async () => {
      vi.mocked(invoke).mockResolvedValue({
        completedCount: 1,
        interruptedCount: 0,
        totalFocusMinutes: 25,
      });

      render(<TodayStats />);

      await waitFor(() => {
        expect(screen.getByText("Focus Time")).toBeInTheDocument();
      });

      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
