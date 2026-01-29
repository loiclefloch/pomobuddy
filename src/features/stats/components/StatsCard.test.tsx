import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Target, Clock } from "lucide-react";
import { StatsCard } from "./StatsCard";

describe("StatsCard", () => {
  describe("rendering", () => {
    it("renders the icon", () => {
      render(
        <StatsCard
          icon={<Target data-testid="stat-icon" />}
          value="4"
          label="Sessions Today"
        />
      );
      expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
    });

    it("renders the primary value with large text", () => {
      render(
        <StatsCard
          icon={<Target />}
          value="1h 40m"
          label="Focus Time"
        />
      );
      const value = screen.getByText("1h 40m");
      expect(value).toBeInTheDocument();
      expect(value).toHaveClass("text-3xl", "font-bold", "text-cozy-text");
    });

    it("renders the label with muted text", () => {
      render(
        <StatsCard
          icon={<Target />}
          value="4"
          label="Sessions Today"
        />
      );
      const label = screen.getByText("Sessions Today");
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass("text-sm", "text-cozy-muted");
    });

    it("renders optional secondary text when provided", () => {
      render(
        <StatsCard
          icon={<Target />}
          value="4"
          label="Sessions Today"
          secondaryText="Best: 8 sessions"
        />
      );
      expect(screen.getByText("Best: 8 sessions")).toBeInTheDocument();
    });

    it("does not render secondary text when not provided", () => {
      render(
        <StatsCard
          icon={<Target />}
          value="4"
          label="Sessions Today"
        />
      );
      expect(screen.queryByText("Best:")).not.toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("has bg-cozy-surface background", () => {
      const { container } = render(
        <StatsCard
          icon={<Target />}
          value="4"
          label="Sessions Today"
        />
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("bg-cozy-surface");
    });

    it("has rounded-xl border radius", () => {
      const { container } = render(
        <StatsCard
          icon={<Target />}
          value="4"
          label="Sessions Today"
        />
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("rounded-xl");
    });

    it("has p-5 padding (20px)", () => {
      const { container } = render(
        <StatsCard
          icon={<Target />}
          value="4"
          label="Sessions Today"
        />
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("p-5");
    });

    it("renders icon with accent color styling", () => {
      render(
        <StatsCard
          icon={<Clock data-testid="icon" className="size-6 text-cozy-accent" />}
          value="4"
          label="Sessions"
        />
      );
      const icon = screen.getByTestId("icon");
      expect(icon).toHaveClass("text-cozy-accent");
    });
  });
});
