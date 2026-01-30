import { describe, it, expect } from "vitest";
import {
  CHARACTERS,
  CHARACTER_COLORS,
  getCharacterData,
  preloadCharacterAssets,
} from "./characters";

describe("characters data", () => {
  describe("CHARACTERS", () => {
    it("contains exactly 5 characters", () => {
      expect(CHARACTERS).toHaveLength(5);
    });

    it("includes cat character with correct properties", () => {
      const cat = CHARACTERS.find((c) => c.id === "cat");
      expect(cat).toEqual({
        id: "cat",
        name: "Cat",
        emoji: "🐱",
        accentColor: "#F4B8A8",
        description: "A cozy companion",
      });
    });

    it("includes all expected character IDs", () => {
      const ids = CHARACTERS.map((c) => c.id);
      expect(ids).toContain("cat");
      expect(ids).toContain("cow");
      expect(ids).toContain("polarBear");
      expect(ids).toContain("koala");
      expect(ids).toContain("platypus");
    });

    it("each character has all required properties", () => {
      CHARACTERS.forEach((char) => {
        expect(char).toHaveProperty("id");
        expect(char).toHaveProperty("name");
        expect(char).toHaveProperty("emoji");
        expect(char).toHaveProperty("accentColor");
        expect(char).toHaveProperty("description");
      });
    });

    it("all accent colors are valid hex colors", () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      CHARACTERS.forEach((char) => {
        expect(char.accentColor).toMatch(hexColorRegex);
      });
    });
  });

  describe("CHARACTER_COLORS", () => {
    it("has colors for all character types", () => {
      expect(CHARACTER_COLORS).toHaveProperty("cat", "#F4B8A8");
      expect(CHARACTER_COLORS).toHaveProperty("cow", "#F5E6D3");
      expect(CHARACTER_COLORS).toHaveProperty("polarBear", "#B8D4E3");
      expect(CHARACTER_COLORS).toHaveProperty("koala", "#A8C5A0");
      expect(CHARACTER_COLORS).toHaveProperty("platypus", "#7BAFA3");
    });

    it("matches colors in CHARACTERS array", () => {
      CHARACTERS.forEach((char) => {
        expect(CHARACTER_COLORS[char.id]).toBe(char.accentColor);
      });
    });
  });

  describe("getCharacterData", () => {
    it("returns character data for valid ID", () => {
      const result = getCharacterData("cat");
      expect(result).toEqual(CHARACTERS[0]);
    });

    it("returns undefined for invalid ID", () => {
      const result = getCharacterData("invalid" as never);
      expect(result).toBeUndefined();
    });

    it("returns correct data for each character", () => {
      CHARACTERS.forEach((char) => {
        const result = getCharacterData(char.id);
        expect(result).toEqual(char);
      });
    });
  });

  describe("preloadCharacterAssets", () => {
    it("returns a promise", () => {
      const result = preloadCharacterAssets();
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
