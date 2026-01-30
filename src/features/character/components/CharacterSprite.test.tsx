import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CharacterSprite } from "./CharacterSprite";

vi.mock("@/shared/hooks", () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from "@/shared/hooks";

describe("CharacterSprite", () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  describe("rendering", () => {
    it("renders with default size (md)", () => {
      render(<CharacterSprite character="cat" state="idle" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toBeInTheDocument();
      expect(sprite).toHaveClass("w-20", "h-20");
    });

    it("renders the correct emoji for each character", () => {
      const characters = [
        { type: "cat" as const, emoji: "🐱" },
        { type: "cow" as const, emoji: "🐮" },
        { type: "polarBear" as const, emoji: "🐻‍❄️" },
        { type: "koala" as const, emoji: "🐨" },
        { type: "platypus" as const, emoji: "🦆" },
      ];

      characters.forEach(({ type, emoji }) => {
        const { unmount } = render(<CharacterSprite character={type} state="idle" />);
        expect(screen.getByText(emoji)).toBeInTheDocument();
        unmount();
      });
    });

    it("has proper accessibility attributes", () => {
      render(<CharacterSprite character="cat" state="focus" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveAttribute("aria-label", "cat character - focus state");
    });
  });

  describe("size variants", () => {
    it("applies small size classes", () => {
      render(<CharacterSprite character="cat" state="idle" size="sm" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("w-10", "h-10");
    });

    it("applies medium size classes", () => {
      render(<CharacterSprite character="cat" state="idle" size="md" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("w-20", "h-20");
    });

    it("applies large size classes", () => {
      render(<CharacterSprite character="cat" state="idle" size="lg" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("w-30", "h-30");
    });
  });

  describe("state styles", () => {
    it("applies idle state styles", () => {
      render(<CharacterSprite character="cat" state="idle" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("opacity-80", "character-idle");
    });

    it("applies focus state styles", () => {
      render(<CharacterSprite character="cat" state="focus" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("opacity-100", "scale-105");
    });

    it("applies break state styles", () => {
      render(<CharacterSprite character="cat" state="break" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("opacity-90", "scale-95");
    });

    it("applies celebrate state styles", () => {
      render(<CharacterSprite character="cat" state="celebrate" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("opacity-100", "scale-110", "character-celebrate");
    });
  });

  describe("transitions", () => {
    it("includes transition classes when reduced motion is not preferred", () => {
      vi.mocked(useReducedMotion).mockReturnValue(false);
      render(<CharacterSprite character="cat" state="idle" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("transition-all", "duration-300", "ease-out");
    });

    it("excludes transition classes when reduced motion is preferred", () => {
      vi.mocked(useReducedMotion).mockReturnValue(true);
      render(<CharacterSprite character="cat" state="idle" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).not.toHaveClass("transition-all");
    });

    it("still applies character-celebrate class regardless of motion preference (CSS handles animation)", () => {
      vi.mocked(useReducedMotion).mockReturnValue(true);
      render(<CharacterSprite character="cat" state="celebrate" />);
      
      const sprite = screen.getByRole("img");
      expect(sprite).toHaveClass("character-celebrate");
    });
  });
});
