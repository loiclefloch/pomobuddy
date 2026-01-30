import { useCharacterStore } from "../stores/characterStore";
import { useTimerStore } from "@/features/timer/stores/timerStore";
import type { CharacterState } from "../types";
import type { TimerStatus } from "@/features/timer/types";

function mapTimerStatusToCharacterState(status: TimerStatus): CharacterState {
  switch (status) {
    case "focus":
      return "focus";
    case "break":
      return "break";
    case "paused":
    case "idle":
    default:
      return "idle";
  }
}

export function useCharacter() {
  const selectedCharacter = useCharacterStore((state) => state.selectedCharacter);
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const timerStatus = useTimerStore((state) => state.status);

  const characterState = mapTimerStatusToCharacterState(timerStatus);

  return {
    character: selectedCharacter,
    state: characterState,
    setCharacter,
  };
}
