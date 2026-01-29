# Story 4.1: Implement Streak Tracking Logic

Status: review

## Story

As a user,
I want the app to track my consecutive days of completed sessions,
So that I can build and maintain focus habits.

## Acceptance Criteria

1. **Given** the session storage from Epic 3
   **When** I implement streak tracking in `src-tauri/src/storage/achievements.rs`
   **Then** the module tracks `currentStreak` and `longestStreak`
   **And** streak data is persisted in `{data_dir}/achievements.json`

2. **Given** streak tracking exists
   **When** a user completes at least one session on a day
   **Then** that day is marked as a "streak day"
   **And** if yesterday was also a streak day, `currentStreak` increments
   **And** if yesterday was not a streak day, `currentStreak` resets to 1

3. **Given** streak logic is implemented
   **When** evaluating streak continuation (FR19)
   **Then** only ONE completed session per day is required to maintain streak
   **And** interrupted sessions do NOT count toward streak
   **And** the streak check happens at session completion

4. **Given** the user misses a day (no completed sessions)
   **When** they complete a session the following day
   **Then** `currentStreak` resets to 1
   **And** `longestStreak` is preserved if it was higher
   **And** no guilt messaging is shown about broken streak (UX13)

5. **Given** streak data needs to be calculated
   **When** I implement `calculateStreak()` Rust function
   **Then** the function scans session files backwards from today
   **And** counts consecutive days with at least one complete session
   **And** handles edge cases (first day, app installed mid-day)

6. **Given** streak commands are needed
   **When** I implement IPC commands
   **Then** `getStreakData()` returns `{ currentStreak, longestStreak, lastStreakDate }`
   **And** streak is recalculated on app startup to handle offline days

## Tasks / Subtasks

- [x] Task 1: Create Achievements Storage Module (AC: #1)
  - [x] 1.1: Create `src-tauri/src/storage/achievements.rs`
  - [x] 1.2: Define `AchievementsData` struct
  - [x] 1.3: Implement `load_achievements()` function
  - [x] 1.4: Implement `save_achievements()` function
  - [x] 1.5: Create achievements.json on first launch

- [x] Task 2: Implement Streak Calculation (AC: #2, #3, #5)
  - [x] 2.1: Create `calculate_streak()` function
  - [x] 2.2: Scan session files from today backwards
  - [x] 2.3: Count consecutive days with complete sessions
  - [x] 2.4: Update currentStreak and longestStreak
  - [x] 2.5: Handle first-day edge case

- [x] Task 3: Integrate with Session Completion (AC: #2, #3)
  - [x] 3.1: Call streak update after session saved
  - [x] 3.2: Only count completed sessions (not interrupted)
  - [x] 3.3: Emit `StreakUpdated` event to frontend

- [x] Task 4: Handle Streak Reset (AC: #4)
  - [x] 4.1: Detect missed days on app startup
  - [x] 4.2: Reset currentStreak if gap detected
  - [x] 4.3: Preserve longestStreak
  - [x] 4.4: No guilt messaging in any event

- [x] Task 5: Create Streak Commands (AC: #6)
  - [x] 5.1: Implement `getStreakData` command
  - [x] 5.2: Recalculate streak on app startup
  - [x] 5.3: Return StreakDataResponse struct

- [x] Task 6: Testing
  - [x] 6.1: Test streak increments on consecutive days
  - [x] 6.2: Test streak resets after missed day
  - [x] 6.3: Test longestStreak preservation
  - [x] 6.4: Test only complete sessions count

## Dev Notes

### Epic 4 Context: Streaks & Achievements

**Epic Objective:** User can track their consistency with streaks and earn achievement badges for milestones.

**FRs Covered:**
- FR14: Track consecutive day streak
- FR15: View current streak
- FR19: Streak preservation logic

### Architecture - Achievements Storage (AR9)

**achievements.json Format:**
```json
{
  "unlocked": [],
  "currentStreak": 7,
  "longestStreak": 14,
  "totalSessions": 42,
  "lastStreakDate": "2026-01-29"
}
```

### Streak Calculation Algorithm

```rust
fn calculate_streak(sessions_dir: &Path) -> (u32, u32) {
    let mut current_streak = 0;
    let mut date = Local::now().date_naive();
    
    loop {
        let file_path = sessions_dir.join(format!("{}.md", date));
        
        if let Ok(content) = fs::read_to_string(&file_path) {
            if has_complete_session(&content) {
                current_streak += 1;
                date = date.pred_opt().unwrap();
            } else {
                break; // Day exists but no complete sessions
            }
        } else {
            break; // No file for this day
        }
    }
    
    let longest_streak = load_achievements().longest_streak.max(current_streak);
    (current_streak, longest_streak)
}

fn has_complete_session(content: &str) -> bool {
    content.contains("✓ Complete")
}
```

### Event Flow

```
Session Completes
    ↓
save_session() [Story 3.2]
    ↓
update_streak()
    ↓
emit("StreakUpdated", { current: 7, longest: 14 })
    ↓
Frontend updates QuickStats
```

### Files to Create

| File | Purpose |
|------|---------|
| `src-tauri/src/storage/achievements.rs` | Achievements/streak storage |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/storage/mod.rs` | Export achievements |
| `src-tauri/src/commands/timer.rs` | Call streak update |
| `src-tauri/src/main.rs` | Register streak commands, recalc on startup |

### References

- [Source: epics.md#Story-4.1] - Full acceptance criteria
- [Source: architecture.md#AR9] - achievements.json format
- [Source: prd.md#FR14-FR19] - Streak requirements

## Dev Agent Record

### Agent Model Used

Claude (Sisyphus)

### Debug Log References

None - clean implementation

### Completion Notes List

- Created achievements.rs with AchievementsData struct matching AR9 spec
- Implemented calculate_streak() that scans session files backwards from today
- Integrated streak update into session completion flow (only complete focus sessions count)
- Added StreakUpdated event emission to frontend
- Streak recalculation happens on app startup via recalculate_streak_on_startup()
- No guilt messaging - streak resets silently preserve longestStreak
- All 45 tests pass including 10 new achievements tests

### File List

**New Files:**
- `src-tauri/src/storage/achievements.rs` - Achievements/streak storage module
- `src-tauri/src/commands/streak.rs` - Streak IPC command

**Modified Files:**
- `src-tauri/src/storage/mod.rs` - Export achievements module
- `src-tauri/src/commands/mod.rs` - Export streak module  
- `src-tauri/src/commands/timer.rs` - Call streak update after session saved, emit StreakUpdated event
- `src-tauri/src/events.rs` - Add StreakUpdatedPayload struct
- `src-tauri/src/lib.rs` - Register get_streak_data_cmd, call recalculate_streak_on_startup()

## Change Log

| Date | Change |
|------|--------|
| 2026-01-29 | Initial implementation of streak tracking logic (Story 4.1) |
