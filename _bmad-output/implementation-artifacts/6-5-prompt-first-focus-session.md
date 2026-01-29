# Story 6.5: Prompt First Focus Session

Status: ready-for-dev

## Story

As a new user completing onboarding,
I want the option to start my first focus session immediately,
So that I can begin using the app right away.

## Acceptance Criteria

1. **Given** the tutorial is complete
   **When** I create `FirstSessionPrompt.tsx`
   **Then** the component offers to start the first session
   **And** the selected character is prominently displayed
   **And** the character shows an encouraging/excited pose

2. **Given** the first session prompt
   **When** displayed to the user
   **Then** the screen shows:
   - Character greeting by name (if we collected it, or generic "Ready to focus?")
   - Heading: "Ready for your first session?"
   - The character in an inviting pose
   - Two options: "Start Session" (primary) and "Maybe Later" (secondary)

3. **Given** the "Start Session" button
   **When** the user clicks it
   **Then** `onboardingComplete: true` is saved to settings
   **And** the onboarding window closes
   **And** a 25-minute focus session starts immediately
   **And** the tray icon shows active state
   **And** the user's first session begins!

4. **Given** the "Maybe Later" button
   **When** the user clicks it
   **Then** `onboardingComplete: true` is saved to settings
   **And** the onboarding window closes
   **And** the app minimizes to tray in idle state
   **And** the user can start a session whenever ready

5. **Given** the first session completes
   **When** the user finishes their first focus session
   **Then** the `first_session` achievement unlocks
   **And** the celebration overlay is shown
   **And** the user feels accomplished and welcomed

6. **Given** onboarding is complete
   **When** the app launches in the future
   **Then** onboarding is skipped
   **And** the app starts minimized to tray (or per user preference)
   **And** the selected character is remembered

## Tasks / Subtasks

- [ ] Task 1: Create FirstSessionPrompt Component (AC: #1, #2)
  - [ ] 1.1: Create `FirstSessionPrompt.tsx`
  - [ ] 1.2: Display selected character prominently
  - [ ] 1.3: Add heading and greeting
  - [ ] 1.4: Add two action buttons

- [ ] Task 2: Implement "Start Session" Action (AC: #3)
  - [ ] 2.1: Save onboardingComplete to settings
  - [ ] 2.2: Close onboarding window
  - [ ] 2.3: Start 25-minute focus session
  - [ ] 2.4: Update tray icon to focus state

- [ ] Task 3: Implement "Maybe Later" Action (AC: #4)
  - [ ] 3.1: Save onboardingComplete to settings
  - [ ] 3.2: Close onboarding window
  - [ ] 3.3: Minimize to tray in idle state

- [ ] Task 4: Character Pose (AC: #1)
  - [ ] 4.1: Use excited/encouraging character state
  - [ ] 4.2: Large character display (120px)
  - [ ] 4.3: Match character selection

- [ ] Task 5: First Achievement Integration (AC: #5)
  - [ ] 5.1: Ensure first_session achievement triggers
  - [ ] 5.2: Celebration overlay appears on completion
  - [ ] 5.3: Welcoming completion experience

- [ ] Task 6: Post-Onboarding Behavior (AC: #6)
  - [ ] 6.1: Skip onboarding on future launches
  - [ ] 6.2: Remember character selection
  - [ ] 6.3: Tray-first interface active

## Dev Notes

### Visual Design

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│                     🐱                           │
│                   (excited)                      │
│                                                  │
│          Ready for your first session?          │
│                                                  │
│    Let's start a 25-minute focus session        │
│    together!                                    │
│                                                  │
│                                                  │
│   [ Start Session ]      [ Maybe Later ]        │
│       (primary)            (secondary)          │
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Start Session Flow

```typescript
async function handleStartSession() {
  // 1. Mark onboarding complete
  await invoke('updateSettings', { 
    settings: { onboardingComplete: true } 
  });
  
  // 2. Close onboarding (handled by parent)
  onComplete();
  
  // 3. Start timer
  await invoke('startTimer');
}
```

### Maybe Later Flow

```typescript
async function handleMaybeLater() {
  // 1. Mark onboarding complete
  await invoke('updateSettings', { 
    settings: { onboardingComplete: true } 
  });
  
  // 2. Just close, don't start timer
  onComplete();
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/onboarding/components/FirstSessionPrompt.tsx` | Final step |

### Files to Modify

| File | Changes |
|------|---------|
| `src/features/onboarding/components/OnboardingFlow.tsx` | Add final step |

### Epic 6 Complete!

This story completes the Onboarding & First-Run Experience epic. After this, a new user will:
1. Be detected as first-run
2. See welcome screen
3. Select their character
4. Learn via 3-step tutorial
5. Option to start first session
6. Never see onboarding again (unless requested)

### References

- [Source: epics.md#Story-6.5] - Full acceptance criteria
- [Source: ux-design-specification.md#UX12] - Onboarding flow

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
