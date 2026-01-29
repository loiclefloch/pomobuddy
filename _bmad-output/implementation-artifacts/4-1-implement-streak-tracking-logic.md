# Story 4.1: Implement Streak Tracking Logic

Status: ready-for-dev

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

- [ ] Task 1: Create Achievements Storage Module (AC: #1)
  - [ ] 1.1: Create `src-tauri/src/storage/achievements.rs`
  - [ ] 1.2: Define `AchievementsData` struct
  - [ ] 1.3: Implement `load_achievements()` function
  - [ ] 1.4: Implement `save_achievements()` function
  - [ ] 1.5: Create achievements.json on first launch

- [ ] Task 2: Implement Streak Calculation (AC: #2, #3, #5)
  - [ ] 2.1: Create `calculate_streak()` function
  - [ ] 2.2: Scan session files from today backwards
  - [ ] 2.3: Count consecutive days with complete sessions
  - [ ] 2.4: Update currentStreak and longestStreak
  - [ ] 2.5: Handle first-day edge case

- [ ] Task 3: Integrate with Session Completion (AC: #2, #3)
  - [ ] 3.1: Call streak update after session saved
  - [ ] 3.2: Only count completed sessions (not interrupted)
  - [ ] 3.3: Emit `StreakUpdated` event to frontend

- [ ] Task 4: Handle Streak Reset (AC: #4)
  - [ ] 4.1: Detect missed days on app startup
  - [ ] 4.2: Reset currentStreak if gap detected
  - [ ] 4.3: Preserve longestStreak
  - [ ] 4.4: No guilt messaging in any event

- [ ] Task 5: Create Streak Commands (AC: #6)
  - [ ] 5.1: Implement `getStreakData` command
  - [ ] 5.2: Recalculate streak on app startup
  - [ ] 5.3: Return StreakDataResponse struct

- [ ] Task 6: Testing
  - [ ] 6.1: Test streak increments on consecutive days
  - [ ] 6.2: Test streak resets after missed day
  - [ ] 6.3: Test longestStreak preservation
  - [ ] 6.4: Test only complete sessions count

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
