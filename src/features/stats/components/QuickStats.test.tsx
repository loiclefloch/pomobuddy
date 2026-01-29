import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuickStats } from "./QuickStats";

describe("QuickStats", () => {
  describe("streak display", () => {
    it('displays "Start streak!" when streak is 0', () => {
      render(
        <QuickStats
          currentStreak={0}
          todaySessions={0}
          todayFocusMinutes={0}
        />
      );
      expect(screen.getByText("Start streak!")).toBeInTheDocument();
    });

    it("displays Day X when streak is positive", () => {
      render(
        <QuickStats
          currentStreak={12}
          todaySessions={0}
          todayFocusMinutes={0}
        />
      );
      expect(screen.getByText("Day 12")).toBeInTheDocument();
    });
  });

  describe("sessions display", () => {
    it('displays "0 sessions" when no sessions', () => {
      render(
        <QuickStats
          currentStreak={0}
          todaySessions={0}
          todayFocusMinutes={0}
        />
      );
      expect(screen.getByText("0 sessions")).toBeInTheDocument();
    });

    it('displays "1 session" (singular) for one session', () => {
      render(
        <QuickStats
          currentStreak={0}
          todaySessions={1}
          todayFocusMinutes={25}
        />
      );
      expect(screen.getByText("1 session")).toBeInTheDocument();
    });

    it('displays "4 sessions" (plural) for multiple sessions', () => {
      render(
        <QuickStats
          currentStreak={0}
          todaySessions={4}
          todayFocusMinutes={100}
        />
      );
      expect(screen.getByText("4 sessions")).toBeInTheDocument();
    });
  });

  describe("focus time display", () => {
    it('displays "0m" when no focus time', () => {
      render(
        <QuickStats
          currentStreak={0}
          todaySessions={0}
          todayFocusMinutes={0}
        />
      );
      expect(screen.getByText("0m")).toBeInTheDocument();
    });

    it("displays minutes only when less than 60", () => {
      render(
        <QuickStats
          currentStreak={0}
          todaySessions={1}
          todayFocusMinutes={45}
        />
      );
      expect(screen.getByText("45m")).toBeInTheDocument();
    });

    it("displays hours only when exact hours", () => {
      render(
        <QuickStats
          currentStreak={0}
          todaySessions={2}
          todayFocusMinutes={120}
        />
      );
      expect(screen.getByText("2h")).toBeInTheDocument();
    });

    it("displays hours and minutes", () => {
      render(
        <QuickStats
          currentStreak={0}
          todaySessions={4}
          todayFocusMinutes={100}
        />
      );
      expect(screen.getByText("1h 40m")).toBeInTheDocument();
    });
  });

  describe("icons", () => {
    it("renders flame icon for streak", () => {
      render(
        <QuickStats
          currentStreak={1}
          todaySessions={0}
          todayFocusMinutes={0}
        />
      );
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBe(3);
    });
  });
});
