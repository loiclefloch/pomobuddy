import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimerRing } from "./TimerRing";

describe("TimerRing", () => {
  describe("rendering", () => {
    it("renders with default dimensions", () => {
      render(<TimerRing progress={50} status="focus" />);
      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("width", "120");
      expect(svg).toHaveAttribute("height", "120");
    });

    it("renders with custom dimensions", () => {
      render(<TimerRing progress={50} status="focus" diameter={200} />);
      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("width", "200");
      expect(svg).toHaveAttribute("height", "200");
    });

    it("renders two circles (track and progress)", () => {
      render(<TimerRing progress={50} status="focus" />);
      const circles = document.querySelectorAll("circle");
      expect(circles).toHaveLength(2);
    });
  });

  describe("progress display", () => {
    it("shows zero progress when progress is 0", () => {
      render(<TimerRing progress={0} status="focus" />);
      const progressCircle = document.querySelectorAll("circle")[1];
      const radius = (120 - 8) / 2;
      const circumference = 2 * Math.PI * radius;
      expect(progressCircle).toHaveAttribute(
        "stroke-dashoffset",
        String(circumference)
      );
    });

    it("shows full progress when progress is 100", () => {
      render(<TimerRing progress={100} status="focus" />);
      const progressCircle = document.querySelectorAll("circle")[1];
      expect(progressCircle).toHaveAttribute("stroke-dashoffset", "0");
    });

    it("shows half progress when progress is 50", () => {
      render(<TimerRing progress={50} status="focus" />);
      const progressCircle = document.querySelectorAll("circle")[1];
      const radius = (120 - 8) / 2;
      const circumference = 2 * Math.PI * radius;
      const expectedOffset = circumference / 2;
      expect(progressCircle).toHaveAttribute(
        "stroke-dashoffset",
        String(expectedOffset)
      );
    });
  });

  describe("status colors", () => {
    it("uses accent color for focus status", () => {
      render(<TimerRing progress={50} status="focus" />);
      const progressCircle = document.querySelectorAll("circle")[1];
      expect(progressCircle).toHaveAttribute("stroke", "var(--cozy-accent)");
    });

    it("uses success color for break status", () => {
      render(<TimerRing progress={50} status="break" />);
      const progressCircle = document.querySelectorAll("circle")[1];
      expect(progressCircle).toHaveAttribute("stroke", "var(--cozy-success)");
    });

    it("uses accent color for paused status", () => {
      render(<TimerRing progress={50} status="paused" />);
      const progressCircle = document.querySelectorAll("circle")[1];
      expect(progressCircle).toHaveAttribute("stroke", "var(--cozy-accent)");
    });
  });

  describe("center display", () => {
    it('shows "Start" when idle', () => {
      render(<TimerRing progress={0} status="idle" />);
      expect(screen.getByText("Start")).toBeInTheDocument();
    });

    it("shows time when in focus mode", () => {
      render(
        <TimerRing progress={50} status="focus" remainingSeconds={750} />
      );
      expect(screen.getByText("12:30")).toBeInTheDocument();
    });

    it("shows time when in break mode", () => {
      render(
        <TimerRing progress={50} status="break" remainingSeconds={150} />
      );
      expect(screen.getByText("02:30")).toBeInTheDocument();
    });

    it("formats time correctly with leading zeros", () => {
      render(<TimerRing progress={50} status="focus" remainingSeconds={65} />);
      expect(screen.getByText("01:05")).toBeInTheDocument();
    });

    it("shows 00:00 when remainingSeconds is 0 and not idle", () => {
      render(<TimerRing progress={100} status="focus" remainingSeconds={0} />);
      expect(screen.getByText("00:00")).toBeInTheDocument();
    });
  });

  describe("track styling", () => {
    it("uses border color for track", () => {
      render(<TimerRing progress={50} status="focus" />);
      const trackCircle = document.querySelectorAll("circle")[0];
      expect(trackCircle).toHaveAttribute("stroke", "var(--cozy-border)");
    });

    it("applies default stroke width", () => {
      render(<TimerRing progress={50} status="focus" />);
      const circles = document.querySelectorAll("circle");
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute("stroke-width", "8");
      });
    });

    it("applies custom stroke width", () => {
      render(<TimerRing progress={50} status="focus" strokeWidth={12} />);
      const circles = document.querySelectorAll("circle");
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute("stroke-width", "12");
      });
    });
  });

  describe("animations", () => {
    it("has transition class on progress circle", () => {
      render(<TimerRing progress={50} status="focus" />);
      const progressCircle = document.querySelectorAll("circle")[1];
      expect(progressCircle).toHaveClass("transition-all");
      expect(progressCircle).toHaveClass("duration-1000");
    });
  });
});
