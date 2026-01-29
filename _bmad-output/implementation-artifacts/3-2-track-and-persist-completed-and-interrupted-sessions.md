# Story 3.2: Track and Persist Completed and Interrupted Sessions

Status: review

## Story

As a user,
I want my interrupted sessions tracked separately from completed sessions,
So that I have an honest record of my focus time.

## Acceptance Criteria

1. **Given** the session storage from Story 3.1
   **When** a focus session completes (timer reaches 0:00)
   **Then** the session is recorded with status "Complete"
   **And** the session entry shows `✓ Complete (25m)`
   **And** the complete session count increments

2. **Given** a session is active
   **When** the user clicks Stop before the timer completes
   **Then** the session is recorded with status "Interrupted"
   **And** the session entry shows `○ Interrupted (Xm)` where X is minutes completed
   **And** the partial session count increments
   **And** no guilt messaging is shown (UX13)

3. **Given** the app crashes or is force-quit during a session
   **When** the app restarts
   **Then** the interrupted session is recovered and saved
   **And** the session shows the last known elapsed time
   **And** no data is lost (NFR5, NFR6)

4. **Given** sessions are being recorded
   **When** I implement the Rust commands for session management
   **Then** `saveSession(sessionData)` command persists session to file
   **And** `getSessionsForDate(date)` command returns sessions for a specific date
   **And** `getTodaySessions()` command returns today's session list

5. **Given** the timer completes a focus session
   **When** the `SessionComplete` event is emitted
   **Then** the session is automatically saved to storage
   **And** the frontend is notified of the updated session count

## Tasks / Subtasks

- [x] Task 1: Implement Complete Session Recording (AC: #1)
  - [x] 1.1: Modify `SessionComplete` handler in timer module
  - [x] 1.2: Create Session struct with Complete status
  - [x] 1.3: Call `save_session()` from storage module
  - [x] 1.4: Emit `SessionSaved` event to frontend

- [x] Task 2: Implement Interrupted Session Recording (AC: #2)
  - [x] 2.1: Modify `stopTimer` command to detect active session
  - [x] 2.2: Calculate elapsed time from session start
  - [x] 2.3: Create Session struct with Interrupted status
  - [x] 2.4: Save interrupted session to file
  - [x] 2.5: No UI guilt messaging (just save quietly)

- [x] Task 3: Implement Crash Recovery (AC: #3)
  - [x] 3.1: Store active session state to a recovery file
  - [x] 3.2: On app startup, check for recovery file
  - [x] 3.3: If recovery file exists, save interrupted session
  - [x] 3.4: Clean up recovery file after successful save
  - [x] 3.5: Handle edge cases (power loss, force quit)

- [x] Task 4: Create Session Management Commands (AC: #4)
  - [x] 4.1: Implement `saveSession` Tauri command
  - [x] 4.2: Implement `getSessionsForDate` command with date parameter
  - [x] 4.3: Implement `getTodaySessions` command
  - [x] 4.4: Register all commands in Tauri builder

- [x] Task 5: Frontend Integration (AC: #5)
  - [x] 5.1: Listen to `SessionSaved` event in stats store
  - [x] 5.2: Update session counts in UI
  - [x] 5.3: Refresh QuickStats after session save

- [x] Task 6: Testing
  - [x] 6.1: Test complete session saves correctly
  - [x] 6.2: Test interrupted session saves with correct duration
  - [x] 6.3: Test crash recovery scenario
  - [x] 6.4: Test session counts are accurate

## Dev Notes

### Previous Story Context (Story 3.1)

**What Story 3.1 Established:**
- `src-tauri/src/storage/sessions.rs` module
- `save_session()` function for file writing
- `load_sessions_for_date()` function for reading
- Atomic file write pattern
- Session struct with start/end times

### Session Status Formatting

**From Architecture - File Format:**
```markdown
## Sessions
- 09:15 - 09:40 ✓ Complete (25m)
- 10:02 - 10:16 ○ Interrupted (14m)
```

**Symbols:**
- ✓ = Complete session (Unicode: \u2713)
- ○ = Interrupted session (Unicode: \u25CB)

### Crash Recovery Strategy

**Recovery File Location:**
```
{data_dir}/.session_recovery.json
```

**Recovery File Format:**
```json
{
  "session_start": "2026-01-29T09:15:00",
  "session_type": "focus",
  "last_tick": "2026-01-29T09:30:00"
}
```

**Recovery Flow:**
1. On timer start → Create recovery file
2. Every tick → Update `last_tick` in recovery file
3. On session complete → Delete recovery file
4. On app startup → Check for recovery file → Save as interrupted → Delete file

### UX13 - No Guilt Messaging

**DO NOT:**
- Show "You stopped early!" messages
- Display shame indicators
- Penalize interrupted sessions

**DO:**
- Save quietly without fanfare
- Track accurately for user's information
- Treat interruptions as normal part of focus work

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/storage/sessions.rs` | Add crash recovery |
| `src-tauri/src/commands/timer.rs` | Save sessions on complete/stop |
| `src-tauri/src/state/timer_state.rs` | Create recovery file on start |
| `src-tauri/src/main.rs` | Check recovery on startup |
| `src/features/stats/stores/statsStore.ts` | Listen to SessionSaved |

### References

- [Source: epics.md#Story-3.2] - Full acceptance criteria
- [Source: architecture.md#Data-Architecture] - File format
- [Source: prd.md#NFR5-NFR6] - Zero data loss requirements
- [Source: ux-design-specification.md#UX13] - No guilt messaging

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-20250514 (Sisyphus)

### Debug Log References

N/A

### Completion Notes List

1. Verified complete session recording (AC #1) - already implemented in Story 3.1, added SessionSaved event emission
2. Verified interrupted session recording (AC #2) - already implemented in Story 3.1, added SessionSaved event emission
3. Implemented crash recovery mechanism (AC #3):
   - Created `src-tauri/src/storage/recovery.rs` module
   - Recovery file stored at `{data_dir}/.session_recovery.json`
   - On timer start: creates recovery file with session_start, session_type, last_tick
   - Every 30 seconds during focus: updates last_tick timestamp
   - On session complete or stop: deletes recovery file
   - On app startup: checks for recovery file, saves interrupted session if found
4. Verified session management commands (AC #4) - all commands existed from Story 3.1
5. Implemented frontend integration (AC #5):
   - Added SessionSavedPayload event type in Rust events.rs
   - Timer emits SessionSaved event with updated session counts after save
   - useQuickStats hook listens to SessionSaved and updates stats store directly
6. Added comprehensive tests:
   - 3 Rust tests for recovery file lifecycle
   - 5 TypeScript tests for useQuickStats hook SessionSaved event handling
   - All 25 Rust tests pass, all 158 frontend tests pass

### File List

**Created:**
- `src-tauri/src/storage/recovery.rs` - Crash recovery module with recovery file management
- `src/features/stats/hooks/useQuickStats.test.ts` - Tests for SessionSaved event handling

**Modified:**
- `src-tauri/src/storage/mod.rs` - Added recovery module export
- `src-tauri/src/events.rs` - Added SessionSavedPayload struct
- `src-tauri/src/commands/timer.rs` - Added recovery file integration, SessionSaved event emission
- `src-tauri/src/lib.rs` - Added startup recovery check
- `src/features/stats/hooks/useQuickStats.ts` - Added SessionSaved event listener

## Change Log

- 2026-01-29: Implemented Story 3.2 - Track and Persist Completed and Interrupted Sessions
  - Added crash recovery mechanism with recovery file
  - Added SessionSaved event for frontend notification
  - Added useQuickStats hook tests for event handling
