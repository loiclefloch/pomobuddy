import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SessionHistory } from "./SessionHistory";

const mockDayHistories = [
  {
    date: "2026-01-29",
    sessions: [
      {
        startTime: "2026-01-29T09:15:00",
        endTime: "2026-01-29T09:40:00",
        durationSeconds: 25 * 60,
        status: "complete" as const,
      },
      {
        startTime: "2026-01-29T10:02:00",
        endTime: "2026-01-29T10:16:00",
        durationSeconds: 14 * 60,
        status: "interrupted" as const,
      },
    ],
  },
  {
    date: "2026-01-28",
    sessions: [
      {
        startTime: "2026-01-28T14:30:00",
        endTime: "2026-01-28T14:55:00",
        durationSeconds: 25 * 60,
        status: "complete" as const,
      },
    ],
  },
];

describe("SessionHistory", () => {
  describe("rendering", () => {
    it("renders day sections for each date", () => {
      render(
        <SessionHistory
          days={mockDayHistories}
          isLoading={false}
          hasMore={false}
          onLoadMore={() => {}}
        />
      );
      expect(screen.getByText("2 sessions")).toBeInTheDocument();
      expect(screen.getByText("1 session")).toBeInTheDocument();
    });

    it("renders sessions within day sections", () => {
      render(
        <SessionHistory
          days={mockDayHistories}
          isLoading={false}
          hasMore={false}
          onLoadMore={() => {}}
        />
      );
      expect(screen.getByText("09:15 - 09:40")).toBeInTheDocument();
      expect(screen.getByText("14:30 - 14:55")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty message when no days", () => {
      render(
        <SessionHistory
          days={[]}
          isLoading={false}
          hasMore={false}
          onLoadMore={() => {}}
        />
      );
      expect(screen.getByText(/no session history/i)).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("shows loading indicator when loading", () => {
      render(
        <SessionHistory
          days={[]}
          isLoading={true}
          hasMore={false}
          onLoadMore={() => {}}
        />
      );
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe("load more", () => {
    it("shows Load More button when hasMore is true", () => {
      render(
        <SessionHistory
          days={mockDayHistories}
          isLoading={false}
          hasMore={true}
          onLoadMore={() => {}}
        />
      );
      expect(screen.getByRole("button", { name: /load more/i })).toBeInTheDocument();
    });

    it("hides Load More button when hasMore is false", () => {
      render(
        <SessionHistory
          days={mockDayHistories}
          isLoading={false}
          hasMore={false}
          onLoadMore={() => {}}
        />
      );
      expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
    });

    it("calls onLoadMore when Load More button is clicked", () => {
      const handleLoadMore = vi.fn();
      render(
        <SessionHistory
          days={mockDayHistories}
          isLoading={false}
          hasMore={true}
          onLoadMore={handleLoadMore}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: /load more/i }));
      expect(handleLoadMore).toHaveBeenCalledTimes(1);
    });

    it("disables Load More button while loading", () => {
      render(
        <SessionHistory
          days={mockDayHistories}
          isLoading={true}
          hasMore={true}
          onLoadMore={() => {}}
        />
      );
      const button = screen.getByRole("button", { name: /loading/i });
      expect(button).toBeDisabled();
    });
  });

  describe("scrolling", () => {
    it("has scrollable container", () => {
      const { container } = render(
        <SessionHistory
          days={mockDayHistories}
          isLoading={false}
          hasMore={false}
          onLoadMore={() => {}}
        />
      );
      const scrollContainer = container.querySelector("[class*='overflow']");
      expect(scrollContainer).toBeInTheDocument();
    });
  });
});
