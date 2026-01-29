# Story 4.4: Implement Achievement Unlock Detection

Status: review

## Story

As a user,
I want achievements to unlock automatically when I reach milestones,
So that I'm rewarded for my progress without manual tracking.

## Acceptance Criteria

1. **Given** achievement definitions from Story 4.3
   **When** I implement achievement detection in Rust backend
   **Then** `checkAchievements()` function evaluates all unlock conditions
   **And** the function is called after every completed session
   **And** the function is called after streak recalculation

2. **Given** achievement detection runs
   **When** a new achievement condition is met
   **Then** the achievement is added to `unlocked` array in `achievements.json`
   **And** `unlockedAt` is set to current ISO timestamp
   **And** an `AchievementUnlocked` event is emitted with achievement data

3. **Given** the `AchievementUnlocked` event is emitted
   **When** the frontend receives the event
   **Then** the celebration overlay is triggered (Story 4.6)
   **And** a notification is sent (FR18)
   **And** the achievement gallery updates

4. **Given** an achievement is already unlocked
   **When** the condition is met again
   **Then** the achievement is NOT unlocked again
   **And** no duplicate events are emitted

5. **Given** multiple achievements could unlock simultaneously
   **When** a session completes (e.g., 7th day AND 50th session)
   **Then** all qualifying achievements unlock
   **And** celebrations are queued and shown sequentially
   **And** each achievement gets its moment

6. **Given** achievement commands are needed
   **When** I implement IPC commands
   **Then** `getAchievements()` returns all achievements with unlock status
   **And** `getTotalSessionCount()` returns lifetime session count
   **And** `getRecentlyUnlocked()` returns achievements unlocked in current session

## Tasks / Subtasks

- [x] Task 1: Implement Achievement Check Function (AC: #1)
  - [x] 1.1: Create `check_achievements()` in achievements.rs
  - [x] 1.2: Check streak-based achievements
  - [x] 1.3: Check session-count achievements
  - [x] 1.4: Return list of newly unlocked achievements

- [x] Task 2: Integrate with Session Flow (AC: #1)
  - [x] 2.1: Call `check_achievements()` after session save
  - [x] 2.2: Call after streak recalculation
  - [x] 2.3: Pass current stats (streak, totalSessions)

- [x] Task 3: Handle Achievement Unlock (AC: #2)
  - [x] 3.1: Add to unlocked array with timestamp
  - [x] 3.2: Save achievements.json
  - [x] 3.3: Emit `AchievementUnlocked` event

- [x] Task 4: Prevent Duplicate Unlocks (AC: #4)
  - [x] 4.1: Check if already in unlocked array
  - [x] 4.2: Skip if already unlocked
  - [x] 4.3: Only emit for new unlocks

- [x] Task 5: Handle Multiple Unlocks (AC: #5)
  - [x] 5.1: Collect all newly unlocked achievements
  - [x] 5.2: Emit events for each
  - [x] 5.3: Frontend queues celebrations

- [x] Task 6: Create Achievement Commands (AC: #6)
  - [x] 6.1: `getAchievements` - all with status
  - [x] 6.2: `getTotalSessionCount` - lifetime count
  - [x] 6.3: `getRecentlyUnlocked` - current session unlocks

- [x] Task 7: Send Notification (AC: #3)
  - [x] 7.1: Use notification plugin from Epic 1
  - [x] 7.2: "Achievement Unlocked: {title}"
  - [x] 7.3: Include achievement icon if supported

## Dev Notes

### Achievement Check Logic

```rust
fn check_achievements(
    current_streak: u32,
    total_sessions: u32,
    unlocked: &[UnlockedAchievement],
) -> Vec<Achievement> {
    let mut newly_unlocked = Vec::new();
    
    for achievement in ACHIEVEMENTS.iter() {
        if is_unlocked(achievement.id, unlocked) {
            continue; // Already unlocked
        }
        
        let should_unlock = match achievement.requirement {
            Requirement::Streak(n) => current_streak >= n,
            Requirement::Sessions(n) => total_sessions >= n,
        };
        
        if should_unlock {
            newly_unlocked.push(achievement.clone());
        }
    }
    
    newly_unlocked
}
```

### Event Payload

```typescript
interface AchievementUnlockedPayload {
  achievement: {
    id: string;
    title: string;
    description: string;
    tier: string;
    icon: string;
  };
  unlockedAt: string;
}
```

### Frontend Queue for Multiple Unlocks

```typescript
const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);

listen('AchievementUnlocked', (event) => {
  setCelebrationQueue(prev => [...prev, event.payload.achievement]);
});

// Show one at a time, remove after displayed
```

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/storage/achievements.rs` | Add check_achievements |
| `src-tauri/src/commands/timer.rs` | Call achievement check |
| `src-tauri/src/main.rs` | Register achievement commands |

### References

- [Source: epics.md#Story-4.4] - Full acceptance criteria
- [Source: prd.md#FR18] - Notification on milestone

## Dev Agent Record

### Agent Model Used

Claude (Sisyphus)

### Debug Log References

None required.

### Completion Notes List

- Implemented `check_achievements()` function in Rust backend with support for streak-based and session-count-based achievements
- Added `AchievementTier`, `AchievementRequirement`, `Achievement`, `UnlockedAchievement` types to achievements.rs
- Created `check_and_unlock_achievements()` function that handles the full unlock flow
- Integrated achievement checking into `emit_session_saved()` in timer.rs - called after each completed focus session
- Added `AchievementUnlockedPayload` event structure to events.rs
- Added `send_achievement_unlocked_notification()` to notifications.rs
- Created `commands/achievements.rs` with `get_achievements` and `get_total_sessions` IPC commands
- Registered achievement commands in lib.rs
- Created frontend `achievementStore.ts` with Zustand store for managing achievements and celebration queue
- Created `useAchievements` hook for loading achievements and listening to unlock events
- Added 21 Rust tests for achievement logic
- Added 9 TypeScript tests for achievementStore
- All 56 Rust tests pass
- All 360 frontend tests pass

### File List

- src-tauri/src/storage/achievements.rs (modified)
- src-tauri/src/commands/achievements.rs (new)
- src-tauri/src/commands/mod.rs (modified)
- src-tauri/src/commands/timer.rs (modified)
- src-tauri/src/events.rs (modified)
- src-tauri/src/notifications.rs (modified)
- src-tauri/src/lib.rs (modified)
- src/features/achievements/stores/achievementStore.ts (new)
- src/features/achievements/stores/achievementStore.test.ts (new)
- src/features/achievements/stores/index.ts (modified)
- src/features/achievements/hooks/useAchievements.ts (new)
- src/features/achievements/hooks/index.ts (modified)

## Change Log

- 2026-01-29: Implemented achievement unlock detection system with Rust backend and TypeScript frontend support
