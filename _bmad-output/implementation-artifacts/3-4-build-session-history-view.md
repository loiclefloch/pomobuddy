# Story 3.4: Build Session History View

Status: ready-for-dev

## Story

As a user,
I want to view my session history,
So that I can review my past focus sessions.

## Acceptance Criteria

1. **Given** the main window from Epic 2
   **When** I create the session history view
   **Then** a scrollable list of past sessions is displayed
   **And** sessions are grouped by date
   **And** each session shows start time, end time, duration, and status (complete/interrupted)

2. **Given** session data exists
   **When** I implement `getSessionHistory(days)` Rust command
   **Then** the command returns sessions for the last N days
   **And** default is 7 days of history
   **And** sessions are sorted by date descending, then by time descending

3. **Given** the history view exists
   **When** I view session history (FR13)
   **Then** each day section shows:
     - Date header (e.g., "Today", "Yesterday", "Mon, Jan 27")
     - List of sessions with time and status
     - Daily summary (total sessions, total time)

4. **Given** a day has both complete and interrupted sessions
   **When** I view that day's history
   **Then** complete sessions show with checkmark indicator
   **And** interrupted sessions show with circle indicator
   **And** the styling matches the `.md` file format for consistency

5. **Given** the history list is long
   **When** I scroll through the list
   **Then** the list scrolls smoothly
   **And** older sessions can be loaded (pagination or infinite scroll)
   **And** performance remains responsive (NFR3)

## Tasks / Subtasks

- [ ] Task 1: Create SessionHistoryItem Component (AC: #1, #4)
  - [ ] 1.1: Create `src/features/stats/components/SessionHistoryItem.tsx`
  - [ ] 1.2: Display time range (HH:MM - HH:MM)
  - [ ] 1.3: Display duration (Xm)
  - [ ] 1.4: Display status indicator (✓ or ○)
  - [ ] 1.5: Style complete vs interrupted differently

- [ ] Task 2: Create DaySection Component (AC: #3)
  - [ ] 2.1: Create `src/features/stats/components/DaySection.tsx`
  - [ ] 2.2: Display date header with smart formatting
  - [ ] 2.3: List SessionHistoryItems for that day
  - [ ] 2.4: Show daily summary (total sessions, time)

- [ ] Task 3: Create SessionHistory Component (AC: #1, #5)
  - [ ] 3.1: Create `src/features/stats/components/SessionHistory.tsx`
  - [ ] 3.2: Group sessions by date into DaySections
  - [ ] 3.3: Implement smooth scrolling container
  - [ ] 3.4: Add "Load More" button or infinite scroll

- [ ] Task 4: Implement Backend Command (AC: #2)
  - [ ] 4.1: Create `getSessionHistory` command
  - [ ] 4.2: Accept `days` parameter (default 7)
  - [ ] 4.3: Read session files for date range
  - [ ] 4.4: Sort by date desc, then time desc
  - [ ] 4.5: Return paginated response

- [ ] Task 5: Create useSessionHistory Hook (AC: #2)
  - [ ] 5.1: Create `src/features/stats/hooks/useSessionHistory.ts`
  - [ ] 5.2: Fetch history via IPC
  - [ ] 5.3: Handle pagination state
  - [ ] 5.4: Cache loaded data

- [ ] Task 6: Smart Date Formatting (AC: #3)
  - [ ] 6.1: "Today" for current date
  - [ ] 6.2: "Yesterday" for previous day
  - [ ] 6.3: "Mon, Jan 27" for older dates
  - [ ] 6.4: Add to `src/shared/lib/dateUtils.ts`

- [ ] Task 7: Add to Main Window
  - [ ] 7.1: Add SessionHistory to main window stats view
  - [ ] 7.2: Position below TodayStats
  - [ ] 7.3: Apply cozy styling

## Dev Notes

### Component Hierarchy

```
SessionHistory
├── DaySection (Today)
│   ├── SessionHistoryItem
│   ├── SessionHistoryItem
│   └── DailySummary
├── DaySection (Yesterday)
│   ├── SessionHistoryItem
│   └── DailySummary
└── LoadMoreButton
```

### Visual Design

**DaySection:**
```
┌─────────────────────────────────────────┐
│  Today                    3 sessions    │  ← Date + summary
│ ─────────────────────────────────────── │
│  09:15 - 09:40  ✓ Complete     25m     │
│  10:02 - 10:16  ○ Interrupted  14m     │
│  14:30 - 14:55  ✓ Complete     25m     │
└─────────────────────────────────────────┘
```

### Backend Response

**SessionHistoryResponse:**
```rust
#[derive(Serialize)]
struct SessionHistoryResponse {
    days: Vec<DayHistory>,
    has_more: bool,
    total_days: u32,
}

#[derive(Serialize)]
struct DayHistory {
    date: String,  // "2026-01-29"
    sessions: Vec<SessionSummary>,
    total_complete: u32,
    total_interrupted: u32,
    total_minutes: u32,
}
```

### Performance Considerations

- Load 7 days initially
- Paginate by 7 days on "Load More"
- Use virtualized list for very long history (future optimization)
- Cache loaded data to avoid re-fetching

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/stats/components/SessionHistoryItem.tsx` | Single session row |
| `src/features/stats/components/DaySection.tsx` | Day grouping |
| `src/features/stats/components/SessionHistory.tsx` | Full history view |
| `src/features/stats/hooks/useSessionHistory.ts` | History fetching |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/commands/stats.rs` | Add getSessionHistory |
| `src/windows/main/MainWindow.tsx` | Add SessionHistory |
| `src/shared/lib/dateUtils.ts` | Add smart date formatting |

### References

- [Source: epics.md#Story-3.4] - Full acceptance criteria
- [Source: prd.md#FR13] - View session history requirement

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
