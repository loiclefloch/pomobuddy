# Story 3.3: Create Daily Statistics View

Status: review

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

- [x] Task 1: Create StatsCard Component (AC: #2)
  - [x] 1.1: Create `src/features/stats/components/StatsCard.tsx`
  - [x] 1.2: Accept props: icon, value, label, secondaryText
  - [x] 1.3: Style with `bg-cozy-surface`, `rounded-xl`, padding
  - [x] 1.4: Use cozy typography (value large, label muted)
  - [x] 1.5: Create test file `StatsCard.test.tsx`

- [x] Task 2: Create TodayStats Component (AC: #1, #3, #4)
  - [x] 2.1: Create `src/features/stats/components/TodayStats.tsx`
  - [x] 2.2: Compose two StatsCard components (sessions, focus time)
  - [x] 2.3: Connect to useStats hook for data
  - [x] 2.4: Handle empty state gracefully
  - [x] 2.5: Create test file `TodayStats.test.tsx`

- [x] Task 3: Create useStats Hook (AC: #5)
  - [x] 3.1: Create `src/features/stats/hooks/useStats.ts`
  - [x] 3.2: Fetch today's stats via `getTodayStats` IPC command
  - [x] 3.3: Listen to `SessionSaved` events for updates
  - [x] 3.4: Provide computed values (sessionsToday, focusTimeToday)
  - [x] 3.5: Create test file `useStats.test.ts`

- [x] Task 4: Implement Backend Stats Command (AC: #5)
  - [x] 4.1: Create `getTodayStats` command in `src-tauri/src/commands/stats.rs`
  - [x] 4.2: Read today's session file
  - [x] 4.3: Calculate totals (completed count, interrupted count, total minutes)
  - [x] 4.4: Return `TodayStatsResponse` struct

- [x] Task 5: Add to Main Window (AC: #1)
  - [x] 5.1: Import TodayStats into App.tsx (main entry)
  - [x] 5.2: Position prominently in stats view
  - [x] 5.3: Apply responsive layout

- [x] Task 6: Format Time Display
  - [x] 6.1: `formatFocusTime(minutes)` utility already exists
  - [x] 6.2: Display as "Xm" for < 60 minutes
  - [x] 6.3: Display as "Xh Ym" for >= 60 minutes
  - [x] 6.4: Verified in `src/shared/lib/formatTime.ts`, added test for 0m case

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

Claude Sonnet 4 (Sisyphus via OpenCode)

### Debug Log References

No debug issues encountered.

### Completion Notes List

- Implemented StatsCard component with full styling per AC#2 (bg-cozy-surface, rounded-xl, p-5)
- Created TodayStats component composing two StatsCard instances for Sessions Today and Focus Time
- Implemented useStats hook fetching data via IPC and listening to SessionSaved/SessionComplete events
- Enhanced backend stats.rs with get_today_stats command using existing session storage
- Updated get_quick_stats to also use real session data
- Added TodayStats to App.tsx main window
- formatFocusTime utility already existed - verified and added 0m test case
- All 185 tests pass, TypeScript compilation clean, Rust code compiles

### File List

**Created:**
- `src/features/stats/components/StatsCard.tsx`
- `src/features/stats/components/StatsCard.test.tsx`
- `src/features/stats/components/TodayStats.tsx`
- `src/features/stats/components/TodayStats.test.tsx`
- `src/features/stats/hooks/useStats.ts`
- `src/features/stats/hooks/useStats.test.ts`

**Modified:**
- `src-tauri/src/commands/stats.rs` - Added get_today_stats command, refactored get_quick_stats to use real data
- `src-tauri/src/lib.rs` - Registered get_today_stats command
- `src/features/stats/components/index.ts` - Exported StatsCard and TodayStats
- `src/App.tsx` - Added TodayStats component to main view
- `src/shared/lib/formatTime.test.ts` - Added test for 0m case

## Change Log

- 2026-01-29: Story implementation complete - all tasks done, 185 tests passing, ready for review
