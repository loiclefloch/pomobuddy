# Story 3.1: Implement Session File Storage in Rust Backend

Status: review

## Story

As a user,
I want my session data saved to local files automatically,
So that I own my data and can back it up or sync it with git.

## Acceptance Criteria

1. **Given** the Tauri project with Rust backend
   **When** I implement the storage module in `src-tauri/src/storage/sessions.rs`
   **Then** the module can write session data to `.md` files
   **And** the module can read existing session data from `.md` files
   **And** files are stored in the platform app data directory by default:
     - macOS: `~/Library/Application Support/test-bmad/sessions/`
     - Linux: `~/.local/share/test-bmad/sessions/`

2. **Given** the storage module exists
   **When** a session completes or is interrupted
   **Then** a file named `YYYY-MM-DD.md` is created or updated in the sessions directory
   **And** the file format matches the Architecture specification

3. **Given** a daily session file exists
   **When** a new session is recorded on the same day
   **Then** the new session is appended to the Sessions list
   **And** the Summary section is recalculated
   **And** the file write is atomic (no partial writes on crash)

4. **Given** the app restarts
   **When** I start the app on a day with existing sessions
   **Then** the existing session data is loaded from the `.md` file
   **And** session counts and totals are accurate
   **And** data survives app restarts (FR12)

5. **Given** the session files
   **When** I open them in a text editor or Obsidian
   **Then** the files are human-readable (FR29)
   **And** the files are valid markdown that renders correctly
   **And** the files can be diffed and merged in git (git-friendly per FR29)

## Tasks / Subtasks

