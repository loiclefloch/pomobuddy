# Story 3.5: Implement Weekly Bar Chart Visualization

Status: review

## Story

As a user,
I want to see a bar chart of my weekly focus hours,
So that I can visualize my productivity trends.

## Acceptance Criteria

1. **Given** session data for the past 7 days
   **When** I create the `WeeklyBarChart` component in `src/features/stats/components/`
   **Then** the component displays 7 vertical bars (Mon-Sun or rolling 7 days)
   **And** bar height is proportional to focus hours for that day
   **And** the chart has labeled x-axis with day abbreviations

2. **Given** the WeeklyBarChart component
   **When** I style the chart
   **Then** bars use `bg-cozy-accent` (#E8A598) color
   **And** today's bar is highlighted at full opacity
   **And** other days' bars are at 60% opacity
   **And** bars have `rounded-t-md` (6px) top corners
   **And** empty days show a minimal stub (not zero height)

3. **Given** the chart is interactive
   **When** I hover over a bar
   **Then** a tooltip shows:
     - Day name and date
     - Total focus hours (e.g., "2h 15m")
     - Number of sessions completed

4. **Given** weekly data needs to be calculated
   **When** I implement `getWeeklyStats()` Rust command
   **Then** the command returns an array of 7 daily totals
   **And** each entry includes: date, focusMinutes, sessionCount
   **And** the week starts from 6 days ago to today

5. **Given** the main window stats view
   **When** I add the WeeklyBarChart
   **Then** the chart is displayed below the stat cards (UX8)
   **And** the chart has a header "This Week"
   **And** a weekly total is shown (e.g., "12.5 hours total")

## Tasks / Subtasks

- [x] Task 1: Create WeeklyBarChart Component (AC: #1, #2)
  - [x] 1.1: Create `src/features/stats/components/WeeklyBarChart.tsx`
  - [x] 1.2: Render 7 vertical bars using CSS/div elements
  - [x] 1.3: Calculate bar heights from data (scale to max)
  - [x] 1.4: Style with cozy-accent color and opacity variants
  - [x] 1.5: Add day labels on x-axis (Mon, Tue, etc.)

- [x] Task 2: Implement Bar Styling (AC: #2)
  - [x] 2.1: Today's bar at 100% opacity
  - [x] 2.2: Other bars at 60% opacity
  - [x] 2.3: Rounded top corners (`rounded-t-md`)
  - [x] 2.4: Minimum stub height for empty days (4px)
  - [x] 2.5: Smooth hover transitions

- [x] Task 3: Add Tooltips (AC: #3)
  - [x] 3.1: Use shadcn/ui Tooltip or custom hover tooltip
  - [x] 3.2: Show day name and date
  - [x] 3.3: Show focus time formatted
  - [x] 3.4: Show session count
  - [x] 3.5: Position tooltip above bar

- [x] Task 4: Implement Backend Command (AC: #4)
  - [x] 4.1: Create `getWeeklyStats` command
  - [x] 4.2: Read session files for last 7 days
  - [x] 4.3: Calculate daily totals
  - [x] 4.4: Return array of 7 day entries

- [x] Task 5: Create useWeeklyData Hook (AC: #4)
  - [x] 5.1: Create `src/features/stats/hooks/useWeeklyData.ts`
  - [x] 5.2: Fetch weekly data via IPC
  - [x] 5.3: Calculate weekly total
  - [x] 5.4: Update on session complete

- [x] Task 6: Add Chart Header (AC: #5)
  - [x] 6.1: "This Week" title
  - [x] 6.2: Weekly total display (e.g., "12.5 hours total")
  - [x] 6.3: Style consistently with other sections

- [x] Task 7: Add to Main Window (AC: #5)
  - [x] 7.1: Import WeeklyBarChart
  - [x] 7.2: Position below TodayStats cards
  - [x] 7.3: Responsive width

## Dev Notes

### Visual Design

**WeeklyBarChart Layout (UX8):**
```
┌─────────────────────────────────────────────────────┐
│  This Week                      12.5 hours total   │
│                                                     │
│   ▓▓▓                                              │
│   ▓▓▓  ▒▒▒                                         │
│   ▓▓▓  ▒▒▒  ▒▒▒                                    │
│   ▓▓▓  ▒▒▒  ▒▒▒  ▒▒▒        ▒▒▒                   │
│   ▓▓▓  ▒▒▒  ▒▒▒  ▒▒▒  ▒▒▒  ▒▒▒  ░░░              │
│  ─────────────────────────────────────────────     │
│   Mon  Tue  Wed  Thu  Fri  Sat  Sun                │
└─────────────────────────────────────────────────────┘

▓▓▓ = Today (100% opacity)
▒▒▒ = Other days (60% opacity)
░░░ = Empty day stub
```

### Implementation Approach

**Pure CSS/React Implementation (no chart library):**
```tsx
const Bar = ({ height, isToday, data }) => (
  <Tooltip content={<BarTooltip data={data} />}>
    <div
      className={cn(
        "w-8 rounded-t-md transition-all bg-cozy-accent",
        isToday ? "opacity-100" : "opacity-60"
      )}
      style={{ height: `${Math.max(height, 4)}px` }}
    />
  </Tooltip>
);
```

**Height Calculation:**
```typescript
const maxMinutes = Math.max(...weekData.map(d => d.focusMinutes), 60);
const heightPx = (day.focusMinutes / maxMinutes) * MAX_BAR_HEIGHT;
```

### Backend Response

**WeeklyStatsResponse:**
```rust
#[derive(Serialize)]
struct WeeklyStatsResponse {
    days: Vec<DayStats>,
    weekly_total_minutes: u32,
}

#[derive(Serialize)]
struct DayStats {
    date: String,        // "2026-01-29"
    day_name: String,    // "Wed"
    focus_minutes: u32,
    session_count: u32,
    is_today: bool,
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/stats/components/WeeklyBarChart.tsx` | Bar chart |
| `src/features/stats/components/WeeklyBarChart.test.tsx` | Chart tests |
| `src/features/stats/hooks/useWeeklyData.ts` | Weekly data hook |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/commands/stats.rs` | Add getWeeklyStats |
| `src/windows/main/MainWindow.tsx` | Add WeeklyBarChart |

### References

- [Source: epics.md#Story-3.5] - Full acceptance criteria
- [Source: ux-design-specification.md#UX8] - Card-based layout with bar chart

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4 (Anthropic)

### Debug Log References

N/A - Implementation completed without issues.

### Completion Notes List

- Implemented `get_weekly_stats` Rust command that retrieves session data for the last 7 days
- Created `useWeeklyData` hook with IPC fetching, loading state, and auto-refresh on session events
- Built `WeeklyBarChart` component with pure CSS/React (no chart library):
  - 7 bars with proportional heights based on focus minutes
  - Today's bar at 100% opacity, others at 60%
  - Minimum 4px stub height for empty days
  - Custom hover tooltip showing day name, date, focus time, and session count
  - "This Week" header with total hours display
- Added WeeklyBarChart to App.tsx below TodayStats
- All 26 new tests pass (16 component tests + 10 hook tests)
- Full test suite passes (248 tests)

### File List

**Created:**
- `src/features/stats/components/WeeklyBarChart.tsx`
- `src/features/stats/components/WeeklyBarChart.test.tsx`
- `src/features/stats/hooks/useWeeklyData.ts`
- `src/features/stats/hooks/useWeeklyData.test.ts`

**Modified:**
- `src-tauri/src/commands/stats.rs` - Added DayStats, WeeklyStatsResponse structs and get_weekly_stats command
- `src-tauri/src/lib.rs` - Registered get_weekly_stats command
- `src/features/stats/components/index.ts` - Exported WeeklyBarChart
- `src/App.tsx` - Added WeeklyBarChart below TodayStats

## Change Log

- 2026-01-29: Implemented weekly bar chart visualization (Story 3.5)
