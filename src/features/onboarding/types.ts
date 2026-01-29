export type OnboardingStep =
  | "welcome"
  | "character-selection"
  | "tutorial"
  | "first-session";

export interface OnboardingState {
  currentStep: OnboardingStep;
  completed: boolean;
  selectedCharacter: string | null;
}
