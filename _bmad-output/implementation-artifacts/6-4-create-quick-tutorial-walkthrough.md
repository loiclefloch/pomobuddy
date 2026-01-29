# Story 6.4: Create Quick Tutorial Walkthrough

Status: ready-for-dev

## Story

As a new user,
I want a brief tutorial showing how to use the app,
So that I understand the core features without reading documentation.

## Acceptance Criteria

1. **Given** character selection is complete
   **When** I create `TutorialStep.tsx`
   **Then** the component shows a 3-step tutorial (UX12)
   **And** steps are presented one at a time
   **And** progress indicator shows current step (1/3, 2/3, 3/3)

2. **Given** the tutorial steps
   **When** I define tutorial content
   **Then** the 3 steps are:
   
   **Step 1: "Click the tray to start"**
   - Visual: Tray icon illustration/screenshot
   - Text: "Find me in your menu bar. Click to open the timer."
   - Shows tray icon location for macOS/Linux
   
   **Step 2: "25 minutes focus, 5 minutes break"**
   - Visual: Timer ring illustration
   - Text: "Start a session and I'll keep you company. Take breaks guilt-free."
   - Shows the Pomodoro concept briefly
   
   **Step 3: "Build streaks, earn badges"**
   - Visual: Streak flame and achievement badge
   - Text: "Complete sessions daily to build streaks. Unlock achievements along the way!"
   - Shows gamification elements

3. **Given** each tutorial step
   **When** displayed to the user
   **Then** the selected character appears alongside the content
   **And** the character has an encouraging pose
   **And** "Next" button advances to next step
   **And** "Back" button returns to previous step (except step 1)

4. **Given** the tutorial navigation
   **When** the user reaches step 3
   **Then** the "Next" button changes to "Let's Go!" or "Start First Session"
   **And** clicking proceeds to the final onboarding step (Story 6.5)

5. **Given** the tutorial UI
   **When** I implement the design
   **Then** each step has consistent layout
   **And** visuals are simple illustrations, not overwhelming
   **And** text is concise (2-3 sentences max per step)

## Tasks / Subtasks

- [ ] Task 1: Create TutorialStep Component (AC: #1)
  - [ ] 1.1: Create `TutorialStep.tsx`
  - [ ] 1.2: Manage current step state (1-3)
  - [ ] 1.3: Add progress indicator
  - [ ] 1.4: Handle step navigation

- [ ] Task 2: Define Tutorial Content (AC: #2)
  - [ ] 2.1: Create content for step 1 (Tray)
  - [ ] 2.2: Create content for step 2 (Timer)
  - [ ] 2.3: Create content for step 3 (Streaks)
  - [ ] 2.4: Add visuals/illustrations

- [ ] Task 3: Add Character Integration (AC: #3)
  - [ ] 3.1: Display selected character
  - [ ] 3.2: Use encouraging pose
  - [ ] 3.3: Position alongside content

- [ ] Task 4: Implement Navigation (AC: #3, #4)
  - [ ] 4.1: Next button for steps 1-2
  - [ ] 4.2: Back button for steps 2-3
  - [ ] 4.3: "Let's Go!" button for step 3
  - [ ] 4.4: Smooth step transitions

- [ ] Task 5: Create Tutorial Visuals (AC: #2, #5)
  - [ ] 5.1: Tray icon illustration
  - [ ] 5.2: Timer ring illustration
  - [ ] 5.3: Streak/badge illustration
  - [ ] 5.4: Keep simple and clean

- [ ] Task 6: Style Progress Indicator
  - [ ] 6.1: Show 1/3, 2/3, 3/3 dots
  - [ ] 6.2: Highlight current step
  - [ ] 6.3: Match cozy aesthetic

## Dev Notes

### Tutorial Content Structure

```typescript
const TUTORIAL_STEPS = [
  {
    id: 1,
    title: "Click the tray to start",
    description: "Find me in your menu bar. Click to open the timer.",
    visual: "tray-illustration",
  },
  {
    id: 2,
    title: "25 minutes focus, 5 minutes break",
    description: "Start a session and I'll keep you company. Take breaks guilt-free.",
    visual: "timer-illustration",
  },
  {
    id: 3,
    title: "Build streaks, earn badges",
    description: "Complete sessions daily to build streaks. Unlock achievements along the way!",
    visual: "streak-illustration",
  },
];
```

### Visual Layout

```
┌──────────────────────────────────────────────────┐
│                                                  │
│     Click the tray to start                      │
│                                                  │
│  ┌─────────────────┐          🐱                │
│  │  [Tray Icon]    │                            │
│  │  Illustration   │     "I'm right here        │
│  │                 │      in your menu bar!"    │
│  └─────────────────┘                            │
│                                                  │
│  Find me in your menu bar. Click to open        │
│  the timer.                                     │
│                                                  │
│       ● ○ ○                                     │
│                                                  │
│     [ Back ]            [ Next ]                │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/onboarding/components/TutorialStep.tsx` | Tutorial component |
| `src/features/onboarding/data/tutorialContent.ts` | Tutorial content |

### Files to Modify

| File | Changes |
|------|---------|
| `src/features/onboarding/components/OnboardingFlow.tsx` | Add tutorial step |

### References

- [Source: epics.md#Story-6.4] - Full acceptance criteria
- [Source: ux-design-specification.md#UX12] - 3-step tutorial

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
