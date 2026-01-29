# Story 4.4: Implement Achievement Unlock Detection

Status: ready-for-dev

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

- [ ] Task 1: Implement Achievement Check Function (AC: #1)
  - [ ] 1.1: Create `check_achievements()` in achievements.rs
  - [ ] 1.2: Check streak-based achievements
  - [ ] 1.3: Check session-count achievements
  - [ ] 1.4: Return list of newly unlocked achievements

- [ ] Task 2: Integrate with Session Flow (AC: #1)
  - [ ] 2.1: Call `check_achievements()` after session save
  - [ ] 2.2: Call after streak recalculation
  - [ ] 2.3: Pass current stats (streak, totalSessions)

- [ ] Task 3: Handle Achievement Unlock (AC: #2)
  - [ ] 3.1: Add to unlocked array with timestamp
  - [ ] 3.2: Save achievements.json
  - [ ] 3.3: Emit `AchievementUnlocked` event

- [ ] Task 4: Prevent Duplicate Unlocks (AC: #4)
  - [ ] 4.1: Check if already in unlocked array
  - [ ] 4.2: Skip if already unlocked
  - [ ] 4.3: Only emit for new unlocks

- [ ] Task 5: Handle Multiple Unlocks (AC: #5)
  - [ ] 5.1: Collect all newly unlocked achievements
  - [ ] 5.2: Emit events for each
  - [ ] 5.3: Frontend queues celebrations

- [ ] Task 6: Create Achievement Commands (AC: #6)
  - [ ] 6.1: `getAchievements` - all with status
  - [ ] 6.2: `getTotalSessionCount` - lifetime count
  - [ ] 6.3: `getRecentlyUnlocked` - current session unlocks

- [ ] Task 7: Send Notification (AC: #3)
  - [ ] 7.1: Use notification plugin from Epic 1
  - [ ] 7.2: "Achievement Unlocked: {title}"
  - [ ] 7.3: Include achievement icon if supported

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
