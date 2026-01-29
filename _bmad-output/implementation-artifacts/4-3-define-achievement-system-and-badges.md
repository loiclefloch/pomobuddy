# Story 4.3: Define Achievement System and Badges

Status: review

## Story

As a user,
I want a collection of achievements I can earn,
So that I have goals to work toward and milestones to celebrate.

## Acceptance Criteria

1. **Given** the achievements feature
   **When** I define the achievement types in `src/features/achievements/types.ts`
   **Then** an `Achievement` interface includes:
     - `id`: unique identifier (e.g., "streak_7", "sessions_100")
     - `title`: display name (e.g., "Week Warrior")
     - `description`: what was accomplished
     - `icon`: Lucide icon name
     - `tier`: "bronze" | "silver" | "gold" | "platinum"
     - `unlockedAt`: ISO date string | null

2. **Given** achievement types are defined
   **When** I create the achievement definitions
   **Then** the following achievements exist:
   
   **Streak Achievements:**
   - `first_session`: "First Focus" - Complete your first session (bronze)
   - `streak_7`: "Week Warrior" - 7-day streak (silver)
   - `streak_14`: "Fortnight Focus" - 14-day streak (gold)
   - `streak_30`: "Monthly Master" - 30-day streak (platinum)
   
   **Session Count Achievements:**
   - `sessions_10`: "Getting Started" - 10 total sessions (bronze)
   - `sessions_50`: "Half Century" - 50 total sessions (silver)
   - `sessions_100`: "Centurion" - 100 total sessions (gold)
   - `sessions_500`: "Focus Legend" - 500 total sessions (platinum)

3. **Given** achievement definitions exist
   **When** I store unlocked achievements in `achievements.json` (AR9)
   **Then** the file format includes unlocked array with timestamps
   **And** the file is created on first launch with empty `unlocked` array

4. **Given** achievement icons are needed
   **When** I map achievements to Lucide icons
   **Then** each achievement has an appropriate icon:
     - Streak achievements: `flame`, `zap`, `award`
     - Session achievements: `target`, `trophy`, `medal`, `crown`

## Tasks / Subtasks

- [x] Task 1: Define Achievement Types (AC: #1)
  - [x] 1.1: Create `src/features/achievements/types.ts`
  - [x] 1.2: Define `Achievement` interface
  - [x] 1.3: Define `AchievementTier` type
  - [x] 1.4: Define `UnlockedAchievement` interface

- [x] Task 2: Create Achievement Definitions (AC: #2)
  - [x] 2.1: Create `src/features/achievements/data/achievements.ts`
  - [x] 2.2: Define streak achievements (first_session, streak_7, streak_14, streak_30)
  - [x] 2.3: Define session achievements (sessions_10, sessions_50, sessions_100, sessions_500)
  - [x] 2.4: Export as ACHIEVEMENTS constant

- [x] Task 3: Map Achievement Icons (AC: #4)
  - [x] 3.1: Assign Lucide icons to each achievement
  - [x] 3.2: first_session: Flame
  - [x] 3.3: streak_*: Flame, Zap, Award, Crown
  - [x] 3.4: sessions_*: Target, Trophy, Medal, Crown

- [x] Task 4: Define Tier Colors
  - [x] 4.1: Bronze: `#CD7F32` (warm bronze)
  - [x] 4.2: Silver: `#C0C0C0` (silver)
  - [x] 4.3: Gold: `#FFD700` (gold)
  - [x] 4.4: Platinum: `#E5E4E2` (platinum)

- [x] Task 5: Backend Achievement Schema (AC: #3)
  - [x] 5.1: Update achievements.rs with full Achievement struct
  - [x] 5.2: Implement serialization for achievements.json
  - [x] 5.3: Add totalSessions tracking

- [x] Task 6: Create Achievement Utility Functions
  - [x] 6.1: `getAchievementById(id)` function
  - [x] 6.2: `isAchievementUnlocked(id)` function
  - [x] 6.3: `getProgress(achievementId)` for progress calculation

## Dev Notes

### Achievement Definitions

```typescript
// types.ts
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  tier: AchievementTier;
  requirement: {
    type: 'streak' | 'sessions';
    value: number;
  };
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string; // ISO date
}
```

### Achievement Data

```typescript
// data/achievements.ts
export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'first_session',
    title: 'First Focus',
    description: 'Complete your first session',
    icon: 'Flame',
    tier: 'bronze',
    requirement: { type: 'sessions', value: 1 },
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: '7-day streak',
    icon: 'Zap',
    tier: 'silver',
    requirement: { type: 'streak', value: 7 },
  },
  // ... etc
];
```

### Tier Visual System

| Tier | Color | Glow | Animation |
|------|-------|------|-----------|
| Bronze | #CD7F32 | Subtle | None |
| Silver | #C0C0C0 | Medium | Shimmer |
| Gold | #FFD700 | Strong | Sparkle |
| Platinum | #E5E4E2 | Intense | Pulse |

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/achievements/types.ts` | Achievement types |
| `src/features/achievements/data/achievements.ts` | Achievement definitions |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/storage/achievements.rs` | Full schema support |

### References

- [Source: epics.md#Story-4.3] - Full acceptance criteria
- [Source: architecture.md#AR9] - achievements.json format

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4 (Sisyphus)

### Debug Log References

None - implementation completed without errors.

### Completion Notes List

- Implemented complete Achievement type system with tier, requirement, and unlocked tracking
- Created 8 achievement definitions: 4 streak-based and 4 session count-based
- Added TIER_COLORS constant with visual styling (color, glow intensity, animation)
- Created utility functions: getAchievementById, isAchievementUnlocked, getProgress
- Added comprehensive test coverage (48 new tests across 3 test files)
- All 351 tests pass with no regressions
- Backend already had full achievement schema support (verified existing implementation)

### File List

- src/features/achievements/types.ts (modified)
- src/features/achievements/types.test.ts (new)
- src/features/achievements/data/achievements.ts (new)
- src/features/achievements/data/achievements.test.ts (new)
- src/features/achievements/data/index.ts (new)
- src/features/achievements/utils/achievementUtils.ts (new)
- src/features/achievements/utils/achievementUtils.test.ts (new)
- src/features/achievements/utils/index.ts (new)
- src/features/achievements/index.ts (new)

## Change Log

- 2026-01-29: Initial implementation of achievement system types, definitions, and utilities
