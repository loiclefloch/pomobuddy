import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CharacterSelector } from "./CharacterSelector";
import { useCharacterStore } from "../stores/characterStore";
import { CHARACTERS } from "../data/characters";

vi.mock("../stores/characterStore", () => ({
  useCharacterStore: vi.fn(),
}));

describe("CharacterSelector", () => {
  const mockSetCharacter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCharacterStore).mockReturnValue({
      selectedCharacter: "cat",
      setCharacter: mockSetCharacter,
    });
  });

  describe("rendering", () => {
    it("renders all 5 characters", () => {
      render(<CharacterSelector />);

      CHARACTERS.forEach((char) => {
        expect(screen.getByText(char.name)).toBeInTheDocument();
        expect(screen.getByText(char.emoji)).toBeInTheDocument();
      });
    });

    it("renders with default title", () => {
      render(<CharacterSelector />);

      expect(screen.getByText("Choose your companion")).toBeInTheDocument();
    });

    it("renders with custom title", () => {
      render(<CharacterSelector title="Pick a friend" />);

      expect(screen.getByText("Pick a friend")).toBeInTheDocument();
    });

    it("renders without title when title is empty", () => {
      render(<CharacterSelector title="" />);

      expect(screen.queryByText("Choose your companion")).not.toBeInTheDocument();
    });

    it("has radiogroup role for accessibility", () => {
      render(<CharacterSelector />);

      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("highlights the currently selected character from store", () => {
      vi.mocked(useCharacterStore).mockReturnValue({
        selectedCharacter: "koala",
        setCharacter: mockSetCharacter,
      });

      render(<CharacterSelector />);

      const koalaButton = screen.getByRole("button", {
        name: /select koala as your companion/i,
      });
      expect(koalaButton).toHaveAttribute("aria-pressed", "true");
    });

    it("highlights controlled value when provided", () => {
      render(<CharacterSelector value="polarBear" />);

      const polarBearButton = screen.getByRole("button", {
        name: /select polar bear as your companion/i,
      });
      expect(polarBearButton).toHaveAttribute("aria-pressed", "true");
    });

    it("calls setCharacter from store when clicking a character", () => {
      render(<CharacterSelector />);

      const cowButton = screen.getByRole("button", {
        name: /select cow as your companion/i,
      });
      fireEvent.click(cowButton);

      expect(mockSetCharacter).toHaveBeenCalledWith("cow");
    });

    it("calls onSelect callback instead of store when provided", () => {
      const onSelect = vi.fn();
      render(<CharacterSelector onSelect={onSelect} />);

      const platypusButton = screen.getByRole("button", {
        name: /select platypus as your companion/i,
      });
      fireEvent.click(platypusButton);

      expect(onSelect).toHaveBeenCalledWith("platypus");
      expect(mockSetCharacter).not.toHaveBeenCalled();
    });
  });

  describe("layout", () => {
    it("uses row layout by default", () => {
      render(<CharacterSelector />);

      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toHaveClass("flex-nowrap");
    });

    it("uses grid layout when specified", () => {
      render(<CharacterSelector layout="grid" />);

      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toHaveClass("flex-wrap");
    });
  });

  describe("character options", () => {
    it("each character button has proper aria-label", () => {
      render(<CharacterSelector />);

      CHARACTERS.forEach((char) => {
        const button = screen.getByRole("button", {
          name: new RegExp(`select ${char.name} as your companion`, "i"),
        });
        expect(button).toBeInTheDocument();
      });
    });

    it("non-selected characters have aria-pressed false", () => {
      vi.mocked(useCharacterStore).mockReturnValue({
        selectedCharacter: "cat",
        setCharacter: mockSetCharacter,
      });

      render(<CharacterSelector />);

      const cowButton = screen.getByRole("button", {
        name: /select cow as your companion/i,
      });
      expect(cowButton).toHaveAttribute("aria-pressed", "false");
    });
  });
});
