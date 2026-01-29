# Story 5.4: Implement Character State Animations

Status: ready-for-dev

## Story

As a user,
I want my companion character to respond to my focus sessions,
So that the character feels alive and connected to my activity.

## Acceptance Criteria

1. **Given** the CharacterSprite and timer state
   **When** I connect character state to timer state
   **Then** character state updates automatically based on timer:
   - Timer idle → Character idle
   - Timer focus → Character focus
   - Timer break → Character break
   - Session complete → Character celebrate (temporary)

2. **Given** character state connection exists
   **When** the timer starts a focus session
   **Then** the character transitions from idle to focus pose
   **And** the transition animates smoothly (300ms)
   **And** the character maintains focus pose throughout session

3. **Given** a focus session completes
   **When** the `SessionComplete` event fires
   **Then** the character transitions to celebrate state (FR25)
   **And** the celebration plays for 2-3 seconds
   **And** the character then transitions to break or idle state

4. **Given** the character is in idle state
   **When** I implement idle animations
   **Then** the character has subtle "breathing" animation (scale pulse)
   **And** occasional blink animation (every 3-5 seconds)
   **And** animations are gentle and not distracting
   **And** animations stop if `prefers-reduced-motion` is enabled

5. **Given** celebration animation is triggered
   **When** the character celebrates
   **Then** the character does a happy bounce or dance
   **And** the animation is cheerful but brief
   **And** the animation matches the cozy aesthetic (not over-the-top)

6. **Given** the tray menu displays character
   **When** I add character to tray menu
   **Then** a small character sprite appears in the timer ring or nearby
   **And** the character state matches the current timer state
   **And** the character adds personality without cluttering the UI

## Tasks / Subtasks

- [ ] Task 1: Connect Character to Timer State (AC: #1)
  - [ ] 1.1: Create `useCharacterState` hook
  - [ ] 1.2: Subscribe to timer store status
  - [ ] 1.3: Map timer status to character state
  - [ ] 1.4: Handle state transitions

- [ ] Task 2: Implement Timer-Triggered Transitions (AC: #2)
  - [ ] 2.1: Listen for timer start → switch to focus
  - [ ] 2.2: Listen for timer pause → keep current
  - [ ] 2.3: Listen for timer stop → switch to idle
  - [ ] 2.4: Smooth 300ms transitions

- [ ] Task 3: Implement Celebration on Session Complete (AC: #3)
  - [ ] 3.1: Listen to SessionComplete event
  - [ ] 3.2: Trigger celebrate state
  - [ ] 3.3: Auto-transition after 2-3 seconds
  - [ ] 3.4: Return to break or idle

- [ ] Task 4: Add Idle Animations (AC: #4)
  - [ ] 4.1: Implement breathing animation (CSS)
  - [ ] 4.2: Implement occasional blink (interval)
  - [ ] 4.3: Respect reduced motion preference
  - [ ] 4.4: Keep animations subtle

- [ ] Task 5: Add Celebration Animation (AC: #5)
  - [ ] 5.1: Implement bounce animation
  - [ ] 5.2: Optional dance spritesheet
  - [ ] 5.3: Match cozy aesthetic
  - [ ] 5.4: Brief duration (2-3s)

- [ ] Task 6: Add Character to Tray Menu (AC: #6)
  - [ ] 6.1: Add CharacterSprite to TrayMenu
  - [ ] 6.2: Position near TimerRing
  - [ ] 6.3: Use small size variant
  - [ ] 6.4: Connect to character state

- [ ] Task 7: Testing
  - [ ] 7.1: Test state transitions
  - [ ] 7.2: Test celebration timing
  - [ ] 7.3: Test reduced motion
  - [ ] 7.4: Test tray display

## Dev Notes

### State Mapping

```typescript
function mapTimerToCharacter(timerStatus: TimerStatus): CharacterState {
  switch (timerStatus) {
    case 'idle':
      return 'idle';
    case 'focus':
      return 'focus';
    case 'break':
      return 'break';
    case 'paused':
      return 'focus'; // Keep focus pose when paused
    default:
      return 'idle';
  }
}
```

### Idle Animation CSS

```css
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.character-idle {
  animation: breathe 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .character-idle {
    animation: none;
  }
}
```

### Celebration Flow

```typescript
const handleSessionComplete = () => {
  setCharacterState('celebrate');
  
  setTimeout(() => {
    setCharacterState(timerStatus === 'break' ? 'break' : 'idle');
  }, 2500);
};
```

### Tray Menu Character Placement

```
┌──────────────────────────────┐
│         TimerRing            │
│          MM:SS               │
│            🐱                │  ← Small character (40px)
│                              │
│ ─────────────────────────── │
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/character/hooks/useCharacterState.ts` | State management |

### Files to Modify

| File | Changes |
|------|---------|
| `src/features/character/components/CharacterSprite.tsx` | Add animations |
| `src/windows/tray/TrayMenu.tsx` | Add character |
| `src/styles/globals.css` | Animation keyframes |

### References

- [Source: epics.md#Story-5.4] - Full acceptance criteria
- [Source: prd.md#FR25] - Character celebrates
- [Source: ux-design-specification.md#UX14] - Reduced motion

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
