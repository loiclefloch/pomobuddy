export type CharacterType = "cat" | "cow" | "polarBear" | "koala" | "platypus";

export type CharacterState = "idle" | "focus" | "break" | "celebrate";

export interface CharacterProps {
  character: CharacterType;
  state: CharacterState;
  size: "sm" | "md" | "lg";
}
