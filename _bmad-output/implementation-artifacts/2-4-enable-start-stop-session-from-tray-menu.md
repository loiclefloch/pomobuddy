# Story 2.4: Enable Start/Stop Session from Tray Menu

Status: review

## Story

As a user,
I want to start and stop focus sessions directly from the tray menu,
So that I don't need to open the main window for basic timer control.

## Acceptance Criteria

1. **Given** the tray menu with TimerRing and QuickStats
   **When** I add the ActionButton component
   **Then** a prominent button appears below the quick stats
   **And** the button uses shadcn/ui Button component with `primary` variant
   **And** the button has full width within the tray menu

2. **Given** the timer is in idle state
   **When** I view the ActionButton
   **Then** the button displays "Start Session" with a play icon
   **And** the button uses `bg-cozy-accent` background color

3. **Given** the timer is in idle state
   **When** I click "Start Session"
   **Then** a 25-minute focus session begins immediately
   **And** the TimerRing begins filling
   **And** the tray icon changes to focus state
   **And** the button changes to "Stop" with stop icon
   **And** no confirmation dialog is shown (one-click start per UX spec)

4. **Given** the timer is in focus or break state
   **When** I view the ActionButton
   **Then** the button displays "Stop" with a stop icon
   **And** the button uses a secondary/destructive style

5. **Given** a session is active
   **When** I click "Stop"
   **Then** the session ends immediately
   **And** the timer returns to idle state
   **And** no confirmation dialog is shown (graceful interruption per UX13)
   **And** the partial session is recorded (prepared for Epic 3)

6. **Given** the timer is in paused state
   **When** I view the ActionButton
   **Then** a "Resume" button is available
   **And** clicking Resume continues the session

## Tasks / Subtasks

- [x] Task 1: Create ActionButton Component (AC: #1, #2, #4)
  - [x] 1.1: Create `src/features/timer/components/ActionButton.tsx`
  - [x] 1.2: Use shadcn/ui Button component as base
  - [x] 1.3: Accept `status` prop to determine button state
  - [x] 1.4: Style with cozy accent color for primary state
  - [x] 1.5: Add Lucide icons (Play, Square for stop)
  - [x] 1.6: Full width styling within tray menu

- [x] Task 2: Implement Button State Logic (AC: #2, #4, #6)
  - [x] 2.1: When `status === 'idle'`: Show "Start Session" + Play icon
  - [x] 2.2: When `status === 'focus' || 'break'`: Show "Stop" + Square icon
  - [x] 2.3: When `status === 'paused'`: Show "Resume" + Play icon
  - [x] 2.4: Use CVA variants for different button states

- [x] Task 3: Connect to Timer Commands (AC: #3, #5, #6)
  - [x] 3.1: Import `useTimer` hook for timer actions
  - [x] 3.2: Call `startTimer()` on "Start Session" click
  - [x] 3.3: Call `stopTimer()` on "Stop" click
  - [x] 3.4: Call `resumeTimer()` on "Resume" click
  - [x] 3.5: No confirmation dialogs (UX13 - graceful interruption)

- [x] Task 4: Integrate into TrayMenu (AC: #1)
  - [x] 4.1: Import ActionButton into TrayMenu.tsx
  - [x] 4.2: Position below QuickStats section
  - [x] 4.3: Add appropriate spacing/margins
  - [x] 4.4: Connect to timer store for status

- [x] Task 5: Visual Feedback (AC: #3, #5)
  - [x] 5.1: Button state updates immediately on click
  - [x] 5.2: TimerRing updates reflect timer state
  - [x] 5.3: Tray icon state change via existing Story 2.1 infrastructure
  - [x] 5.4: Ensure < 100ms response time (NFR3)

- [x] Task 6: Create Tests
  - [x] 6.1: Create `src/features/timer/components/ActionButton.test.tsx`
  - [x] 6.2: Test button text for each timer state
  - [x] 6.3: Test click handlers invoke correct commands
  - [x] 6.4: Test button styling variants

## Dev Notes

### Previous Stories Context

**Story 2.2 Established:**
- TrayMenu.tsx with TimerRing
- Timer state connection via `useTimerStore`
- `TimerTick` event listening

**Story 2.3 Established:**
- QuickStats section below TimerRing
- Separator patterns in tray menu

**Epic 1 Established:**
- Timer commands: `startTimer`, `pauseTimer`, `resumeTimer`, `stopTimer`
- Timer states: `idle`, `focus`, `break`, `paused`
- `useTimer` hook for invoking commands

### TrayMenu Layout After This Story

```
┌──────────────────────────────┐
│         TimerRing            │
│          MM:SS               │
│                              │
│ ─────────────────────────── │
│                              │
│ 🔥 Day 12        4 sessions │
│ ☕ 1h 40m                    │
│                              │
│ [   Start Session   ]        │  ← ActionButton (THIS STORY)
└──────────────────────────────┘
```

### UX Design Requirements

**From UX Spec (UX13):**
- No guilt messaging - graceful interruption handling
- No confirmation dialogs for stop
- One-click start (no "Are you sure?")

**Button Styling:**
```tsx
// Start state
<Button className="w-full bg-cozy-accent hover:bg-cozy-accent/90">
  <Play className="w-4 h-4 mr-2" />
  Start Session
</Button>

// Stop state
<Button variant="secondary" className="w-full">
  <Square className="w-4 h-4 mr-2" />
  Stop
</Button>
```

### Existing Timer Infrastructure

**useTimer Hook (from Epic 1):**
```typescript
const { startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
```

**Timer Commands Available:**
- `startTimer()` - Starts 25-minute focus session
- `pauseTimer()` - Pauses current session
- `resumeTimer()` - Resumes paused session
- `stopTimer()` - Stops and resets timer

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/timer/components/ActionButton.tsx` | Timer action button |
| `src/features/timer/components/ActionButton.test.tsx` | Button tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/windows/tray/TrayMenu.tsx` | Add ActionButton |
| `src/features/timer/components/index.ts` | Export ActionButton |

### References

- [Source: epics.md#Story-2.4] - Full acceptance criteria
- [Source: ux-design-specification.md#UX13] - No guilt messaging
- [Source: architecture.md#Styling-Patterns] - CVA button variants
- [Source: Epic 1 Stories] - Timer command infrastructure

## Dev Agent Record

### Agent Model Used

Claude (Sisyphus)

### Debug Log References

None required - implementation straightforward.

### Completion Notes List

- ActionButton component created with full state handling (idle/focus/break/paused)
- Integrated into TrayMenu below QuickStats section
- Uses shadcn/ui Button with cozy-accent styling
- Lucide icons (Play, Square) for visual feedback
- No confirmation dialogs per UX13 specification
- 14 unit tests covering all states and interactions
- All tests passing

### File List

**Created:**
- `src/features/timer/components/ActionButton.tsx` - Timer action button component
- `src/features/timer/components/ActionButton.test.tsx` - Unit tests (14 tests)

**Modified:**
- `src/features/timer/components/index.ts` - Added ActionButton export
- `src/windows/tray/TrayMenu.tsx` - Integrated ActionButton
