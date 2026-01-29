# Story 6.2: Create Welcome Screen

Status: ready-for-dev

## Story

As a new user,
I want to be greeted warmly when I first open the app,
So that I feel welcomed and excited to use it.

## Acceptance Criteria

1. **Given** first-run is detected
   **When** I create the onboarding feature in `src/features/onboarding/`
   **Then** the following components exist:
   - `OnboardingFlow.tsx` - main flow controller
   - `WelcomeScreen.tsx` - initial welcome step
   **And** components are in `src/features/onboarding/components/`

2. **Given** the WelcomeScreen component
   **When** displayed to a new user
   **Then** the screen shows:
   - Warm greeting: "Welcome to test-bmad!" in Nunito display font
   - Friendly tagline: "Your cozy focus companion"
   - A preview character waving (default cat or random)
   - "Get Started" button to proceed
   **And** the background uses `cozy-bg` color
   **And** the overall feel is warm and inviting

3. **Given** the welcome screen is displayed
   **When** I implement the layout
   **Then** the content is centered vertically and horizontally
   **And** generous padding creates a calm, spacious feel
   **And** a subtle entrance animation fades in the content

4. **Given** the "Get Started" button exists
   **When** the user clicks it
   **Then** the flow transitions to character selection (Story 6.3)
   **And** the transition is smooth (slide or fade)

5. **Given** the onboarding window
   **When** I configure it in Tauri
   **Then** onboarding uses the main window (800x600)
   **And** the window is centered on screen
   **And** the window cannot be closed until onboarding completes (or has skip option)

## Tasks / Subtasks

- [ ] Task 1: Create Onboarding Feature Structure (AC: #1)
  - [ ] 1.1: Create `src/features/onboarding/` directory
  - [ ] 1.2: Create components/ subdirectory
  - [ ] 1.3: Create types.ts for onboarding types

- [ ] Task 2: Create OnboardingFlow Component (AC: #1)
  - [ ] 2.1: Create `OnboardingFlow.tsx`
  - [ ] 2.2: Manage current step state
  - [ ] 2.3: Handle step transitions
  - [ ] 2.4: Call onComplete callback

- [ ] Task 3: Create WelcomeScreen Component (AC: #2, #3)
  - [ ] 3.1: Create `WelcomeScreen.tsx`
  - [ ] 3.2: Add greeting text with Nunito font
  - [ ] 3.3: Add tagline
  - [ ] 3.4: Add character preview
  - [ ] 3.5: Add "Get Started" button

- [ ] Task 4: Style Welcome Screen (AC: #2, #3)
  - [ ] 4.1: Center content vertically and horizontally
  - [ ] 4.2: Apply cozy-bg background
  - [ ] 4.3: Add generous padding
  - [ ] 4.4: Add entrance fade animation

- [ ] Task 5: Implement Step Transition (AC: #4)
  - [ ] 5.1: Handle button click
  - [ ] 5.2: Trigger transition to next step
  - [ ] 5.3: Smooth animation (fade or slide)

- [ ] Task 6: Configure Window Behavior (AC: #5)
  - [ ] 6.1: Use main window for onboarding
  - [ ] 6.2: Center window on screen
  - [ ] 6.3: Optionally prevent close during onboarding

## Dev Notes

### Visual Design

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│                     🐱                           │
│                                                  │
│           Welcome to test-bmad!                  │
│                                                  │
│          Your cozy focus companion               │
│                                                  │
│             [ Get Started ]                      │
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### OnboardingFlow Steps

```typescript
type OnboardingStep = 
  | 'welcome'
  | 'character-select'
  | 'tutorial'
  | 'first-session';

const OnboardingFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  
  const handleNext = () => {
    switch (step) {
      case 'welcome':
        setStep('character-select');
        break;
      case 'character-select':
        setStep('tutorial');
        break;
      case 'tutorial':
        setStep('first-session');
        break;
      case 'first-session':
        onComplete();
        break;
    }
  };
  
  // Render current step
};
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/onboarding/components/OnboardingFlow.tsx` | Flow controller |
| `src/features/onboarding/components/WelcomeScreen.tsx` | Welcome step |
| `src/features/onboarding/types.ts` | Type definitions |

### References

- [Source: epics.md#Story-6.2] - Full acceptance criteria
- [Source: ux-design-specification.md#UX12] - Onboarding flow

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
