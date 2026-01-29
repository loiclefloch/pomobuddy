# Story 3.4: Build Session History View

Status: review

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

- [x] Task 1: Create SessionHistoryItem Component (AC: #1, #4)
  - [x] 1.1: Create `src/features/stats/components/SessionHistoryItem.tsx`
  - [x] 1.2: Display time range (HH:MM - HH:MM)
  - [x] 1.3: Display duration (Xm)
  - [x] 1.4: Display status indicator (✓ or ○)
  - [x] 1.5: Style complete vs interrupted differently

- [x] Task 2: Create DaySection Component (AC: #3)
  - [x] 2.1: Create `src/features/stats/components/DaySection.tsx`
  - [x] 2.2: Display date header with smart formatting
  - [x] 2.3: List SessionHistoryItems for that day
  - [x] 2.4: Show daily summary (total sessions, time)

- [x] Task 3: Create SessionHistory Component (AC: #1, #5)
  - [x] 3.1: Create `src/features/stats/components/SessionHistory.tsx`
  - [x] 3.2: Group sessions by date into DaySections
  - [x] 3.3: Implement smooth scrolling container
  - [x] 3.4: Add "Load More" button or infinite scroll

- [x] Task 4: Implement Backend Command (AC: #2)
  - [x] 4.1: Create `getSessionHistory` command
  - [x] 4.2: Accept `days` parameter (default 7)
  - [x] 4.3: Read session files for date range
  - [x] 4.4: Sort by date desc, then time desc
  - [x] 4.5: Return paginated response

- [x] Task 5: Create useSessionHistory Hook (AC: #2)
  - [x] 5.1: Create `src/features/stats/hooks/useSessionHistory.ts`
  - [x] 5.2: Fetch history via IPC
  - [x] 5.3: Handle pagination state
  - [x] 5.4: Cache loaded data

- [x] Task 6: Smart Date Formatting (AC: #3)
  - [x] 6.1: "Today" for current date
  - [x] 6.2: "Yesterday" for previous day
  - [x] 6.3: "Mon, Jan 27" for older dates
  - [x] 6.4: Add to `src/shared/lib/dateUtils.ts` (already existed)

- [x] Task 7: Add to Main Window
  - [x] 7.1: Add SessionHistory to main window stats view
  - [x] 7.2: Position below TodayStats
  - [x] 7.3: Apply cozy styling

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

Claude (Anthropic) - Atlas Orchestrator

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

- **Task 1 Complete**: Created SessionHistoryItem component with 12 passing tests. Displays time range, duration, and status indicator with correct styling.
- **Task 2 Complete**: Created DaySection component with 9 passing tests. Groups sessions by date with smart date labels and daily summary.
- **Task 3 Complete**: Created SessionHistory component with 9 passing tests. Implements scrollable container with Load More pagination.
- **Task 4 Complete**: Implemented `get_session_history` Rust command. Returns paginated session history with date grouping, sorted by date/time descending.
- **Task 5 Complete**: Created useSessionHistory hook with 7 passing tests. Handles IPC fetching, pagination state, and event listeners for real-time updates.
- **Task 6 Complete**: Smart date formatting already existed in dateUtils.ts (getDateLabel function). Used in DaySection component.
- **Task 7 Complete**: Added SessionHistoryContainer to App.tsx below TodayStats with cozy styling.

### File List

**Created:**
- `src/features/stats/components/SessionHistoryItem.tsx`
- `src/features/stats/components/SessionHistoryItem.test.tsx`
- `src/features/stats/components/DaySection.tsx`
- `src/features/stats/components/DaySection.test.tsx`
- `src/features/stats/components/SessionHistory.tsx`
- `src/features/stats/components/SessionHistory.test.tsx`
- `src/features/stats/components/SessionHistoryContainer.tsx`
- `src/features/stats/hooks/useSessionHistory.ts`
- `src/features/stats/hooks/useSessionHistory.test.ts`

**Modified:**
- `src-tauri/src/commands/stats.rs` - Added get_session_history command and supporting types
- `src-tauri/src/lib.rs` - Registered get_session_history command
- `src/features/stats/components/index.ts` - Exported new components
- `src/App.tsx` - Added SessionHistoryContainer to main window

## Change Log

- **2026-01-29**: Implemented Story 3.4 - Build Session History View
  - Created SessionHistoryItem, DaySection, and SessionHistory React components
  - Implemented get_session_history Rust backend command
  - Created useSessionHistory hook for data fetching
  - Added SessionHistoryContainer to main window
  - All 222 frontend tests pass, 25 Rust tests pass
  - Production build successful
