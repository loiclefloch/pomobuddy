# Story 4.5: Create Achievement Gallery View

Status: review

## Story

As a user,
I want to view all my earned achievements and see which ones I'm working toward,
So that I can celebrate my progress and set goals.

## Acceptance Criteria

1. **Given** achievement data from Stories 4.3 and 4.4
   **When** I create the achievement gallery in `src/features/achievements/components/`
   **Then** `AchievementGallery.tsx` displays all achievements in a grid
   **And** `AchievementBadge.tsx` renders individual achievement cards

2. **Given** the AchievementBadge component
   **When** rendering an unlocked achievement
   **Then** the badge displays:
     - Icon in full color (tier-appropriate coloring)
     - Achievement title
     - Unlock date
     - Full opacity and visual prominence
   **And** the badge uses character-specific accent colors if applicable

3. **Given** the AchievementBadge component
   **When** rendering a locked achievement
   **Then** the badge displays:
     - Icon in muted/grayscale color
     - Achievement title
     - Progress hint (e.g., "3/7 days" for streak_7)
     - Reduced opacity (50-60%)
   **And** hovering shows the unlock requirement

4. **Given** the AchievementGallery component
   **When** displaying all achievements (FR17)
   **Then** achievements are grouped by category (Streaks, Sessions)
   **And** unlocked achievements appear first within each group
   **And** the grid is responsive (2-4 columns based on window width)

5. **Given** the main window
   **When** user clicks "Achievements" from tray menu
   **Then** the main window opens to the achievements tab/view
   **And** the gallery is displayed with current achievement status

6. **Given** an achievement was recently unlocked
   **When** viewing the gallery
   **Then** the recently unlocked badge has a subtle glow or "NEW" indicator
   **And** the indicator fades after the badge is viewed

## Tasks / Subtasks

- [x] Task 1: Create AchievementBadge Component (AC: #2, #3)
  - [x] 1.1: Create `src/features/achievements/components/AchievementBadge.tsx`
  - [x] 1.2: Accept props: achievement, isUnlocked, unlockedAt, progress
  - [x] 1.3: Render icon with tier coloring
  - [x] 1.4: Handle locked state (grayscale, reduced opacity)
  - [x] 1.5: Show progress for locked achievements

- [x] Task 2: Style Badge States (AC: #2, #3)
  - [x] 2.1: Unlocked: Full color, tier glow
  - [x] 2.2: Locked: Grayscale, 50% opacity
  - [x] 2.3: Hover state for both
  - [x] 2.4: Tier-specific colors (bronze/silver/gold/platinum)

- [x] Task 3: Create AchievementGallery Component (AC: #1, #4)
  - [x] 3.1: Create `src/features/achievements/components/AchievementGallery.tsx`
  - [x] 3.2: Group by category (Streaks, Sessions)
  - [x] 3.3: Sort unlocked first within groups
  - [x] 3.4: Responsive grid layout

- [x] Task 4: Create useAchievements Hook (already existed from 4.4)
  - [x] 4.1: Verify `src/features/achievements/hooks/useAchievements.ts` exists
  - [x] 4.2: Fetch all achievements via IPC
  - [x] 4.3: Merge definitions with unlock status
  - [x] 4.4: Calculate progress for locked

- [x] Task 5: Add "NEW" Indicator (AC: #6)
  - [x] 5.1: Track recently unlocked achievements
  - [x] 5.2: Show glow/badge on new unlocks
  - [x] 5.3: Clear indicator after viewed

- [x] Task 6: Add to Main Window (AC: #5)
  - [x] 6.1: Create achievements view/tab
  - [x] 6.2: Route from tray menu
  - [x] 6.3: Display AchievementGallery

- [x] Task 7: Testing
  - [x] 7.1: Test badge renders unlocked state
  - [x] 7.2: Test badge renders locked state
  - [x] 7.3: Test gallery grouping
  - [x] 7.4: Test responsive layout

## Dev Notes

### Visual Design

**AchievementBadge (Unlocked):**
```
┌────────────────┐
│      🔥       │  ← Tier-colored icon
│  Week Warrior │  ← Title
│   Jan 29      │  ← Unlock date
└────────────────┘
```

**AchievementBadge (Locked):**
```
┌────────────────┐
│      🔥       │  ← Grayscale icon
│  Week Warrior │  ← Title (muted)
│    3/7 days   │  ← Progress
└────────────────┘
```

**Gallery Layout:**
```
┌─────────────────────────────────────┐
│  Streak Achievements                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ ✓  │ │ ✓  │ │ 🔒 │ │ 🔒 │       │
│  └────┘ └────┘ └────┘ └────┘       │
│                                      │
│  Session Achievements                │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ ✓  │ │ 🔒 │ │ 🔒 │ │ 🔒 │       │
│  └────┘ └────┘ └────┘ └────┘       │
└─────────────────────────────────────┘
```

### Progress Calculation

```typescript
function getProgress(achievement: Achievement, stats: Stats): string {
  switch (achievement.requirement.type) {
    case 'streak':
      return `${stats.currentStreak}/${achievement.requirement.value} days`;
    case 'sessions':
      return `${stats.totalSessions}/${achievement.requirement.value} sessions`;
  }
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/achievements/components/AchievementBadge.tsx` | Badge component |
| `src/features/achievements/components/AchievementGallery.tsx` | Gallery view |
| `src/features/achievements/hooks/useAchievements.ts` | Data fetching |

### Files to Modify

| File | Changes |
|------|---------|
| `src/windows/main/MainWindow.tsx` | Add achievements view |

### References

- [Source: epics.md#Story-4.5] - Full acceptance criteria
- [Source: prd.md#FR17] - View earned achievements

## Dev Agent Record

### Agent Model Used

Claude (Anthropic)

### Debug Log References

N/A - Implementation proceeded without blocking issues

### Completion Notes List

- Created AchievementBadge component with full tier-based styling (bronze/silver/gold/platinum)
- Implemented unlocked state with full color, tier-appropriate glow effects
- Implemented locked state with grayscale filter and 50% opacity
- Added progress display for locked achievements showing current/target values
- Added hover tooltip showing unlock requirements for locked achievements
- Created AchievementGallery component with category grouping (Streaks, Sessions)
- Implemented sorting with unlocked achievements appearing first
- Added responsive grid layout (2-4 columns based on viewport)
- Extended achievementStore with viewedAchievements tracking for NEW indicator
- Added localStorage persistence for viewed achievements state
- Implemented NEW indicator that appears on recently unlocked achievements
- Indicator clears on hover (when achievement is viewed)
- Updated App.tsx with view-based navigation (timer/achievements views)
- Added openMainWindowWithView utility for tray menu navigation
- Updated TrayMenu to navigate to achievements view when clicking "Achievements"
- Added Trophy icon button in main timer view for quick navigation to achievements
- All 396 tests pass with 33 new tests added for achievement components

### File List

New Files:
- src/features/achievements/components/AchievementBadge.tsx
- src/features/achievements/components/AchievementBadge.test.tsx
- src/features/achievements/components/AchievementGallery.tsx
- src/features/achievements/components/AchievementGallery.test.tsx

Modified Files:
- src/features/achievements/components/index.ts
- src/features/achievements/stores/achievementStore.ts
- src/features/achievements/stores/achievementStore.test.ts
- src/App.tsx
- src/shared/utils/window.ts
- src/windows/tray/TrayMenu.tsx

## Change Log

| Date | Change |
|------|--------|
| 2026-01-29 | Story implementation completed - Achievement gallery view with full styling, grouping, NEW indicators, and main window integration |
