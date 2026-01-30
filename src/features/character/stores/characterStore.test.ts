import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCharacterStore } from "./characterStore";
import { useSettingsStore } from "@/features/settings/stores/settingsStore";

vi.mock("@/features/settings/stores/settingsStore", () => ({
  useSettingsStore: {
    getState: vi.fn(() => ({
      settings: { character: "cat" },
      updateSettings: vi.fn(),
    })),
  },
}));

describe("useCharacterStore", () => {
  beforeEach(() => {
    useCharacterStore.setState({ selectedCharacter: "cat" });
  });

  describe("initialization", () => {
    it("initializes with character from settings", () => {
      const state = useCharacterStore.getState();
      expect(state.selectedCharacter).toBe("cat");
    });
  });

  describe("setCharacter", () => {
    it("updates selectedCharacter state", () => {
      const { setCharacter } = useCharacterStore.getState();
      
      setCharacter("koala");
      
      expect(useCharacterStore.getState().selectedCharacter).toBe("koala");
    });

    it("persists character selection to settings", () => {
      const mockUpdateSettings = vi.fn();
      vi.mocked(useSettingsStore.getState).mockReturnValue({
        settings: { character: "cat" },
        updateSettings: mockUpdateSettings,
      } as ReturnType<typeof useSettingsStore.getState>);

      const { setCharacter } = useCharacterStore.getState();
      setCharacter("polarBear");

      expect(mockUpdateSettings).toHaveBeenCalledWith({ character: "polarBear" });
    });

    it("can set all character types", () => {
      const characters = ["cat", "cow", "polarBear", "koala", "platypus"] as const;
      const { setCharacter } = useCharacterStore.getState();

      characters.forEach((character) => {
        setCharacter(character);
        expect(useCharacterStore.getState().selectedCharacter).toBe(character);
      });
    });
  });
});
