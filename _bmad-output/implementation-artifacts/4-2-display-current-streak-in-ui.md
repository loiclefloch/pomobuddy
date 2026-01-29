# Story 4.2: Display Current Streak in UI

Status: ready-for-dev

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

- [ ] Task 1: Create useStreakStore (AC: #5)
  - [ ] 1.1: Create `src/features/achievements/stores/streakStore.ts`
  - [ ] 1.2: Define state: currentStreak, longestStreak
  - [ ] 1.3: Listen to `StreakUpdated` Tauri event
  - [ ] 1.4: Fetch initial streak data on mount

- [ ] Task 2: Update QuickStats for Streak (AC: #1)
  - [ ] 2.1: Connect QuickStats to useStreakStore
  - [ ] 2.2: Display streak with flame icon
  - [ ] 2.3: Format as "Day X" or "X days"
  - [ ] 2.4: Handle 0 streak gracefully

- [ ] Task 3: Create StreakCard Component (AC: #2)
  - [ ] 3.1: Create `src/features/achievements/components/StreakCard.tsx`
  - [ ] 3.2: Use StatsCard styling (bg-cozy-surface, rounded-xl)
  - [ ] 3.3: Display flame icon with cozy-accent color
  - [ ] 3.4: Show "Best: X days" secondary text
  - [ ] 3.5: Create test file

- [ ] Task 4: Handle Empty State (AC: #3)
  - [ ] 4.1: Display "Start streak!" when currentStreak is 0
  - [ ] 4.2: Encouraging tone in all copy
  - [ ] 4.3: No shame indicators

- [ ] Task 5: Add Milestone Indicators (AC: #4)
  - [ ] 5.1: Detect milestone streaks (7, 14, 30)
  - [ ] 5.2: Add subtle glow or badge on milestone
  - [ ] 5.3: Connect to achievement display (prep for 4.4)

- [ ] Task 6: Add to Main Window
  - [ ] 6.1: Import StreakCard
  - [ ] 6.2: Position alongside TodayStats
  - [ ] 6.3: Responsive layout

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