- [x] Task 1: Create Storage Module Structure (AC: #1)
  - [x] 1.1: Create `src-tauri/src/storage/mod.rs`
  - [x] 1.2: Create `src-tauri/src/storage/sessions.rs`
  - [x] 1.3: Define `Session` struct with fields: start_time, end_time, duration, status
  - [x] 1.4: Define `DailySessionFile` struct for parsing/writing
  - [x] 1.5: Implement platform-specific data directory resolution

- [x] Task 2: Implement File Writing (AC: #2, #3, #5)
  - [x] 2.1: Implement `save_session(session: Session)` function
  - [x] 2.2: Generate markdown format per Architecture spec
  - [x] 2.3: Handle file creation if doesn't exist
  - [x] 2.4: Handle append to existing file
  - [x] 2.5: Recalculate Summary section on each write
  - [x] 2.6: Use atomic file writes (write to temp, then rename)

- [x] Task 3: Implement File Reading (AC: #4)
  - [x] 3.1: Implement `load_sessions_for_date(date: NaiveDate)` function
  - [x] 3.2: Parse markdown format back to Session structs
  - [x] 3.3: Handle missing file gracefully (return empty list)
  - [x] 3.4: Validate parsed data integrity

- [x] Task 4: Create Tauri Commands (AC: #1, #4)
  - [x] 4.1: Create `saveSession` command
  - [x] 4.2: Create `getSessionsForDate` command
  - [x] 4.3: Create `getTodaySessions` command
  - [x] 4.4: Register commands in Tauri builder

- [x] Task 5: Integrate with Timer (AC: #2)
  - [x] 5.1: Call `saveSession` when `SessionComplete` event fires
  - [x] 5.2: Call `saveSession` when timer is stopped (interrupted)
  - [x] 5.3: Include session type (focus/break) in saved data

- [x] Task 6: Error Handling (AC: #3)
  - [x] 6.1: Handle disk full errors gracefully
  - [x] 6.2: Handle permission errors
  - [x] 6.3: Implement backup/recovery for corrupt files
  - [x] 6.4: Log errors without crashing app

- [x] Task 7: Testing
  - [x] 7.1: Unit tests for markdown generation
  - [x] 7.2: Unit tests for markdown parsing
  - [x] 7.3: Integration test for save/load cycle
  - [x] 7.4: Test atomic write behavior

## Dev Notes

### Epic 3 Context: Session Persistence & Statistics

**Epic Objective:** User can see their daily progress and trust that session data is saved reliably.

**FRs Covered:**
- FR8: Track interrupted sessions
- FR9: View completed sessions today
- FR10: View total focus time today
- FR11: Persist to local .md files
- FR12: Data survives restarts
- FR27: Local .md file storage
- FR29: Human-readable, git-friendly files
- FR30: Fully offline

### Architecture - Data Storage

**Session File Format (from Architecture):**
```markdown
# 2026-01-29

## Sessions
- 09:15 - 09:40 ✓ Complete (25m)
- 10:02 - 10:16 ○ Interrupted (14m)
- 14:30 - 14:55 ✓ Complete (25m)

## Summary
- Complete: 2 sessions (50m)
- Partial: 1 session (14m)
- Total focus: 64m
```

**Storage Locations:**
- macOS: `~/Library/Application Support/test-bmad/sessions/`
- Linux: `~/.local/share/test-bmad/sessions/`

### Rust Implementation Details

**Session Struct:**
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub start_time: DateTime<Local>,
    pub end_time: DateTime<Local>,
    pub duration_seconds: u32,
    pub status: SessionStatus,
    pub session_type: SessionType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SessionStatus {
    Complete,
    Interrupted,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SessionType {
    Focus,
    Break,
}
```

**Atomic File Write Pattern:**
```rust
use std::fs;
use std::io::Write;

fn atomic_write(path: &Path, content: &str) -> Result<(), std::io::Error> {
    let temp_path = path.with_extension("tmp");
    let mut file = fs::File::create(&temp_path)?;
    file.write_all(content.as_bytes())?;
    file.sync_all()?;
    fs::rename(temp_path, path)?;
    Ok(())
}
```

### Dependencies

**Rust Dependencies to Add:**
```toml
[dependencies]
chrono = { version = "0.4", features = ["serde"] }
dirs = "5.0"  # For platform-specific directories
```

### Files to Create

| File | Purpose |
|------|---------|
| `src-tauri/src/storage/mod.rs` | Storage module exports |
| `src-tauri/src/storage/sessions.rs` | Session file I/O |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/Cargo.toml` | Add chrono, dirs dependencies |
| `src-tauri/src/lib.rs` | Export storage module |
| `src-tauri/src/main.rs` | Register session commands |
| `src-tauri/src/commands/timer.rs` | Call save on session complete |

### References

- [Source: epics.md#Story-3.1] - Full acceptance criteria
- [Source: architecture.md#Data-Architecture] - File format spec
- [Source: prd.md#FR11-FR12] - Persistence requirements
- [Source: prd.md#FR27-FR30] - Storage requirements

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-20250514 (Sisyphus)

### Debug Log References

N/A

### Completion Notes List

1. Created storage module structure with `mod.rs` and `sessions.rs`
2. Implemented Session, SessionStatus, SessionType, DailySummary, and DailySessionFile structs
3. Platform-specific directory resolution using `dirs` crate
4. Atomic file writes with temp file and rename pattern
5. Markdown generation matches Architecture spec exactly
6. Markdown parsing with round-trip support
7. Tauri commands: `save_session_cmd`, `get_sessions_for_date`, `get_today_sessions`, `save_completed_session`, `save_interrupted_session`
8. Timer integration: sessions saved on focus/break complete and on stop (interrupted)
9. Error handling with AppError type and graceful logging
10. 10 unit tests covering markdown generation, parsing, round-trip, directory creation, and edge cases

### File List

**Created:**
- `src-tauri/src/storage/mod.rs`
- `src-tauri/src/storage/sessions.rs`
- `src-tauri/src/commands/session.rs`

**Modified:**
- `src-tauri/Cargo.toml` - Added `dirs = "5.0"` dependency
- `src-tauri/src/lib.rs` - Added storage module, registered session commands
- `src-tauri/src/commands/mod.rs` - Added session module
- `src-tauri/src/commands/timer.rs` - Integrated session saving on complete/stop
- `src-tauri/src/error.rs` - Added AppError type for storage errors
