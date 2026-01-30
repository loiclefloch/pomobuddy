import { useEffect, useState, useRef, useCallback } from "react";
import { useCharacterStore } from "../stores/characterStore";
import { useTimerStore } from "@/features/timer/stores/timerStore";
import type { CharacterState } from "../types";
import type { TimerStatus } from "@/features/timer/types";

const CELEBRATION_DURATION_MS = 2500;

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

export function useCharacterState() {
  const selectedCharacter = useCharacterStore((state) => state.selectedCharacter);
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const timerStatus = useTimerStore((state) => state.status);
  
  const [isCelebrating, setIsCelebrating] = useState(false);
  const previousStatus = useRef<TimerStatus>(timerStatus);
  const celebrationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerCelebration = useCallback(() => {
    if (celebrationTimeout.current) {
      clearTimeout(celebrationTimeout.current);
    }
    
    setIsCelebrating(true);
    
    celebrationTimeout.current = setTimeout(() => {
      setIsCelebrating(false);
      celebrationTimeout.current = null;
    }, CELEBRATION_DURATION_MS);
  }, []);

  useEffect(() => {
    const wasInFocus = previousStatus.current === "focus";
    const isNowBreak = timerStatus === "break";
    
    if (wasInFocus && isNowBreak) {
      triggerCelebration();
    }
    
    previousStatus.current = timerStatus;
  }, [timerStatus, triggerCelebration]);

  useEffect(() => {
    return () => {
      if (celebrationTimeout.current) {
        clearTimeout(celebrationTimeout.current);
      }
    };
  }, []);

  const characterState: CharacterState = isCelebrating 
    ? "celebrate" 
    : mapTimerStatusToCharacterState(timerStatus);

  return {
    character: selectedCharacter,
    state: characterState,
    setCharacter,
    isCelebrating,
    triggerCelebration,
  };
}
