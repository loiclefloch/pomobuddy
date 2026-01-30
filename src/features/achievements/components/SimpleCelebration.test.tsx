import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SimpleCelebration } from "./SimpleCelebration";
import type { AchievementTier } from "../types";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

describe("SimpleCelebration", () => {
  const defaultProps = {
    icon: "Zap",
    tier: "silver" as AchievementTier,
    title: "Week Warrior",
    description: "7-day streak achieved!",
    onDismiss: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the component", () => {
      render(<SimpleCelebration {...defaultProps} />);
      expect(screen.getByTestId("simple-celebration")).toBeInTheDocument();
    });

    it("displays achievement title", () => {
      render(<SimpleCelebration {...defaultProps} />);
      expect(screen.getByText("Week Warrior")).toBeInTheDocument();
    });

    it("displays achievement description", () => {
      render(<SimpleCelebration {...defaultProps} />);
      expect(screen.getByText("7-day streak achieved!")).toBeInTheDocument();
    });

    it("displays Continue button", () => {
      render(<SimpleCelebration {...defaultProps} />);
      expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });

    it("renders icon", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("dismiss behavior", () => {
    it("calls onDismiss when Continue button clicked", () => {
      const onDismiss = vi.fn();
      render(<SimpleCelebration {...defaultProps} onDismiss={onDismiss} />);
      
      const button = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(button);
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe("tier styling", () => {
    const tiers: AchievementTier[] = ["bronze", "silver", "gold", "platinum"];

    tiers.forEach((tier) => {
      it(`renders with ${tier} tier styling`, () => {
        render(<SimpleCelebration {...defaultProps} tier={tier} />);
        expect(screen.getByTestId("simple-celebration")).toBeInTheDocument();
      });
    });

    it("applies tier-specific border color for bronze", () => {
      render(<SimpleCelebration {...defaultProps} tier="bronze" />);
      const container = screen.getByTestId("simple-celebration");
      expect(container).toHaveClass("border-[#CD7F32]/30");
    });

    it("applies tier-specific border color for gold", () => {
      render(<SimpleCelebration {...defaultProps} tier="gold" />);
      const container = screen.getByTestId("simple-celebration");
      expect(container).toHaveClass("border-[#FFD700]/50");
    });
  });

  describe("container styling", () => {
    it("has rounded corners", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const container = screen.getByTestId("simple-celebration");
      expect(container).toHaveClass("rounded-2xl");
    });

    it("has centered content", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const container = screen.getByTestId("simple-celebration");
      expect(container).toHaveClass("flex", "flex-col", "items-center", "text-center");
    });

    it("uses cozy surface background", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const container = screen.getByTestId("simple-celebration");
      expect(container).toHaveClass("bg-cozy-surface");
    });

    it("has border", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const container = screen.getByTestId("simple-celebration");
      expect(container).toHaveClass("border-2");
    });
  });

  describe("typography", () => {
    it("uses heading font for title", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const title = screen.getByText("Week Warrior");
      expect(title).toHaveClass("font-heading");
    });

    it("uses 32px font size for title", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const title = screen.getByText("Week Warrior");
      expect(title).toHaveClass("text-[32px]");
    });

    it("uses muted color for description", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const description = screen.getByText("7-day streak achieved!");
      expect(description).toHaveClass("text-cozy-muted");
    });
  });

  describe("icon rendering", () => {
    it("renders icon container with correct size", () => {
      render(<SimpleCelebration {...defaultProps} />);
      const iconContainers = document.querySelectorAll(".w-\\[100px\\]");
      expect(iconContainers.length).toBeGreaterThan(0);
    });

    it("renders fallback icon when invalid icon name", () => {
      render(<SimpleCelebration {...defaultProps} icon="InvalidIcon" />);
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });
});
