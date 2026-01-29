# Story 3.5: Implement Weekly Bar Chart Visualization

Status: ready-for-dev

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

- [ ] Task 1: Create WeeklyBarChart Component (AC: #1, #2)
  - [ ] 1.1: Create `src/features/stats/components/WeeklyBarChart.tsx`
  - [ ] 1.2: Render 7 vertical bars using CSS/div elements
  - [ ] 1.3: Calculate bar heights from data (scale to max)
  - [ ] 1.4: Style with cozy-accent color and opacity variants
  - [ ] 1.5: Add day labels on x-axis (Mon, Tue, etc.)

- [ ] Task 2: Implement Bar Styling (AC: #2)
  - [ ] 2.1: Today's bar at 100% opacity
  - [ ] 2.2: Other bars at 60% opacity
  - [ ] 2.3: Rounded top corners (`rounded-t-md`)
  - [ ] 2.4: Minimum stub height for empty days (4px)
  - [ ] 2.5: Smooth hover transitions

- [ ] Task 3: Add Tooltips (AC: #3)
  - [ ] 3.1: Use shadcn/ui Tooltip or custom hover tooltip
  - [ ] 3.2: Show day name and date
  - [ ] 3.3: Show focus time formatted
  - [ ] 3.4: Show session count
  - [ ] 3.5: Position tooltip above bar

- [ ] Task 4: Implement Backend Command (AC: #4)
  - [ ] 4.1: Create `getWeeklyStats` command
  - [ ] 4.2: Read session files for last 7 days
  - [ ] 4.3: Calculate daily totals
  - [ ] 4.4: Return array of 7 day entries

- [ ] Task 5: Create useWeeklyData Hook (AC: #4)
  - [ ] 5.1: Create `src/features/stats/hooks/useWeeklyData.ts`
  - [ ] 5.2: Fetch weekly data via IPC
  - [ ] 5.3: Calculate weekly total
  - [ ] 5.4: Update on session complete

- [ ] Task 6: Add Chart Header (AC: #5)
  - [ ] 6.1: "This Week" title
  - [ ] 6.2: Weekly total display (e.g., "12.5 hours total")
  - [ ] 6.3: Style consistently with other sections

- [ ] Task 7: Add to Main Window (AC: #5)
  - [ ] 7.1: Import WeeklyBarChart
  - [ ] 7.2: Position below TodayStats cards
  - [ ] 7.3: Responsive width

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
