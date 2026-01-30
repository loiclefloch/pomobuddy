import { useReducedMotion } from "@/shared/hooks";
import type { CharacterType, CharacterState } from "../types";
import { cn } from "@/shared/lib/utils";

interface CharacterSpriteProps {
  character: CharacterType;
  state: CharacterState;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "w-10 h-10 text-2xl",
  md: "w-20 h-20 text-5xl",
  lg: "w-30 h-30 text-7xl",
} as const;

const CHARACTER_EMOJIS: Record<CharacterType, string> = {
  cat: "🐱",
  cow: "🐮",
  polarBear: "🐻‍❄️",
  koala: "🐨",
  platypus: "🦆",
};

const STATE_STYLES: Record<CharacterState, string> = {
  idle: "opacity-80 character-idle",
  focus: "opacity-100 scale-105",
  break: "opacity-90 scale-95",
  celebrate: "opacity-100 scale-110 character-celebrate",
};

export function CharacterSprite({ 
  character, 
  state, 
  size = "md" 
}: CharacterSpriteProps) {
  const prefersReducedMotion = useReducedMotion();

  const emoji = CHARACTER_EMOJIS[character];
  const sizeClass = SIZE_CLASSES[size];
  const stateStyle = STATE_STYLES[state];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-cozy-surface",
        sizeClass,
        stateStyle,
        !prefersReducedMotion && "transition-all duration-300 ease-out"
      )}
      role="img"
      aria-label={`${character} character - ${state} state`}
    >
      <span className="select-none">
      {emoji}
    </span>
    </div>
  );
}
