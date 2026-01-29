import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { WeeklyBarChart } from "./WeeklyBarChart";

describe("WeeklyBarChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockWeeklyResponse = {
    days: [
      {
        date: "2026-01-23",
        dayName: "Fri",
        focusMinutes: 60,
        sessionCount: 2,
        isToday: false,
      },
      {
        date: "2026-01-24",
        dayName: "Sat",
        focusMinutes: 0,
        sessionCount: 0,
        isToday: false,
      },
      {
        date: "2026-01-25",
        dayName: "Sun",
        focusMinutes: 30,
        sessionCount: 1,
        isToday: false,
      },
      {
        date: "2026-01-26",
        dayName: "Mon",
        focusMinutes: 120,
        sessionCount: 4,
        isToday: false,
      },
      {
        date: "2026-01-27",
        dayName: "Tue",
        focusMinutes: 90,
        sessionCount: 3,
        isToday: false,
      },
      {
        date: "2026-01-28",
        dayName: "Wed",
        focusMinutes: 45,
        sessionCount: 2,
        isToday: false,
      },
      {
        date: "2026-01-29",
        dayName: "Thu",
        focusMinutes: 75,
        sessionCount: 3,
        isToday: true,
      },
    ],
    weeklyTotalMinutes: 420,
  };

  describe("rendering (AC #1)", () => {
    beforeEach(() => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);
    });

    it("renders 7 vertical bars", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const bars = screen.getAllByTestId(/^bar-/);
        expect(bars).toHaveLength(7);
      });
    });

    it("renders day labels on x-axis", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        expect(screen.getByText("Fri")).toBeInTheDocument();
        expect(screen.getByText("Sat")).toBeInTheDocument();
        expect(screen.getByText("Sun")).toBeInTheDocument();
        expect(screen.getByText("Mon")).toBeInTheDocument();
        expect(screen.getByText("Tue")).toBeInTheDocument();
        expect(screen.getByText("Wed")).toBeInTheDocument();
        expect(screen.getByText("Thu")).toBeInTheDocument();
      });
    });

    it("calculates bar heights proportional to focus hours", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const monBar = screen.getByTestId("bar-Mon");
        const sunBar = screen.getByTestId("bar-Sun");
        
        const monHeight = parseInt(monBar.style.height);
        const sunHeight = parseInt(sunBar.style.height);
        
        expect(monHeight).toBeGreaterThan(sunHeight);
      });
    });
  });

  describe("bar styling (AC #2)", () => {
    beforeEach(() => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);
    });

    it("uses bg-cozy-accent color for bars", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const bars = screen.getAllByTestId(/^bar-/);
        bars.forEach((bar) => {
          expect(bar).toHaveClass("bg-cozy-accent");
        });
      });
    });

    it("shows today's bar at 100% opacity", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const todayBar = screen.getByTestId("bar-Thu");
        expect(todayBar).toHaveClass("opacity-100");
      });
    });

    it("shows other days' bars at 60% opacity", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const monBar = screen.getByTestId("bar-Mon");
        expect(monBar).toHaveClass("opacity-60");
      });
    });

    it("has rounded top corners on bars", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const bars = screen.getAllByTestId(/^bar-/);
        bars.forEach((bar) => {
          expect(bar).toHaveClass("rounded-t-md");
        });
      });
    });

    it("shows minimum stub height for empty days", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const satBar = screen.getByTestId("bar-Sat");
        const height = parseInt(satBar.style.height);
        expect(height).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe("tooltips (AC #3)", () => {
    beforeEach(() => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);
    });

    it("shows tooltip on bar hover with day name and date", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const monBar = screen.getByTestId("bar-Mon");
        fireEvent.mouseEnter(monBar);
      });

      await waitFor(() => {
        expect(screen.getByText("Mon - 2026-01-26")).toBeInTheDocument();
      });
    });

    it("shows focus time in tooltip", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const monBar = screen.getByTestId("bar-Mon");
        fireEvent.mouseEnter(monBar);
      });

      await waitFor(() => {
        expect(screen.getByText(/2h/)).toBeInTheDocument();
      });
    });

    it("shows session count in tooltip", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const monBar = screen.getByTestId("bar-Mon");
        fireEvent.mouseEnter(monBar);
      });

      await waitFor(() => {
        expect(screen.getByText(/4 sessions/)).toBeInTheDocument();
      });
    });

    it("hides tooltip when mouse leaves", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        const monBar = screen.getByTestId("bar-Mon");
        fireEvent.mouseEnter(monBar);
      });

      await waitFor(() => {
        expect(screen.getByText(/4 sessions/)).toBeInTheDocument();
      });

      const monBar = screen.getByTestId("bar-Mon");
      fireEvent.mouseLeave(monBar);

      await waitFor(() => {
        expect(screen.queryByText(/4 sessions/)).not.toBeInTheDocument();
      });
    });
  });

  describe("header (AC #5)", () => {
    beforeEach(() => {
      vi.mocked(invoke).mockResolvedValue(mockWeeklyResponse);
    });

    it('displays "This Week" title', async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        expect(screen.getByText("This Week")).toBeInTheDocument();
      });
    });

    it("displays weekly total hours", async () => {
      render(<WeeklyBarChart />);

      await waitFor(() => {
        expect(screen.getByText("7h total")).toBeInTheDocument();
      });
    });
  });

  describe("loading state", () => {
    it("shows loading skeleton initially", () => {
      vi.mocked(invoke).mockImplementation(() => new Promise(() => {}));

      render(<WeeklyBarChart />);

      expect(screen.getByTestId("weekly-chart-loading")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty bars when no data", async () => {
      vi.mocked(invoke).mockResolvedValue({
        days: [
          { date: "2026-01-23", dayName: "Fri", focusMinutes: 0, sessionCount: 0, isToday: false },
          { date: "2026-01-24", dayName: "Sat", focusMinutes: 0, sessionCount: 0, isToday: false },
          { date: "2026-01-25", dayName: "Sun", focusMinutes: 0, sessionCount: 0, isToday: false },
          { date: "2026-01-26", dayName: "Mon", focusMinutes: 0, sessionCount: 0, isToday: false },
          { date: "2026-01-27", dayName: "Tue", focusMinutes: 0, sessionCount: 0, isToday: false },
          { date: "2026-01-28", dayName: "Wed", focusMinutes: 0, sessionCount: 0, isToday: false },
          { date: "2026-01-29", dayName: "Thu", focusMinutes: 0, sessionCount: 0, isToday: true },
        ],
        weeklyTotalMinutes: 0,
      });

      render(<WeeklyBarChart />);

      await waitFor(() => {
        const bars = screen.getAllByTestId(/^bar-/);
        expect(bars).toHaveLength(7);
      });

      expect(screen.getByText("0m total")).toBeInTheDocument();
    });
  });
});
