# Story 4.5: Create Achievement Gallery View

Status: ready-for-dev

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

- [ ] Task 1: Create AchievementBadge Component (AC: #2, #3)
  - [ ] 1.1: Create `src/features/achievements/components/AchievementBadge.tsx`
  - [ ] 1.2: Accept props: achievement, isUnlocked, unlockedAt, progress
  - [ ] 1.3: Render icon with tier coloring
  - [ ] 1.4: Handle locked state (grayscale, reduced opacity)
  - [ ] 1.5: Show progress for locked achievements

- [ ] Task 2: Style Badge States (AC: #2, #3)
  - [ ] 2.1: Unlocked: Full color, tier glow
  - [ ] 2.2: Locked: Grayscale, 50% opacity
  - [ ] 2.3: Hover state for both
  - [ ] 2.4: Tier-specific colors (bronze/silver/gold/platinum)

- [ ] Task 3: Create AchievementGallery Component (AC: #1, #4)
  - [ ] 3.1: Create `src/features/achievements/components/AchievementGallery.tsx`
  - [ ] 3.2: Group by category (Streaks, Sessions)
  - [ ] 3.3: Sort unlocked first within groups
  - [ ] 3.4: Responsive grid layout

- [ ] Task 4: Create useAchievements Hook
  - [ ] 4.1: Create `src/features/achievements/hooks/useAchievements.ts`
  - [ ] 4.2: Fetch all achievements via IPC
  - [ ] 4.3: Merge definitions with unlock status
  - [ ] 4.4: Calculate progress for locked

- [ ] Task 5: Add "NEW" Indicator (AC: #6)
  - [ ] 5.1: Track recently unlocked achievements
  - [ ] 5.2: Show glow/badge on new unlocks
  - [ ] 5.3: Clear indicator after viewed

- [ ] Task 6: Add to Main Window (AC: #5)
  - [ ] 6.1: Create achievements view/tab
  - [ ] 6.2: Route from tray menu
  - [ ] 6.3: Display AchievementGallery

- [ ] Task 7: Testing
  - [ ] 7.1: Test badge renders unlocked state
  - [ ] 7.2: Test badge renders locked state
  - [ ] 7.3: Test gallery grouping
  - [ ] 7.4: Test responsive layout

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
