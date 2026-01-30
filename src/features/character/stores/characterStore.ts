import { create } from "zustand";
import type { CharacterType } from "../types";
import { useSettingsStore } from "@/features/settings/stores/settingsStore";

interface CharacterStoreState {
  selectedCharacter: CharacterType;
  setCharacter: (character: CharacterType) => void;
}

export const useCharacterStore = create<CharacterStoreState>((set) => ({
  selectedCharacter: (useSettingsStore.getState().settings.character as CharacterType) || "cat",

  setCharacter: (character) => {
    set({ selectedCharacter: character });
    useSettingsStore.getState().updateSettings({ character });
  },
}));
