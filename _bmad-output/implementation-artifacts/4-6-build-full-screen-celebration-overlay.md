# Story 4.6: Build Full-Screen Celebration Overlay

Status: review

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

- [x] Task 1: Create CelebrationOverlay Component (AC: #1, #2)
  - [x] 1.1: Create `src/features/achievements/components/CelebrationOverlay.tsx`
  - [x] 1.2: Full-screen overlay with dark background
  - [x] 1.3: Centered achievement display
  - [x] 1.4: "Continue" button
  - [x] 1.5: Entrance/exit animations

- [x] Task 2: Create ParticleSystem Component (AC: #3)
  - [x] 2.1: Create `src/features/achievements/components/ParticleSystem.tsx`
  - [x] 2.2: Generate confetti/sparkle particles
  - [x] 2.3: Animate particles falling/floating
  - [x] 2.4: Tier-appropriate colors
  - [x] 2.5: Respect prefers-reduced-motion

- [x] Task 3: Implement Tier-Based Celebrations (AC: #4)
  - [x] 3.1: Map achievement tier to celebration config
  - [x] 3.2: Duration: 3s/4s/5s/6s by tier
  - [x] 3.3: Particle intensity by tier
  - [x] 3.4: Sound cue by tier (prep for Epic 5)

- [x] Task 4: Handle Dismiss Logic (AC: #5)
  - [x] 4.1: "Continue" button dismisses
  - [x] 4.2: Auto-dismiss after timeout
  - [x] 4.3: Mark achievement as seen
  - [x] 4.4: Graceful fade-out animation

- [x] Task 5: Queue Multiple Celebrations (AC: #6)
  - [x] 5.1: Create celebration queue state
  - [x] 5.2: Process queue sequentially
  - [x] 5.3: 500ms pause between celebrations
  - [x] 5.4: Allow skip/fast-forward

- [x] Task 6: Connect to AchievementUnlocked Event
  - [x] 6.1: Listen to event in app root
  - [x] 6.2: Add to celebration queue
  - [x] 6.3: Trigger overlay display

- [x] Task 7: Testing
  - [x] 7.1: Test overlay renders correctly
  - [x] 7.2: Test different tier animations
  - [x] 7.3: Test queue processing
  - [x] 7.4: Test reduced-motion mode

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

Claude Sonnet 4 (Sisyphus Agent)

### Debug Log References

N/A - Implementation completed without blocking issues.

### Completion Notes List

- Implemented full-screen CelebrationOverlay component with tier-based celebrations
- Created ParticleSystem with 4 particle types: sparkle, confetti, confetti-rain, fireworks
- Implemented SimpleCelebration fallback for users with prefers-reduced-motion
- Auto-dismiss uses tier-based durations (3s/4s/5s/6s for bronze/silver/gold/platinum)
- Queue processing with 500ms delay between sequential celebrations
- User can click "Continue" or overlay background to dismiss early
- Achievement marked as viewed via markAchievementViewed() when dismissed
- App.tsx updated to listen for "achievement-unlocked" Tauri events
- Accessibility: dialog role, aria-modal, aria-labelledby attributes
- 54 new tests covering overlay rendering, dismiss behavior, auto-dismiss timing, queue processing, accessibility, and styling
- All 450 tests pass (396 existing + 54 new)

### File List

**Created:**
- src/features/achievements/components/CelebrationOverlay.tsx
- src/features/achievements/components/ParticleSystem.tsx
- src/features/achievements/components/SimpleCelebration.tsx
- src/features/achievements/components/CelebrationOverlay.test.tsx
- src/features/achievements/components/ParticleSystem.test.tsx
- src/features/achievements/components/SimpleCelebration.test.tsx

**Modified:**
- src/features/achievements/components/index.ts (added exports)
- src/App.tsx (added CelebrationOverlay and achievement-unlocked event listener)

## Change Log

- 2026-01-30: Implemented Story 4.6 - Full-screen celebration overlay with particle system, tier-based animations, queue processing, reduced-motion support, and comprehensive test coverage.
