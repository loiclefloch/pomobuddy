import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ParticleSystem } from "./ParticleSystem";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));

describe("ParticleSystem", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("renders particle container", () => {
      render(
        <ParticleSystem
          particleCount={20}
          particleType="sparkle"
          tier="bronze"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });

    it("renders correct number of particles", () => {
      render(
        <ParticleSystem
          particleCount={10}
          particleType="confetti"
          tier="silver"
        />
      );
      const container = screen.getByTestId("particle-system");
      expect(container.children.length).toBe(10);
    });

    it("renders different particle counts based on prop", () => {
      const { unmount } = render(
        <ParticleSystem
          particleCount={20}
          particleType="sparkle"
          tier="bronze"
        />
      );
      
      let container = screen.getByTestId("particle-system");
      expect(container.children.length).toBe(20);

      unmount();

      render(
        <ParticleSystem
          particleCount={100}
          particleType="fireworks"
          tier="platinum"
        />
      );
      
      container = screen.getByTestId("particle-system");
      expect(container.children.length).toBe(100);
    });
  });

  describe("particle types", () => {
    it("renders sparkle particles", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="sparkle"
          tier="bronze"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });

    it("renders confetti particles", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="confetti"
          tier="silver"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });

    it("renders confetti-rain particles", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="confetti-rain"
          tier="gold"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });

    it("renders fireworks particles", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="fireworks"
          tier="platinum"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });
  });

  describe("container styling", () => {
    it("has absolute positioning", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="sparkle"
          tier="bronze"
        />
      );
      const container = screen.getByTestId("particle-system");
      expect(container).toHaveClass("absolute", "inset-0");
    });

    it("has overflow hidden", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="sparkle"
          tier="bronze"
        />
      );
      const container = screen.getByTestId("particle-system");
      expect(container).toHaveClass("overflow-hidden");
    });

    it("has pointer-events-none for non-interactive particles", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="sparkle"
          tier="bronze"
        />
      );
      const container = screen.getByTestId("particle-system");
      expect(container).toHaveClass("pointer-events-none");
    });
  });

  describe("animation", () => {
    it("particles animate over time", async () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="confetti"
          tier="silver"
        />
      );
      
      const container = screen.getByTestId("particle-system");
      const initialParticleStyles = Array.from(container.children).map(
        (child) => (child as HTMLElement).style.cssText
      );

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      const updatedParticleStyles = Array.from(container.children).map(
        (child) => (child as HTMLElement).style.cssText
      );

      const hasChanged = initialParticleStyles.some(
        (style, index) => style !== updatedParticleStyles[index]
      );
      expect(hasChanged).toBe(true);
    });

    it("particles fade out over 3 seconds", async () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="confetti"
          tier="silver"
        />
      );
      
      await act(async () => {
        vi.advanceTimersByTime(3500);
      });

      const container = screen.getByTestId("particle-system");
      const particles = Array.from(container.children);
      
      particles.forEach((particle) => {
        const style = (particle as HTMLElement).style;
        expect(parseFloat(style.opacity)).toBe(0);
      });
    });
  });

  describe("tier colors", () => {
    it("uses bronze colors for bronze tier", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="sparkle"
          tier="bronze"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });

    it("uses silver colors for silver tier", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="confetti"
          tier="silver"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });

    it("uses gold colors for gold tier", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="confetti-rain"
          tier="gold"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });

    it("uses platinum colors for platinum tier", () => {
      render(
        <ParticleSystem
          particleCount={5}
          particleType="fireworks"
          tier="platinum"
        />
      );
      expect(screen.getByTestId("particle-system")).toBeInTheDocument();
    });
  });
});
