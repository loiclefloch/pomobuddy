# Story 4.6: Build Full-Screen Celebration Overlay

Status: ready-for-dev

## Story

As a user,
I want a delightful celebration when I achieve a milestone,
So that my accomplishments feel special and earned.

## Acceptance Criteria

1. **Given** the `AchievementUnlocked` event from Story 4.4
   **When** I create the celebration overlay in `src/features/achievements/components/CelebrationOverlay.tsx`
   **Then** the overlay covers the entire window
   **And** the overlay has a dark semi-transparent background (`cozy-bg` at 95% opacity)
   **And** the overlay uses CSS animations for entrance

2. **Given** the CelebrationOverlay component
   **When** a milestone achievement unlocks (streak_7, streak_14, streak_30, sessions_100)
   **Then** the full-screen celebration is triggered
   **And** the overlay displays:
     - Achievement badge icon (large, 100px)
     - Achievement title in display font (Nunito 32px)
     - Achievement description
     - "Continue" button to dismiss
   **And** the badge has a glowing shadow effect

3. **Given** the celebration is shown
   **When** I implement the particle system in `ParticleSystem.tsx`
   **Then** confetti or sparkle particles animate across the screen
   **And** particles use achievement tier-appropriate colors
   **And** particles fade out over 3 seconds
   **And** the animation respects `prefers-reduced-motion` (UX14)

4. **Given** celebration tiers (from UX spec)
   **When** different achievements unlock
   **Then** celebration intensity matches achievement significance:
     - Bronze (first_session): 3s, sparkles, warm chime
     - Silver (streak_7): 4s, confetti burst, celebratory tune
     - Gold (streak_14, sessions_100): 5s, confetti rain, fanfare
     - Platinum (streak_30, sessions_500): 6s, fireworks, full fanfare

5. **Given** the celebration is displaying
   **When** user clicks "Continue" or waits 10 seconds
   **Then** the overlay fades out gracefully
   **And** the app returns to normal state
   **And** the achievement is marked as "seen" (no NEW indicator later)

6. **Given** multiple achievements unlock at once
   **When** celebrations are queued
   **Then** each celebration shows sequentially
   **And** there's a brief pause (500ms) between celebrations
   **And** user can click through faster if desired

## Tasks / Subtasks

- [ ] Task 1: Create CelebrationOverlay Component (AC: #1, #2)
  - [ ] 1.1: Create `src/features/achievements/components/CelebrationOverlay.tsx`
  - [ ] 1.2: Full-screen overlay with dark background
  - [ ] 1.3: Centered achievement display
  - [ ] 1.4: "Continue" button
  - [ ] 1.5: Entrance/exit animations

- [ ] Task 2: Create ParticleSystem Component (AC: #3)
  - [ ] 2.1: Create `src/features/achievements/components/ParticleSystem.tsx`
  - [ ] 2.2: Generate confetti/sparkle particles
  - [ ] 2.3: Animate particles falling/floating
  - [ ] 2.4: Tier-appropriate colors
  - [ ] 2.5: Respect prefers-reduced-motion

- [ ] Task 3: Implement Tier-Based Celebrations (AC: #4)
  - [ ] 3.1: Map achievement tier to celebration config
  - [ ] 3.2: Duration: 3s/4s/5s/6s by tier
  - [ ] 3.3: Particle intensity by tier
  - [ ] 3.4: Sound cue by tier (prep for Epic 5)

- [ ] Task 4: Handle Dismiss Logic (AC: #5)
  - [ ] 4.1: "Continue" button dismisses
  - [ ] 4.2: Auto-dismiss after timeout
  - [ ] 4.3: Mark achievement as seen
  - [ ] 4.4: Graceful fade-out animation

- [ ] Task 5: Queue Multiple Celebrations (AC: #6)
  - [ ] 5.1: Create celebration queue state
  - [ ] 5.2: Process queue sequentially
  - [ ] 5.3: 500ms pause between celebrations
  - [ ] 5.4: Allow skip/fast-forward

- [ ] Task 6: Connect to AchievementUnlocked Event
  - [ ] 6.1: Listen to event in app root
  - [ ] 6.2: Add to celebration queue
  - [ ] 6.3: Trigger overlay display

- [ ] Task 7: Testing
  - [ ] 7.1: Test overlay renders correctly
  - [ ] 7.2: Test different tier animations
  - [ ] 7.3: Test queue processing
  - [ ] 7.4: Test reduced-motion mode

## Dev Notes

### Visual Design (UX5)

**Celebration Overlay:**
```
┌─────────────────────────────────────────┐
│                                         │
│            ✨ ✨ ✨ ✨ ✨               │  ← Particles
│                                         │
│               🔥                        │  ← Large icon (100px)
│                                         │
│          Week Warrior                   │  ← Title (Nunito 32px)
│                                         │
│         7-day streak achieved!          │  ← Description
│                                         │
│          [ Continue ]                   │  ← Dismiss button
│                                         │
└─────────────────────────────────────────┘
```

### Tier Configuration

```typescript
const CELEBRATION_CONFIG = {
  bronze: {
    duration: 3000,
    particleCount: 20,
    particleType: 'sparkle',
    sound: 'chime',
  },
  silver: {
    duration: 4000,
    particleCount: 40,
    particleType: 'confetti',
    sound: 'celebration',
  },
  gold: {
    duration: 5000,
    particleCount: 60,
    particleType: 'confetti-rain',
    sound: 'fanfare',
  },
  platinum: {
    duration: 6000,
    particleCount: 100,
    particleType: 'fireworks',
    sound: 'full-fanfare',
  },
};
```

### Reduced Motion Support (UX14)

```typescript
const prefersReducedMotion = useReducedMotion();

if (prefersReducedMotion) {
  // Skip particles, use simple fade
  return <SimpleCelebration achievement={achievement} />;
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/achievements/components/CelebrationOverlay.tsx` | Main overlay |
| `src/features/achievements/components/ParticleSystem.tsx` | Confetti/sparkles |
| `src/features/achievements/components/SimpleCelebration.tsx` | Reduced motion version |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` or root | Add CelebrationOverlay provider |

### References

- [Source: epics.md#Story-4.6] - Full acceptance criteria
- [Source: ux-design-specification.md#UX5] - Celebration overlay
- [Source: ux-design-specification.md#UX14] - Reduced motion

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
