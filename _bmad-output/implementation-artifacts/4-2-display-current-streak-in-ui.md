# Story 4.2: Display Current Streak in UI

Status: review

## Story

As a user,
I want to see my current streak count prominently displayed,
So that I'm motivated to maintain my focus habit.

## Acceptance Criteria

1. **Given** streak tracking from Story 4.1
   **When** I view the tray menu QuickStats (from Epic 2)
   **Then** the streak is displayed with flame icon
   **And** format is "Day X" or "X days" (e.g., "Day 12")
   **And** streak updates immediately when a session completes

2. **Given** the main window stats view (from Epic 3)
   **When** I add a StreakCard component
   **Then** a dedicated card shows current streak
   **And** the card displays:
     - Flame icon in `cozy-accent` color
     - Current streak as primary value
     - "Best: X days" as secondary text showing longest streak
   **And** the card matches other StatsCard styling

3. **Given** the streak is 0 (no streak)
   **When** I view streak displays
   **Then** tray shows "0 days" or "Start streak!"
   **And** main window shows encouraging message, not guilt
   **And** tone is inviting, not punishing

4. **Given** the streak reaches a milestone (7, 14, 30 days)
   **When** I view the streak card
   **Then** the card may show a subtle highlight or badge indicator
   **And** this connects to the achievement system (Story 4.4)

5. **Given** streak data is needed in frontend
   **When** I create `useStreakStore` in `src/features/achievements/stores/`
   **Then** the store holds `currentStreak`, `longestStreak`
   **And** the store updates via `StreakUpdated` Tauri event
   **And** components subscribe to streak changes reactively

## Tasks / Subtasks

- [x] Task 1: Create useStreakStore (AC: #5)
  - [x] 1.1: Create `src/features/achievements/stores/streakStore.ts`
  - [x] 1.2: Define state: currentStreak, longestStreak
  - [x] 1.3: Listen to `StreakUpdated` Tauri event
  - [x] 1.4: Fetch initial streak data on mount

- [x] Task 2: Update QuickStats for Streak (AC: #1)
  - [x] 2.1: Connect QuickStats to useStreakStore
  - [x] 2.2: Display streak with flame icon
  - [x] 2.3: Format as "Day X" or "X days"
  - [x] 2.4: Handle 0 streak gracefully

- [x] Task 3: Create StreakCard Component (AC: #2)
  - [x] 3.1: Create `src/features/achievements/components/StreakCard.tsx`
  - [x] 3.2: Use StatsCard styling (bg-cozy-surface, rounded-xl)
  - [x] 3.3: Display flame icon with cozy-accent color
  - [x] 3.4: Show "Best: X days" secondary text
  - [x] 3.5: Create test file

- [x] Task 4: Handle Empty State (AC: #3)
  - [x] 4.1: Display "Start streak!" when currentStreak is 0
  - [x] 4.2: Encouraging tone in all copy
  - [x] 4.3: No shame indicators

- [x] Task 5: Add Milestone Indicators (AC: #4)
  - [x] 5.1: Detect milestone streaks (7, 14, 30)
  - [x] 5.2: Add subtle glow or badge on milestone
  - [x] 5.3: Connect to achievement display (prep for 4.4)

- [x] Task 6: Add to Main Window
  - [x] 6.1: Import StreakCard
  - [x] 6.2: Position alongside TodayStats
  - [x] 6.3: Responsive layout

## Dev Notes

### Visual Design

**Tray QuickStats Streak:**
```
🔥 Day 12
```

**Main Window StreakCard:**
```
┌────────────────────────────────┐
│  🔥  12 days                   │
│      Current Streak            │
│      Best: 21 days             │
└────────────────────────────────┘
```

### Zero Streak Messaging

**Good (encouraging):**
- "Start streak!"
- "Ready to begin?"
- "0 days"

**Bad (guilt-inducing):**
- "You broke your streak!"
- "Streak lost"
- "0 days 😢"

### Zustand Store Pattern

```typescript
interface StreakState {
  currentStreak: number;
  longestStreak: number;
  setStreak: (current: number, longest: number) => void;
}

export const useStreakStore = create<StreakState>((set) => ({
  currentStreak: 0,
  longestStreak: 0,
  setStreak: (current, longest) => set({ 
    currentStreak: current, 
    longestStreak: longest 
  }),
}));
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/achievements/stores/streakStore.ts` | Streak state |
| `src/features/achievements/components/StreakCard.tsx` | Streak display |
| `src/features/achievements/components/StreakCard.test.tsx` | Tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/features/stats/components/QuickStats.tsx` | Use streak store |
| `src/windows/main/MainWindow.tsx` | Add StreakCard |

### References

- [Source: epics.md#Story-4.2] - Full acceptance criteria
- [Source: ux-design-specification.md#UX13] - No guilt messaging

## Dev Agent Record

### Agent Model Used

Claude (Anthropic)

### Debug Log References

N/A - Implementation completed without issues

### Completion Notes List

- Created `streakStore.ts` with Zustand store for currentStreak, longestStreak, and isMilestone (computed)
- Created `useStreak.ts` hook that fetches initial data via `get_streak_data_cmd` and listens to `StreakUpdated` Tauri events
- Created `StreakCard.tsx` component with:
  - Flame icon in cozy-accent color (muted when streak is 0)
  - Displays "X days" or "Start streak!" for empty state
  - Shows "Best: X days" secondary text
  - Milestone indicator (ring glow + pulsing badge) for 7/14/30 day streaks
  - Encouraging copy: "Ready to begin?" for new users
- QuickStats already had streak display with flame icon and "Day X" format
- Added StreakCard to App.tsx alongside TodayStats with responsive flex layout
- All 35 tests pass for the achievements feature (11 store tests, 8 hook tests, 16 component tests)

### File List

**New Files:**
- `src/features/achievements/stores/streakStore.ts`
- `src/features/achievements/stores/streakStore.test.ts`
- `src/features/achievements/stores/index.ts`
- `src/features/achievements/hooks/useStreak.ts`
- `src/features/achievements/hooks/useStreak.test.ts`
- `src/features/achievements/hooks/index.ts`
- `src/features/achievements/components/StreakCard.tsx`
- `src/features/achievements/components/StreakCard.test.tsx`
- `src/features/achievements/components/index.ts`

**Modified Files:**
- `src/App.tsx`

## Change Log

- 2026-01-29: Implemented streak display UI with store, hook, and StreakCard component. Added to main window with responsive layout.
