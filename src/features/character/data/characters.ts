import type { CharacterType } from "../types";

export interface CharacterData {
  id: CharacterType;
  name: string;
  emoji: string;
  accentColor: string;
  description: string;
}

export const CHARACTERS: CharacterData[] = [
  {
    id: "cat",
    name: "Cat",
    emoji: "🐱",
    accentColor: "#F4B8A8",
    description: "A cozy companion",
  },
  {
    id: "cow",
    name: "Cow",
    emoji: "🐮",
    accentColor: "#F5E6D3",
    description: "A friendly helper",
  },
  {
    id: "polarBear",
    name: "Polar Bear",
    emoji: "🐻‍❄️",
    accentColor: "#B8D4E3",
    description: "A cool focus buddy",
  },
  {
    id: "koala",
    name: "Koala",
    emoji: "🐨",
    accentColor: "#A8C5A0",
    description: "A relaxed companion",
  },
  {
    id: "platypus",
    name: "Platypus",
    emoji: "🦆",
    accentColor: "#7BAFA3",
    description: "A unique friend",
  },
];

export const CHARACTER_COLORS: Record<CharacterType, string> = {
  cat: "#F4B8A8",
  cow: "#F5E6D3",
  polarBear: "#B8D4E3",
  koala: "#A8C5A0",
  platypus: "#7BAFA3",
};

export function getCharacterData(id: CharacterType): CharacterData | undefined {
  return CHARACTERS.find((char) => char.id === id);
}

const CHARACTER_STATES = ["idle", "focus", "break", "celebrate"] as const;

export function preloadCharacterAssets(): Promise<void[]> {
  const promises: Promise<void>[] = [];

  CHARACTERS.forEach((char) => {
    CHARACTER_STATES.forEach((state) => {
      const promise = new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = `/characters/${char.id}/${state}.png`;
      });
      promises.push(promise);
    });
  });

  return Promise.all(promises);
}
