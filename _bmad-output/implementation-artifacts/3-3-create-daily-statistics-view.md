# Story 3.3: Create Daily Statistics View

Status: ready-for-dev

## Story

As a user,
I want to see how many sessions I've completed today and my total focus time,
So that I can track my daily productivity.

## Acceptance Criteria

1. **Given** the session storage with today's data
   **When** I create the stats feature in `src/features/stats/`
   **Then** the following components exist:
     - `StatsCard.tsx` - reusable card for displaying a single stat
     - `TodayStats.tsx` - composition of today's statistics
   **And** components are in `src/features/stats/components/`

2. **Given** the StatsCard component
   **When** I render a stat card
   **Then** the card displays:
     - An icon (Lucide icon)
     - A primary value (large text)
     - A label (smaller muted text)
     - Optional secondary text (e.g., comparison)
   **And** the card uses `bg-cozy-surface` background
   **And** the card has `rounded-xl` (16px) border radius
   **And** the card has 20px padding

3. **Given** session data exists for today
   **When** I view the TodayStats component
   **Then** I see "Sessions Today" card showing completed session count (FR9)
   **And** I see "Focus Time" card showing total minutes/hours (FR10)
   **And** values update in real-time when sessions complete

4. **Given** no sessions exist for today
   **When** I view the TodayStats component
   **Then** "Sessions Today" shows "0"
   **And** "Focus Time" shows "0m"
   **And** the display is encouraging, not guilt-inducing

5. **Given** the stats components exist
   **When** I create `useStats` hook in `src/features/stats/hooks/useStats.ts`
   **Then** the hook fetches today's statistics via IPC
   **And** the hook provides `sessionsToday`, `focusTimeToday`, `completedCount`, `interruptedCount`
   **And** the hook updates when `SessionComplete` events are received

## Tasks / Subtasks

- [ ] Task 1: Create StatsCard Component (AC: #2)
  - [ ] 1.1: Create `src/features/stats/components/StatsCard.tsx`
  - [ ] 1.2: Accept props: icon, value, label, secondaryText
  - [ ] 1.3: Style with `bg-cozy-surface`, `rounded-xl`, padding
  - [ ] 1.4: Use cozy typography (value large, label muted)
  - [ ] 1.5: Create test file `StatsCard.test.tsx`

- [ ] Task 2: Create TodayStats Component (AC: #1, #3, #4)
  - [ ] 2.1: Create `src/features/stats/components/TodayStats.tsx`
  - [ ] 2.2: Compose two StatsCard components (sessions, focus time)
  - [ ] 2.3: Connect to useStats hook for data
  - [ ] 2.4: Handle empty state gracefully
  - [ ] 2.5: Create test file `TodayStats.test.tsx`

- [ ] Task 3: Create useStats Hook (AC: #5)
  - [ ] 3.1: Create `src/features/stats/hooks/useStats.ts`
  - [ ] 3.2: Fetch today's stats via `getTodayStats` IPC command
  - [ ] 3.3: Listen to `SessionSaved` events for updates
  - [ ] 3.4: Provide computed values (sessionsToday, focusTimeToday)
  - [ ] 3.5: Create test file `useStats.test.ts`

- [ ] Task 4: Implement Backend Stats Command (AC: #5)
  - [ ] 4.1: Create `getTodayStats` command in `src-tauri/src/commands/stats.rs`
  - [ ] 4.2: Read today's session file
  - [ ] 4.3: Calculate totals (completed count, interrupted count, total minutes)
  - [ ] 4.4: Return `TodayStatsResponse` struct

- [ ] Task 5: Add to Main Window (AC: #1)
  - [ ] 5.1: Import TodayStats into MainWindow.tsx
  - [ ] 5.2: Position prominently in stats view
  - [ ] 5.3: Apply responsive layout

- [ ] Task 6: Format Time Display
  - [ ] 6.1: Create `formatFocusTime(minutes)` utility
  - [ ] 6.2: Display as "Xm" for < 60 minutes
  - [ ] 6.3: Display as "Xh Ym" for >= 60 minutes
  - [ ] 6.4: Add to `src/shared/lib/formatTime.ts`

## Dev Notes

### Previous Stories Context

**Story 3.1-3.2 Established:**
- Session storage module with file I/O
- Sessions saved with complete/interrupted status
- `getTodaySessions` command available

**Story 2.3 Established:**
- QuickStats in tray menu (simpler version)
- Stats display patterns

### Component Design

**StatsCard Layout:**
```
┌────────────────────────────────┐
│  🎯  4                         │  ← Icon + Value (large)
│      Sessions Today            │  ← Label (muted)
│      Best: 8 sessions          │  ← Secondary (optional)
└────────────────────────────────┘
```

**TodayStats Layout:**
```
┌─────────────────┐ ┌─────────────────┐
│  🎯  4          │ │  ⏱  1h 40m     │
│  Sessions Today │ │  Focus Time    │
└─────────────────┘ └─────────────────┘
```

### Styling Guidelines

**From Architecture - StatsCard:**
- Background: `bg-cozy-surface` (#2A2422)
- Border radius: `rounded-xl` (16px)
- Padding: 20px
- Icon: Lucide, 24px, `text-cozy-accent`
- Value: `text-3xl font-bold text-cozy-text`
- Label: `text-sm text-cozy-muted`

### Backend Response

**TodayStatsResponse:**
```rust
#[derive(Serialize)]
struct TodayStatsResponse {
    completed_count: u32,
    interrupted_count: u32,
    total_focus_minutes: u32,
    sessions: Vec<SessionSummary>,
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/stats/components/StatsCard.tsx` | Reusable stat card |
| `src/features/stats/components/StatsCard.test.tsx` | Card tests |
| `src/features/stats/components/TodayStats.tsx` | Today's stats composition |
| `src/features/stats/components/TodayStats.test.tsx` | TodayStats tests |
| `src/features/stats/hooks/useStats.ts` | Stats fetching hook |
| `src/features/stats/hooks/useStats.test.ts` | Hook tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/commands/stats.rs` | Add getTodayStats |
| `src/windows/main/MainWindow.tsx` | Add TodayStats |
| `src/shared/lib/formatTime.ts` | Add formatFocusTime |

### References

- [Source: epics.md#Story-3.3] - Full acceptance criteria
- [Source: architecture.md#Frontend-Architecture] - Component structure
- [Source: prd.md#FR9-FR10] - Stats requirements

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
