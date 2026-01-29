# Story 5.6: Add Session Boundary Sound Effects

Status: ready-for-dev

## Story

As a user,
I want gentle sound cues when sessions start and end,
So that I'm aware of transitions without jarring interruptions.

## Acceptance Criteria

1. **Given** the audio system from Story 5.5
   **When** I add sound effect files
   **Then** `public/assets/audio/` contains:
   - `session-start.mp3` - gentle chime for session start
   - `session-complete.mp3` - soft completion chime (UX4)
   - `break-complete.mp3` - break end notification sound
   - `celebration.mp3` - achievement/milestone fanfare
   **And** sounds are short (< 3 seconds)
   **And** sounds match the cozy aesthetic (warm, not harsh)

2. **Given** sound effects exist
   **When** I create `useSoundEffects` hook
   **Then** the hook provides:
   - `playSessionStart()` - plays start chime
   - `playSessionComplete()` - plays completion chime
   - `playBreakComplete()` - plays break end chime
   - `playCelebration(tier)` - plays celebration sound (varies by tier)
   **And** sounds respect `audioEnabled` setting

3. **Given** the timer fires events
   **When** a focus session starts
   **Then** a gentle start chime plays (if audio enabled)
   **And** the chime is subtle and non-intrusive

4. **Given** a focus session completes
   **When** the `SessionComplete` event fires
   **Then** the completion chime plays
   **And** the sound is distinctly different from start chime
   **And** the sound is satisfying and rewarding

5. **Given** a break completes
   **When** the break timer ends
   **Then** the break-complete chime plays
   **And** the sound gently prompts user to start next session

6. **Given** an achievement unlocks
   **When** the celebration overlay appears
   **Then** the celebration sound plays
   **And** sound intensity matches achievement tier:
     - Bronze: warm chime
     - Silver: celebratory tune
     - Gold/Platinum: full fanfare
   **And** sounds layer appropriately with celebration visuals

## Tasks / Subtasks

- [ ] Task 1: Add Sound Effect Files (AC: #1)
  - [ ] 1.1: Source/create session-start.mp3
  - [ ] 1.2: Source/create session-complete.mp3
  - [ ] 1.3: Source/create break-complete.mp3
  - [ ] 1.4: Source/create celebration sounds (by tier)
  - [ ] 1.5: Ensure all sounds < 3 seconds

- [ ] Task 2: Create useSoundEffects Hook (AC: #2)
  - [ ] 2.1: Create `src/shared/hooks/useSoundEffects.ts`
  - [ ] 2.2: Implement playSessionStart()
  - [ ] 2.3: Implement playSessionComplete()
  - [ ] 2.4: Implement playBreakComplete()
  - [ ] 2.5: Implement playCelebration(tier)
  - [ ] 2.6: Check audioEnabled setting

- [ ] Task 3: Connect to Timer Events (AC: #3, #4, #5)
  - [ ] 3.1: Play start sound on timer start
  - [ ] 3.2: Play complete sound on SessionComplete
  - [ ] 3.3: Play break sound on break complete

- [ ] Task 4: Connect to Achievement Events (AC: #6)
  - [ ] 4.1: Play celebration on AchievementUnlocked
  - [ ] 4.2: Select sound by achievement tier
  - [ ] 4.3: Sync with celebration overlay

- [ ] Task 5: Audio Preloading
  - [ ] 5.1: Preload all sound effects on app start
  - [ ] 5.2: Ensure no delay on playback
  - [ ] 5.3: Handle load failures gracefully

- [ ] Task 6: Testing
  - [ ] 6.1: Test each sound plays correctly
  - [ ] 6.2: Test sounds respect settings
  - [ ] 6.3: Test tier-specific celebration sounds
  - [ ] 6.4: Test no sound when disabled

## Dev Notes

### Sound Effect Specifications

| Sound | Duration | Style | Use Case |
|-------|----------|-------|----------|
| session-start | 1s | Gentle rising chime | Focus session begins |
| session-complete | 1.5s | Warm completion tone | Session finished |
| break-complete | 1s | Soft notification | Break ended |
| celebration-bronze | 1.5s | Warm chime | Minor achievement |
| celebration-silver | 2s | Celebratory tune | Medium achievement |
| celebration-gold | 2.5s | Fanfare | Major achievement |

### useSoundEffects Implementation

```typescript
export function useSoundEffects() {
  const { audioEnabled } = useSettingsStore();
  
  const playSound = useCallback((src: string) => {
    if (!audioEnabled) return;
    const audio = new Audio(src);
    audio.play().catch(console.error);
  }, [audioEnabled]);
  
  return {
    playSessionStart: () => playSound('/assets/audio/session-start.mp3'),
    playSessionComplete: () => playSound('/assets/audio/session-complete.mp3'),
    playBreakComplete: () => playSound('/assets/audio/break-complete.mp3'),
    playCelebration: (tier: AchievementTier) => {
      const sounds = {
        bronze: '/assets/audio/celebration-bronze.mp3',
        silver: '/assets/audio/celebration-silver.mp3',
        gold: '/assets/audio/celebration-gold.mp3',
        platinum: '/assets/audio/celebration-gold.mp3', // Same as gold
      };
      playSound(sounds[tier]);
    },
  };
}
```

### Sound Design Guidelines

- **Warm tones**: Use instruments like bells, chimes, soft synths
- **Non-jarring**: Gradual attack, smooth release
- **Cozy aesthetic**: Match the app's visual warmth
- **Distinct but cohesive**: Each sound recognizable but part of same family

### Files to Create

| File | Purpose |
|------|---------|
| `src/shared/hooks/useSoundEffects.ts` | Sound effects hook |
| `public/assets/audio/session-start.mp3` | Start chime |
| `public/assets/audio/session-complete.mp3` | Complete chime |
| `public/assets/audio/break-complete.mp3` | Break end sound |
| `public/assets/audio/celebration-*.mp3` | Celebration sounds |

### Files to Modify

| File | Changes |
|------|---------|
| Timer event handlers | Add sound playback |
| CelebrationOverlay | Add celebration sound |

### References

- [Source: epics.md#Story-5.6] - Full acceptance criteria
- [Source: ux-design-specification.md#UX4] - Soft chime sounds

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
