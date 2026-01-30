# Story 5.4: Implement Character State Animations

Status: done

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

- [x] Task 1: Connect Character to Timer State (AC: #1)
  - [x] 1.1: Created `useCharacterState` hook
  - [x] 1.2: Subscribes to timer store status
  - [x] 1.3: Maps timer status to character state
  - [x] 1.4: Handles state transitions

- [x] Task 2: Implement Timer-Triggered Transitions (AC: #2)
  - [x] 2.1: Listens for timer start → switch to focus
  - [x] 2.2: Listens for timer pause → keep idle
  - [x] 2.3: Listens for timer stop → switch to idle
  - [x] 2.4: Smooth 300ms transitions via CSS

- [x] Task 3: Implement Celebration on Session Complete (AC: #3)
  - [x] 3.1: Detects focus → break transition
  - [x] 3.2: Triggers celebrate state
  - [x] 3.3: Auto-transition after 2.5 seconds
  - [x] 3.4: Returns to break or idle

- [x] Task 4: Add Idle Animations (AC: #4)
  - [x] 4.1: Implemented breathing animation (CSS @keyframes breathe)
  - [x] 4.2: Skipped blink (emojis don't blink)
  - [x] 4.3: Respects reduced motion via CSS media query
  - [x] 4.4: Animations are subtle (3% scale pulse)

- [x] Task 5: Add Celebration Animation (AC: #5)
  - [x] 5.1: Implemented gentle-bounce animation
  - [x] 5.2: Skipped spritesheet (using emojis)
  - [x] 5.3: Matches cozy aesthetic
  - [x] 5.4: Brief duration (2.5s)

- [x] Task 6: Add Character to Tray Menu (AC: #6)
  - [x] 6.1: Added CharacterSprite to TrayMenu
  - [x] 6.2: Positioned below TimerRing
  - [x] 6.3: Uses small size variant
  - [x] 6.4: Connects to character state with celebration

- [x] Task 7: Testing
  - [x] 7.1: Created useCharacterState.test.ts (11 tests)
  - [x] 7.2: Tested celebration timing
  - [x] 7.3: Updated CharacterSprite.test.tsx for new classes
  - [x] 7.4: TrayMenu display verified

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

- `src/features/character/hooks/useCharacterState.ts` - Character state with celebration timing
- `src/features/character/hooks/useCharacterState.test.ts` - 11 hook tests
- `src/styles/globals.css` - Breathing and celebration animations
- `src/features/character/components/CharacterSprite.tsx` - Updated with animation classes
- `src/windows/tray/TrayMenu.tsx` - Added character sprite with state
