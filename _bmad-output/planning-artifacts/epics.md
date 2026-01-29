---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# test-bmad - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for test-bmad, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Timer Core:**
- FR1: User can start a focus session (25-minute pomodoro)
- FR2: User can pause an active focus session
- FR3: User can stop/cancel an active focus session
- FR4: User can see remaining time in the current session
- FR5: System automatically transitions to break mode (5 minutes) after focus session completes
- FR6: User receives notification when focus session ends
- FR7: User receives notification when break ends
- FR8: System tracks incomplete/interrupted sessions separately from completed sessions

**Session Tracking & Statistics:**
- FR9: User can view number of completed sessions today
- FR10: User can view total focus time for the current day
- FR11: System persists all session data to local `.md` files
- FR12: Session data survives app restarts
- FR13: User can view session history

**Streaks & Gamification:**
- FR14: System tracks consecutive days with at least one completed session (streak)
- FR15: User can view current streak count
- FR16: System awards achievement badges for milestones (e.g., 7-day streak, 14-day streak)
- FR17: User can view earned achievements
- FR18: User receives notification when achieving a milestone
- FR19: Streak is preserved if user completes at least one session per day

**User Interface & Experience:**
- FR20: App displays in system tray/menu bar
- FR21: User can open main window from system tray icon
- FR22: User can start/stop sessions directly from system tray menu
- FR23: App displays cozy dark-themed UI
- FR24: App displays animated character (cat/bear) that responds to session events
- FR25: Character celebrates on session completion
- FR26: First-time user sees onboarding welcome

**Data & Storage:**
- FR27: All data stored locally in user-accessible `.md` files
- FR28: User can configure data storage location
- FR29: Data files are human-readable and git-friendly
- FR30: App works fully offline with no network dependency

**Platform Integration:**
- FR31: App runs on macOS with menu bar integration
- FR32: App runs on Linux with system tray integration
- FR33: App sends native OS notifications

### NonFunctional Requirements

**Performance:**
- NFR1: App startup < 3 seconds
- NFR2: Timer accuracy ±1 second over 25 minutes
- NFR3: UI responsiveness < 100ms for user actions
- NFR4: Memory footprint < 200MB idle

**Reliability:**
- NFR5: Zero data loss on normal exit
- NFR6: Graceful crash recovery, no data corruption
- NFR7: Timer survives app backgrounding (continues running even if window closed)

**Accessibility:**
- NFR8: Screen reader support - compatible with VoiceOver (macOS), Orca (Linux)
- NFR9: Keyboard navigation - all core functions accessible via keyboard
- NFR10: Color contrast WCAG AA compliant for text
- NFR11: Visible focus indicators

### Additional Requirements

**From Architecture:**
- AR1: Use Tauri 2.0 as the desktop framework (not Electron)
- AR2: Project initialization via `npm create tauri-app@latest test-bmad -- --template react-ts`
- AR3: Use Zustand 5.0.10 for frontend state management
- AR4: Use shadcn/ui + Tailwind CSS v4 + Radix UI for UI components
- AR5: Timer state managed in Rust backend (survives window close)
- AR6: Multi-window architecture: Tray (280px), Main (800x600), Settings (400x500)
- AR7: Daily session files stored as `.md` in `{data_dir}/sessions/YYYY-MM-DD.md`
- AR8: Settings stored as JSON in `{data_dir}/settings.json`
- AR9: Achievements stored as JSON in `{data_dir}/achievements.json`
- AR10: IPC communication via Tauri events (PascalCase) and commands (camelCase)
- AR11: Feature-based frontend structure (`src/features/`)
- AR12: Co-located tests (`*.test.tsx` next to source files)
- AR13: GitHub Actions CI/CD with Tauri official action
- AR14: Release artifacts: DMG (macOS), AppImage/deb (Linux)

**From UX Design:**
- UX1: 5 character options: Cat, Cow, Polar Bear, Koala, Platypus
- UX2: Character has idle, focus, break, and celebration animation states
- UX3: Lo-fi ambient audio during focus sessions (toggleable)
- UX4: Soft chime sounds at session boundaries
- UX5: Full-screen celebration overlay for milestone achievements
- UX6: Timer displayed as circular progress ring (TimerRing component)
- UX7: Tray menu shows: timer ring, quick stats (streak, today, focus time), action button
- UX8: Main window uses card-based layout with weekly bar chart
- UX9: Cozy color palette: warm browns, coral accent (#E8A598), sage success (#A8C5A0)
- UX10: Typography: Nunito (headings), Inter (body), JetBrains Mono (code)
- UX11: Border radius default 16px (rounded-xl)
- UX12: Onboarding flow: Welcome → Character Selection → Quick Tutorial (3 steps) → First Session
- UX13: No guilt messaging - graceful interruption handling
- UX14: Respect `prefers-reduced-motion` for character animations

### FR Coverage Map

| FR   | Epic   | Description                   |
| ---- | ------ | ----------------------------- |
| FR1  | Epic 1 | Start focus session           |
| FR2  | Epic 1 | Pause focus session           |
| FR3  | Epic 1 | Stop/cancel session           |
| FR4  | Epic 1 | View remaining time           |
| FR5  | Epic 1 | Auto-transition to break      |
| FR6  | Epic 1 | Notification on focus end     |
| FR7  | Epic 1 | Notification on break end     |
| FR8  | Epic 3 | Track interrupted sessions    |
| FR9  | Epic 3 | View completed sessions today |
| FR10 | Epic 3 | View total focus time today   |
| FR11 | Epic 3 | Persist to local .md files    |
| FR12 | Epic 3 | Data survives restarts        |
| FR13 | Epic 3 | View session history          |
| FR14 | Epic 4 | Track consecutive day streak  |
| FR15 | Epic 4 | View current streak           |
| FR16 | Epic 4 | Award achievement badges      |
| FR17 | Epic 4 | View earned achievements      |
| FR18 | Epic 4 | Notification on milestone     |
| FR19 | Epic 4 | Streak preservation logic     |
| FR20 | Epic 2 | Display in system tray        |
| FR21 | Epic 2 | Open main window from tray    |
| FR22 | Epic 2 | Start/stop from tray menu     |
| FR23 | Epic 5 | Cozy dark-themed UI           |
| FR24 | Epic 5 | Animated character            |
| FR25 | Epic 5 | Character celebrates          |
| FR26 | Epic 6 | First-time onboarding         |
| FR27 | Epic 3 | Local .md file storage        |
| FR28 | Epic 3 | Configure storage location    |
| FR29 | Epic 3 | Human-readable files          |
| FR30 | Epic 3 | Fully offline                 |
| FR31 | Epic 2 | macOS menu bar                |
| FR32 | Epic 2 | Linux system tray             |
| FR33 | Epic 2 | Native OS notifications       |

## Epic List

### Epic 1: Project Foundation & Core Timer
User can install the app and run their first focus session with a working timer.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7
**Additional:** AR1, AR2, AR3, AR4, AR5, AR6, AR10, AR11 (Tauri setup, multi-window, basic IPC)

### Epic 2: System Tray Integration & Platform Experience
User can access the timer from their menu bar/system tray without opening a window.
**FRs covered:** FR20, FR21, FR22, FR31, FR32, FR33
**Additional:** UX6, UX7 (TimerRing component, tray menu layout)

### Epic 3: Session Persistence & Statistics
User can see their daily progress and trust that session data is saved reliably.
**FRs covered:** FR8, FR9, FR10, FR11, FR12, FR13, FR27, FR28, FR29, FR30
**Additional:** AR7, AR8 (daily .md files, settings.json), UX8 (card-based stats, bar chart)

### Epic 4: Streaks & Achievements
User can track their consistency with streaks and earn achievement badges for milestones.
**FRs covered:** FR14, FR15, FR16, FR17, FR18, FR19
**Additional:** AR9 (achievements.json), UX5 (celebration overlay)

### Epic 5: Cozy UI & Character System
User experiences the cozy, delightful aesthetic with their chosen companion character.
**FRs covered:** FR23, FR24, FR25
**Additional:** UX1, UX2, UX3, UX4, UX9, UX10, UX11, UX13, UX14 (characters, animations, audio, cozy palette)

### Epic 6: Onboarding & First-Run Experience
New users are welcomed with character selection and guided through their first session.
**FRs covered:** FR26
**Additional:** UX12 (onboarding flow: Welcome → Character Selection → Tutorial → First Session)

---

## Epic 1: Project Foundation & Core Timer

User can install the app and run their first focus session with a working timer.

### Story 1.1: Initialize Tauri Project with React TypeScript

As a developer,
I want the project initialized with Tauri 2.0 and React TypeScript,
So that I have a working foundation to build the desktop application.

**Acceptance Criteria:**

**Given** I have Node.js and Rust installed on my development machine
**When** I run the Tauri initialization command `npm create tauri-app@latest test-bmad -- --template react-ts`
**Then** a new project is created with the correct directory structure
**And** the project contains `src/` for React frontend and `src-tauri/` for Rust backend
**And** I can run `npm install` without errors
**And** I can run `npm run tauri dev` and see the default Tauri window open
**And** the `tauri.conf.json` is configured with app identifier `com.testbmad.app`

**Given** the project is initialized
**When** I examine the project structure
**Then** it matches the Architecture specification with `src/` and `src-tauri/` directories
**And** TypeScript strict mode is enabled in `tsconfig.json`
**And** the Rust `Cargo.toml` includes Tauri 2.0 dependencies

---

### Story 1.2: Configure Development Environment & UI Foundation

As a developer,
I want Tailwind CSS, shadcn/ui, and Zustand configured with the feature-based directory structure,
So that I can build UI components following the architectural patterns.

**Acceptance Criteria:**

**Given** the Tauri project from Story 1.1 exists
**When** I install and configure Tailwind CSS v4
**Then** Tailwind is integrated with Vite via `@tailwindcss/vite` plugin
**And** a `globals.css` file exists in `src/styles/` with Tailwind directives

**Given** Tailwind is configured
**When** I initialize shadcn/ui with `npx shadcn@latest init`
**Then** a `components.json` file is created with correct paths
**And** the shadcn CLI can add components to `src/shared/components/ui/`

**Given** shadcn/ui is configured
**When** I install Zustand and Lucide icons
**Then** `zustand` version 5.x is in `package.json` dependencies
**And** `lucide-react` is available for icon imports

**Given** all dependencies are installed
**When** I create the feature-based directory structure
**Then** the following directories exist:
  - `src/features/timer/` (components, hooks, stores, types.ts)
  - `src/features/stats/`
  - `src/features/achievements/`
  - `src/features/character/`
  - `src/features/settings/`
  - `src/features/onboarding/`
  - `src/shared/components/ui/`
  - `src/shared/hooks/`
  - `src/shared/lib/`
  - `src/windows/tray/`
  - `src/windows/main/`
  - `src/windows/settings/`
**And** path aliases are configured in `tsconfig.json` for `@/features/*`, `@/shared/*`, `@/windows/*`

---

### Story 1.3: Implement Timer State Management in Rust Backend

As a user,
I want the timer to continue running even if I close the window,
So that my focus session is not interrupted by accidentally closing the app.

**Acceptance Criteria:**

**Given** the Tauri project with Rust backend
**When** I implement the timer state module in `src-tauri/src/state/timer_state.rs`
**Then** a `TimerState` struct exists with fields: `status` (idle/focus/break/paused), `remaining_seconds`, `session_start_time`
**And** the state is wrapped in `Mutex<TimerState>` for thread-safe access
**And** the state is managed by Tauri's state management system

**Given** the timer state exists
**When** I implement timer commands in `src-tauri/src/commands/timer.rs`
**Then** the following Tauri commands are available:
  - `startTimer()` - starts a 25-minute focus session
  - `pauseTimer()` - pauses the current session
  - `resumeTimer()` - resumes a paused session
  - `stopTimer()` - stops and resets the timer
  - `getTimerState()` - returns current timer state
**And** commands follow camelCase naming convention per AR10

**Given** the timer commands exist
**When** the timer is running
**Then** a background thread decrements `remaining_seconds` every second
**And** the timer emits `TimerTick` events to the frontend with remaining time
**And** the timer continues running even if all windows are closed
**And** timer accuracy is within ±1 second over 25 minutes (NFR2)

**Given** the timer reaches zero
**When** a focus session completes
**Then** a `SessionComplete` event is emitted with session data
**And** the timer state transitions to `break` mode automatically

---

### Story 1.4: Create Basic Timer UI with Start/Pause/Stop Controls

As a user,
I want to see a timer display with controls to start, pause, and stop my focus session,
So that I can manage my Pomodoro sessions.

**Acceptance Criteria:**

**Given** the Rust backend timer from Story 1.3
**When** I create the timer UI components in `src/features/timer/`
**Then** a `TimerDisplay` component shows the remaining time in MM:SS format
**And** a `TimerControls` component has Start, Pause, and Stop buttons
**And** components use shadcn/ui Button components

**Given** the timer UI components exist
**When** I create `useTimerStore` in `src/features/timer/stores/timerStore.ts`
**Then** the Zustand store has state: `status`, `remainingSeconds`
**And** the store has actions: `setStatus`, `setRemainingSeconds`
**And** the store follows `use{Feature}Store` naming convention per Architecture

**Given** the timer store exists
**When** I create `useTimer` hook in `src/features/timer/hooks/useTimer.ts`
**Then** the hook invokes Tauri commands: `startTimer`, `pauseTimer`, `resumeTimer`, `stopTimer`
**And** the hook listens to `TimerTick` events and updates the store
**And** the hook uses `@tauri-apps/api` for IPC communication

**Given** the timer UI is connected to the backend
**When** the user clicks the Start button
**Then** the timer starts counting down from 25:00
**And** the display updates every second
**And** UI response time is < 100ms (NFR3)

**Given** a timer is running
**When** the user clicks Pause
**Then** the timer stops counting down but retains the remaining time
**And** the Pause button changes to Resume

**Given** a timer is paused
**When** the user clicks Resume
**Then** the timer continues from where it was paused

**Given** a timer is running or paused
**When** the user clicks Stop
**Then** the timer resets to idle state
**And** the display shows "Start" or initial state

---

### Story 1.5: Implement Focus-to-Break Auto-Transition

As a user,
I want the app to automatically start a 5-minute break after my focus session completes,
So that I follow the Pomodoro technique without manual intervention.

**Acceptance Criteria:**

**Given** a focus session is running
**When** the timer reaches 0:00
**Then** the timer automatically transitions to break mode
**And** a new 5-minute countdown begins
**And** the UI reflects the break state (different visual indicator)

**Given** the timer is in break mode
**When** I view the timer display
**Then** the display shows "Break" or a distinct break indicator
**And** the remaining break time is displayed in MM:SS format

**Given** the break timer is running
**When** the user clicks Stop during break
**Then** the break is cancelled
**And** the timer returns to idle state

**Given** the break timer reaches 0:00
**When** the break completes
**Then** the timer returns to idle state
**And** the user can start a new focus session

**Given** the timer state management in Rust backend
**When** focus session completes
**Then** the `SessionComplete` event includes session type (`focus` or `break`)
**And** the backend automatically sets `status` to `break` and `remaining_seconds` to 300

---

### Story 1.6: Add Native Notifications for Session Boundaries

As a user,
I want to receive a notification when my focus session ends and when my break ends,
So that I'm aware of session transitions even when the app is in the background.

**Acceptance Criteria:**

**Given** the Tauri notification plugin is configured
**When** I add `tauri-plugin-notification` to the project
**Then** the plugin is listed in `src-tauri/Cargo.toml` dependencies
**And** the plugin is registered in `src-tauri/src/main.rs`
**And** notification permissions are configured in `src-tauri/capabilities/default.json`

**Given** the notification plugin is configured
**When** a focus session completes (timer reaches 0:00 in focus mode)
**Then** a native OS notification is displayed
**And** the notification title is "Focus Session Complete"
**And** the notification body indicates break is starting
**And** the notification uses the system's native notification style

**Given** the notification plugin is configured
**When** a break session completes (timer reaches 0:00 in break mode)
**Then** a native OS notification is displayed
**And** the notification title is "Break Complete"
**And** the notification body prompts to start next session

**Given** the app is running on macOS
**When** notifications are sent
**Then** notifications appear in the macOS Notification Center
**And** notifications respect system Do Not Disturb settings

**Given** the app is running on Linux
**When** notifications are sent
**Then** notifications appear via the system notification daemon
**And** notifications work on GNOME and KDE desktop environments

---

## Epic 2: System Tray Integration & Platform Experience

User can access the timer from their menu bar/system tray without opening a window.

### Story 2.1: Implement System Tray Icon with Platform Support

As a user,
I want the app to display an icon in my system tray/menu bar,
So that I can access the app quickly without it taking up space in my taskbar.

**Acceptance Criteria:**

**Given** the Tauri project from Epic 1
**When** I add `tauri-plugin-tray` to the project
**Then** the plugin is listed in `src-tauri/Cargo.toml` dependencies
**And** the plugin is registered in `src-tauri/src/main.rs`
**And** tray permissions are configured in `src-tauri/capabilities/default.json`

**Given** the tray plugin is configured
**When** I create tray icon assets in `public/assets/icons/tray/`
**Then** the following icon files exist:
  - `tray-idle.png` (default state)
  - `tray-focus.png` (active focus session)
  - `tray-break.png` (break mode)
**And** icons are appropriately sized for both macOS (22x22 @1x, 44x44 @2x) and Linux (22x22)

**Given** tray icons exist
**When** the app starts on macOS
**Then** the tray icon appears in the menu bar
**And** the icon is visible and correctly sized
**And** clicking the icon triggers the tray menu to open

**Given** tray icons exist
**When** the app starts on Linux
**Then** the tray icon appears in the system tray
**And** the icon works on GNOME desktop environments
**And** the icon works on KDE desktop environments
**And** clicking the icon triggers the tray menu to open

**Given** the timer state changes
**When** the timer transitions between idle, focus, and break states
**Then** the tray icon updates to reflect the current state
**And** icon transitions happen within 100ms of state change

---

### Story 2.2: Create Tray Menu with Timer Ring Display

As a user,
I want to see my timer progress in a circular ring when I click the tray icon,
So that I can quickly check my session progress without opening a window.

**Acceptance Criteria:**

**Given** the tray icon from Story 2.1
**When** I configure multi-window support in `tauri.conf.json`
**Then** a tray window is configured with label `tray`, width 280px, initially hidden
**And** the tray window has no decorations (frameless)
**And** the tray window is configured to appear below/near the tray icon when activated

**Given** the tray window is configured
**When** I create the tray window entry point at `src/windows/tray/`
**Then** `index.html`, `main.tsx`, and `TrayMenu.tsx` files exist
**And** the entry point is registered in `vite.config.ts` as a multi-entry build

**Given** the tray window exists
**When** I create the `TimerRing` component in `src/features/timer/components/TimerRing.tsx`
**Then** the component renders a circular SVG progress ring
**And** the ring has diameter of 120px
**And** the ring stroke width is 8px
**And** the progress color uses `cozy-accent` (#E8A598) for focus mode
**And** the progress color uses `cozy-success` (#A8C5A0) for break mode
**And** the track color uses `cozy-border` (#4A4240)
**And** the ring fills clockwise as the session progresses

**Given** the TimerRing component exists
**When** I view the tray menu during an active session
**Then** the remaining time is displayed in MM:SS format centered in the ring
**And** the progress percentage accurately reflects remaining time
**And** the ring animation is smooth (CSS transitions)

**Given** the timer is idle
**When** I view the tray menu
**Then** the ring is empty/unfilled
**And** the center displays "Start" or a play icon

---

### Story 2.3: Add Quick Stats to Tray Menu

As a user,
I want to see my streak, today's sessions, and focus time in the tray menu,
So that I can monitor my progress at a glance.

**Acceptance Criteria:**

**Given** the tray menu from Story 2.2
**When** I add the QuickStats section below the TimerRing
**Then** the following stats are displayed:
  - Current streak (e.g., "Day 12" with flame icon)
  - Today's completed sessions (e.g., "4 sessions" with clock icon)
  - Today's total focus time (e.g., "1h 40m" with coffee icon)
**And** stats use Lucide icons for visual indicators
**And** stats use `text-cozy-muted` color for labels and `text-cozy-text` for values

**Given** the QuickStats component exists
**When** I create `useQuickStats` hook
**Then** the hook fetches current stats from the Rust backend via IPC
**And** stats update when sessions complete
**And** stats are cached in Zustand store to prevent unnecessary IPC calls

**Given** no sessions have been completed today
**When** I view the quick stats
**Then** today's sessions shows "0 sessions"
**And** today's focus time shows "0m"
**And** streak shows current streak or "0 days" if no streak

**Given** the quick stats are displayed
**When** I hover over a stat
**Then** a tooltip appears with additional context (e.g., "Best streak: 21 days")

---

### Story 2.4: Enable Start/Stop Session from Tray Menu

As a user,
I want to start and stop focus sessions directly from the tray menu,
So that I don't need to open the main window for basic timer control.

**Acceptance Criteria:**

**Given** the tray menu with TimerRing and QuickStats
**When** I add the ActionButton component
**Then** a prominent button appears below the quick stats
**And** the button uses shadcn/ui Button component with `primary` variant
**And** the button has full width within the tray menu

**Given** the timer is in idle state
**When** I view the ActionButton
**Then** the button displays "Start Session" with a play icon
**And** the button uses `bg-cozy-accent` background color

**Given** the timer is in idle state
**When** I click "Start Session"
**Then** a 25-minute focus session begins immediately
**And** the TimerRing begins filling
**And** the tray icon changes to focus state
**And** the button changes to "Stop" with stop icon
**And** no confirmation dialog is shown (one-click start per UX spec)

**Given** the timer is in focus or break state
**When** I view the ActionButton
**Then** the button displays "Stop" with a stop icon
**And** the button uses a secondary/destructive style

**Given** a session is active
**When** I click "Stop"
**Then** the session ends immediately
**And** the timer returns to idle state
**And** no confirmation dialog is shown (graceful interruption per UX13)
**And** the partial session is recorded (prepared for Epic 3)

**Given** the timer is in paused state
**When** I view the ActionButton
**Then** a "Resume" button is available
**And** clicking Resume continues the session

---

### Story 2.5: Add Main Window Launch from Tray

As a user,
I want to open the main statistics window from the tray menu,
So that I can view detailed stats and achievements when needed.

**Acceptance Criteria:**

**Given** the tray menu with timer controls
**When** I add menu items section below the action button
**Then** a separator divides the timer section from menu items
**And** menu items are displayed in a list format

**Given** the menu items section exists
**When** I add navigation menu items
**Then** the following items are available:
  - "Stats & History" with bar-chart icon
  - "Achievements" with trophy icon
  - "Settings" with settings icon
  - Separator
  - "Quit" with x icon
**And** menu items use shadcn/ui DropdownMenu styling
**And** menu items have hover states with `bg-cozy-elevated`

**Given** the main window is configured in `tauri.conf.json`
**When** the window configuration is set
**Then** main window has label `main`, title "test-bmad"
**And** main window default size is 800x600px
**And** main window is initially hidden

**Given** the "Stats & History" menu item exists
**When** I click "Stats & History"
**Then** the main window opens (or focuses if already open)
**And** the tray menu closes
**And** the main window shows the stats view (placeholder for Epic 3)

**Given** the "Achievements" menu item exists
**When** I click "Achievements"
**Then** the main window opens to the achievements tab
**And** the tray menu closes

**Given** the "Settings" menu item exists
**When** I click "Settings"
**Then** the settings window opens (400x500px per AR6)
**And** the tray menu closes
**And** the settings window shows preferences (placeholder for future)

**Given** the "Quit" menu item exists
**When** I click "Quit"
**Then** the application exits gracefully
**And** any running timer state is preserved (prepared for Epic 3 persistence)

---

## Epic 3: Session Persistence & Statistics

User can see their daily progress and trust that session data is saved reliably.

### Story 3.1: Implement Session File Storage in Rust Backend

As a user,
I want my session data saved to local files automatically,
So that I own my data and can back it up or sync it with git.

**Acceptance Criteria:**

**Given** the Tauri project with Rust backend
**When** I implement the storage module in `src-tauri/src/storage/sessions.rs`
**Then** the module can write session data to `.md` files
**And** the module can read existing session data from `.md` files
**And** files are stored in the platform app data directory by default:
  - macOS: `~/Library/Application Support/test-bmad/sessions/`
  - Linux: `~/.local/share/test-bmad/sessions/`

**Given** the storage module exists
**When** a session completes or is interrupted
**Then** a file named `YYYY-MM-DD.md` is created or updated in the sessions directory
**And** the file format matches the Architecture specification:
```markdown
# YYYY-MM-DD

## Sessions
- HH:MM - HH:MM ✓ Complete (25m)
- HH:MM - HH:MM ○ Interrupted (14m)

## Summary
- Complete: N sessions (Xm)
- Partial: N session (Ym)
- Total focus: Zm
```

**Given** a daily session file exists
**When** a new session is recorded on the same day
**Then** the new session is appended to the Sessions list
**And** the Summary section is recalculated
**And** the file write is atomic (no partial writes on crash)

**Given** the app restarts
**When** I start the app on a day with existing sessions
**Then** the existing session data is loaded from the `.md` file
**And** session counts and totals are accurate
**And** data survives app restarts (FR12)

**Given** the session files
**When** I open them in a text editor or Obsidian
**Then** the files are human-readable (FR29)
**And** the files are valid markdown that renders correctly
**And** the files can be diffed and merged in git (git-friendly per FR29)

---

### Story 3.2: Track and Persist Completed and Interrupted Sessions

As a user,
I want my interrupted sessions tracked separately from completed sessions,
So that I have an honest record of my focus time.

**Acceptance Criteria:**

**Given** the session storage from Story 3.1
**When** a focus session completes (timer reaches 0:00)
**Then** the session is recorded with status "Complete"
**And** the session entry shows `✓ Complete (25m)`
**And** the complete session count increments

**Given** a session is active
**When** the user clicks Stop before the timer completes
**Then** the session is recorded with status "Interrupted"
**And** the session entry shows `○ Interrupted (Xm)` where X is minutes completed
**And** the partial session count increments
**And** no guilt messaging is shown (UX13)

**Given** the app crashes or is force-quit during a session
**When** the app restarts
**Then** the interrupted session is recovered and saved
**And** the session shows the last known elapsed time
**And** no data is lost (NFR5, NFR6)

**Given** sessions are being recorded
**When** I implement the Rust commands for session management
**Then** `saveSession(sessionData)` command persists session to file
**And** `getSessionsForDate(date)` command returns sessions for a specific date
**And** `getTodaySessions()` command returns today's session list

**Given** the timer completes a focus session
**When** the `SessionComplete` event is emitted
**Then** the session is automatically saved to storage
**And** the frontend is notified of the updated session count

---

### Story 3.3: Create Daily Statistics View

As a user,
I want to see how many sessions I've completed today and my total focus time,
So that I can track my daily productivity.

**Acceptance Criteria:**

**Given** the session storage with today's data
**When** I create the stats feature in `src/features/stats/`
**Then** the following components exist:
  - `StatsCard.tsx` - reusable card for displaying a single stat
  - `TodayStats.tsx` - composition of today's statistics
**And** components are in `src/features/stats/components/`

**Given** the StatsCard component
**When** I render a stat card
**Then** the card displays:
  - An icon (Lucide icon)
  - A primary value (large text)
  - A label (smaller muted text)
  - Optional secondary text (e.g., comparison)
**And** the card uses `bg-cozy-surface` background
**And** the card has `rounded-xl` (16px) border radius
**And** the card has 20px padding

**Given** session data exists for today
**When** I view the TodayStats component
**Then** I see "Sessions Today" card showing completed session count (FR9)
**And** I see "Focus Time" card showing total minutes/hours (FR10)
**And** values update in real-time when sessions complete

**Given** no sessions exist for today
**When** I view the TodayStats component
**Then** "Sessions Today" shows "0"
**And** "Focus Time" shows "0m"
**And** the display is encouraging, not guilt-inducing

**Given** the stats components exist
**When** I create `useStats` hook in `src/features/stats/hooks/useStats.ts`
**Then** the hook fetches today's statistics via IPC
**And** the hook provides `sessionsToday`, `focusTimeToday`, `completedCount`, `interruptedCount`
**And** the hook updates when `SessionComplete` events are received

---

### Story 3.4: Build Session History View

As a user,
I want to view my session history,
So that I can review my past focus sessions.

**Acceptance Criteria:**

**Given** the main window from Epic 2
**When** I create the session history view
**Then** a scrollable list of past sessions is displayed
**And** sessions are grouped by date
**And** each session shows start time, end time, duration, and status (complete/interrupted)

**Given** session data exists
**When** I implement `getSessionHistory(days)` Rust command
**Then** the command returns sessions for the last N days
**And** default is 7 days of history
**And** sessions are sorted by date descending, then by time descending

**Given** the history view exists
**When** I view session history (FR13)
**Then** each day section shows:
  - Date header (e.g., "Today", "Yesterday", "Mon, Jan 27")
  - List of sessions with time and status
  - Daily summary (total sessions, total time)

**Given** a day has both complete and interrupted sessions
**When** I view that day's history
**Then** complete sessions show with checkmark indicator
**And** interrupted sessions show with circle indicator
**And** the styling matches the `.md` file format for consistency

**Given** the history list is long
**When** I scroll through the list
**Then** the list scrolls smoothly
**And** older sessions can be loaded (pagination or infinite scroll)
**And** performance remains responsive (NFR3)

---

### Story 3.5: Implement Weekly Bar Chart Visualization

As a user,
I want to see a bar chart of my weekly focus hours,
So that I can visualize my productivity trends.

**Acceptance Criteria:**

**Given** session data for the past 7 days
**When** I create the `WeeklyBarChart` component in `src/features/stats/components/`
**Then** the component displays 7 vertical bars (Mon-Sun or rolling 7 days)
**And** bar height is proportional to focus hours for that day
**And** the chart has labeled x-axis with day abbreviations

**Given** the WeeklyBarChart component
**When** I style the chart
**Then** bars use `bg-cozy-accent` (#E8A598) color
**And** today's bar is highlighted at full opacity
**And** other days' bars are at 60% opacity
**And** bars have `rounded-t-md` (6px) top corners
**And** empty days show a minimal stub (not zero height)

**Given** the chart is interactive
**When** I hover over a bar
**Then** a tooltip shows:
  - Day name and date
  - Total focus hours (e.g., "2h 15m")
  - Number of sessions completed

**Given** weekly data needs to be calculated
**When** I implement `getWeeklyStats()` Rust command
**Then** the command returns an array of 7 daily totals
**And** each entry includes: date, focusMinutes, sessionCount
**And** the week starts from 6 days ago to today

**Given** the main window stats view
**When** I add the WeeklyBarChart
**Then** the chart is displayed below the stat cards (UX8)
**And** the chart has a header "This Week"
**And** a weekly total is shown (e.g., "12.5 hours total")

---

### Story 3.6: Add Settings Storage and Configuration

As a user,
I want to configure where my data is stored,
So that I can sync it with Dropbox, git, or my preferred backup solution.

**Acceptance Criteria:**

**Given** the Tauri project
**When** I implement settings storage in `src-tauri/src/storage/settings.rs`
**Then** settings are stored in `{data_dir}/settings.json`
**And** the settings file is created on first launch with defaults

**Given** the settings storage exists
**When** I define the settings schema
**Then** settings include:
  - `focusDuration`: number (default: 1500 seconds / 25 minutes)
  - `breakDuration`: number (default: 300 seconds / 5 minutes)
  - `storagePath`: string | null (default: null = use system default)
  - `audioEnabled`: boolean (default: true)
  - `character`: string (default: "cat")
**And** the schema matches Architecture AR8 specification

**Given** settings can be stored
**When** I implement settings commands
**Then** `getSettings()` returns current settings
**And** `updateSettings(settings)` saves updated settings
**And** settings changes are persisted immediately

**Given** the settings window exists
**When** I create a basic settings form in `src/features/settings/`
**Then** the form allows changing the storage location (FR28)
**And** a folder picker dialog allows browsing for custom location
**And** changing storage location moves existing data files

**Given** a custom storage path is set
**When** sessions are saved
**Then** files are written to the custom path instead of default
**And** the app works fully offline with the custom path (FR30)

**Given** settings are changed
**When** the app restarts
**Then** settings are loaded from `settings.json`
**And** the custom storage path is used if configured

---

## Epic 4: Streaks & Achievements

User can track their consistency with streaks and earn achievement badges for milestones.

### Story 4.1: Implement Streak Tracking Logic

As a user,
I want the app to track my consecutive days of completed sessions,
So that I can build and maintain focus habits.

**Acceptance Criteria:**

**Given** the session storage from Epic 3
**When** I implement streak tracking in `src-tauri/src/storage/achievements.rs`
**Then** the module tracks `currentStreak` and `longestStreak`
**And** streak data is persisted in `{data_dir}/achievements.json`

**Given** streak tracking exists
**When** a user completes at least one session on a day
**Then** that day is marked as a "streak day"
**And** if yesterday was also a streak day, `currentStreak` increments
**And** if yesterday was not a streak day, `currentStreak` resets to 1

**Given** streak logic is implemented
**When** evaluating streak continuation (FR19)
**Then** only ONE completed session per day is required to maintain streak
**And** interrupted sessions do NOT count toward streak
**And** the streak check happens at session completion

**Given** the user misses a day (no completed sessions)
**When** they complete a session the following day
**Then** `currentStreak` resets to 1
**And** `longestStreak` is preserved if it was higher
**And** no guilt messaging is shown about broken streak (UX13)

**Given** streak data needs to be calculated
**When** I implement `calculateStreak()` Rust function
**Then** the function scans session files backwards from today
**And** counts consecutive days with at least one complete session
**And** handles edge cases (first day, app installed mid-day)

**Given** streak commands are needed
**When** I implement IPC commands
**Then** `getStreakData()` returns `{ currentStreak, longestStreak, lastStreakDate }`
**And** streak is recalculated on app startup to handle offline days

---

### Story 4.2: Display Current Streak in UI

As a user,
I want to see my current streak count prominently displayed,
So that I'm motivated to maintain my focus habit.

**Acceptance Criteria:**

**Given** streak tracking from Story 4.1
**When** I view the tray menu QuickStats (from Epic 2)
**Then** the streak is displayed with flame icon
**And** format is "Day X" or "X days" (e.g., "Day 12")
**And** streak updates immediately when a session completes

**Given** the main window stats view (from Epic 3)
**When** I add a StreakCard component
**Then** a dedicated card shows current streak
**And** the card displays:
  - Flame icon in `cozy-accent` color
  - Current streak as primary value
  - "Best: X days" as secondary text showing longest streak
**And** the card matches other StatsCard styling

**Given** the streak is 0 (no streak)
**When** I view streak displays
**Then** tray shows "0 days" or "Start streak!"
**And** main window shows encouraging message, not guilt
**And** tone is inviting, not punishing

**Given** the streak reaches a milestone (7, 14, 30 days)
**When** I view the streak card
**Then** the card may show a subtle highlight or badge indicator
**And** this connects to the achievement system (Story 4.4)

**Given** streak data is needed in frontend
**When** I create `useStreakStore` in `src/features/achievements/stores/`
**Then** the store holds `currentStreak`, `longestStreak`
**And** the store updates via `StreakUpdated` Tauri event
**And** components subscribe to streak changes reactively

---

### Story 4.3: Define Achievement System and Badges

As a user,
I want a collection of achievements I can earn,
So that I have goals to work toward and milestones to celebrate.

**Acceptance Criteria:**

**Given** the achievements feature
**When** I define the achievement types in `src/features/achievements/types.ts`
**Then** an `Achievement` interface includes:
  - `id`: unique identifier (e.g., "streak_7", "sessions_100")
  - `title`: display name (e.g., "Week Warrior")
  - `description`: what was accomplished
  - `icon`: Lucide icon name
  - `tier`: "bronze" | "silver" | "gold" | "platinum"
  - `unlockedAt`: ISO date string | null

**Given** achievement types are defined
**When** I create the achievement definitions
**Then** the following achievements exist:

**Streak Achievements:**
- `first_session`: "First Focus" - Complete your first session (bronze)
- `streak_7`: "Week Warrior" - 7-day streak (silver)
- `streak_14`: "Fortnight Focus" - 14-day streak (gold)
- `streak_30`: "Monthly Master" - 30-day streak (platinum)

**Session Count Achievements:**
- `sessions_10`: "Getting Started" - 10 total sessions (bronze)
- `sessions_50`: "Half Century" - 50 total sessions (silver)
- `sessions_100`: "Centurion" - 100 total sessions (gold)
- `sessions_500`: "Focus Legend" - 500 total sessions (platinum)

**Given** achievement definitions exist
**When** I store unlocked achievements in `achievements.json` (AR9)
**Then** the file format is:
```json
{
  "unlocked": [
    { "id": "first_session", "unlockedAt": "2026-01-29T09:45:00Z" }
  ],
  "currentStreak": 7,
  "longestStreak": 14,
  "totalSessions": 42
}
```
**And** the file is created on first launch with empty `unlocked` array

**Given** achievement icons are needed
**When** I map achievements to Lucide icons
**Then** each achievement has an appropriate icon:
  - Streak achievements: `flame`, `zap`, `award`
  - Session achievements: `target`, `trophy`, `medal`, `crown`

---

### Story 4.4: Implement Achievement Unlock Detection

As a user,
I want achievements to unlock automatically when I reach milestones,
So that I'm rewarded for my progress without manual tracking.

**Acceptance Criteria:**

**Given** achievement definitions from Story 4.3
**When** I implement achievement detection in Rust backend
**Then** `checkAchievements()` function evaluates all unlock conditions
**And** the function is called after every completed session
**And** the function is called after streak recalculation

**Given** achievement detection runs
**When** a new achievement condition is met
**Then** the achievement is added to `unlocked` array in `achievements.json`
**And** `unlockedAt` is set to current ISO timestamp
**And** an `AchievementUnlocked` event is emitted with achievement data

**Given** the `AchievementUnlocked` event is emitted
**When** the frontend receives the event
**Then** the celebration overlay is triggered (Story 4.6)
**And** a notification is sent (FR18)
**And** the achievement gallery updates

**Given** an achievement is already unlocked
**When** the condition is met again
**Then** the achievement is NOT unlocked again
**And** no duplicate events are emitted

**Given** multiple achievements could unlock simultaneously
**When** a session completes (e.g., 7th day AND 50th session)
**Then** all qualifying achievements unlock
**And** celebrations are queued and shown sequentially
**And** each achievement gets its moment

**Given** achievement commands are needed
**When** I implement IPC commands
**Then** `getAchievements()` returns all achievements with unlock status
**And** `getTotalSessionCount()` returns lifetime session count
**And** `getRecentlyUnlocked()` returns achievements unlocked in current session

---

### Story 4.5: Create Achievement Gallery View

As a user,
I want to view all my earned achievements and see which ones I'm working toward,
So that I can celebrate my progress and set goals.

**Acceptance Criteria:**

**Given** achievement data from Stories 4.3 and 4.4
**When** I create the achievement gallery in `src/features/achievements/components/`
**Then** `AchievementGallery.tsx` displays all achievements in a grid
**And** `AchievementBadge.tsx` renders individual achievement cards

**Given** the AchievementBadge component
**When** rendering an unlocked achievement
**Then** the badge displays:
  - Icon in full color (tier-appropriate coloring)
  - Achievement title
  - Unlock date
  - Full opacity and visual prominence
**And** the badge uses character-specific accent colors if applicable

**Given** the AchievementBadge component
**When** rendering a locked achievement
**Then** the badge displays:
  - Icon in muted/grayscale color
  - Achievement title
  - Progress hint (e.g., "3/7 days" for streak_7)
  - Reduced opacity (50-60%)
**And** hovering shows the unlock requirement

**Given** the AchievementGallery component
**When** displaying all achievements (FR17)
**Then** achievements are grouped by category (Streaks, Sessions)
**And** unlocked achievements appear first within each group
**And** the grid is responsive (2-4 columns based on window width)

**Given** the main window
**When** user clicks "Achievements" from tray menu
**Then** the main window opens to the achievements tab/view
**And** the gallery is displayed with current achievement status

**Given** an achievement was recently unlocked
**When** viewing the gallery
**Then** the recently unlocked badge has a subtle glow or "NEW" indicator
**And** the indicator fades after the badge is viewed

---

### Story 4.6: Build Full-Screen Celebration Overlay

As a user,
I want a delightful celebration when I achieve a milestone,
So that my accomplishments feel special and earned.

**Acceptance Criteria:**

**Given** the `AchievementUnlocked` event from Story 4.4
**When** I create the celebration overlay in `src/features/achievements/components/CelebrationOverlay.tsx`
**Then** the overlay covers the entire window
**And** the overlay has a dark semi-transparent background (`cozy-bg` at 95% opacity)
**And** the overlay uses CSS animations for entrance

**Given** the CelebrationOverlay component
**When** a milestone achievement unlocks (streak_7, streak_14, streak_30, sessions_100)
**Then** the full-screen celebration is triggered
**And** the overlay displays:
  - Achievement badge icon (large, 100px)
  - Achievement title in display font (Nunito 32px)
  - Achievement description
  - "Continue" button to dismiss
**And** the badge has a glowing shadow effect

**Given** the celebration is shown
**When** I implement the particle system in `ParticleSystem.tsx`
**Then** confetti or sparkle particles animate across the screen
**And** particles use achievement tier-appropriate colors
**And** particles fade out over 3 seconds
**And** the animation respects `prefers-reduced-motion` (UX14)

**Given** celebration tiers (from UX spec)
**When** different achievements unlock
**Then** celebration intensity matches achievement significance:
  - Bronze (first_session): 3s, sparkles, warm chime
  - Silver (streak_7): 4s, confetti burst, celebratory tune
  - Gold (streak_14, sessions_100): 5s, confetti rain, fanfare
  - Platinum (streak_30, sessions_500): 6s, fireworks, full fanfare

**Given** the celebration is displaying
**When** user clicks "Continue" or waits 10 seconds
**Then** the overlay fades out gracefully
**And** the app returns to normal state
**And** the achievement is marked as "seen" (no NEW indicator later)

**Given** multiple achievements unlock at once
**When** celebrations are queued
**Then** each celebration shows sequentially
**And** there's a brief pause (500ms) between celebrations
**And** user can click through faster if desired

---

## Epic 5: Cozy UI & Character System

User experiences the cozy, delightful aesthetic with their chosen companion character.

### Story 5.1: Implement Cozy Design System Theme

As a user,
I want the app to have a warm, cozy visual aesthetic,
So that using the app feels pleasant and not like a sterile productivity tool.

**Acceptance Criteria:**

**Given** the Tailwind CSS configuration from Epic 1
**When** I implement the cozy theme in `tailwind.config.ts`
**Then** the following color tokens are defined (UX9):

**Dark Mode (Primary):**
- `cozy-bg`: #1C1816 (app canvas)
- `cozy-surface`: #2A2422 (cards, menus)
- `cozy-elevated`: #3D3533 (hover states, popups)
- `cozy-accent`: #E8A598 (coral - buttons, highlights)
- `cozy-success`: #A8C5A0 (sage - success states)
- `cozy-text`: #F5F0E8 (primary text)
- `cozy-muted`: #A89888 (secondary text)
- `cozy-border`: #4A4240 (separators)

**Given** color tokens are defined
**When** I configure typography (UX10)
**Then** the following font families are configured:
- `font-heading`: Nunito (warm, rounded, friendly)
- `font-body`: Inter (clean, readable)
- `font-mono`: JetBrains Mono (code snippets)
**And** font files are placed in `public/assets/fonts/`
**And** `@font-face` declarations are in `globals.css`

**Given** typography is configured
**When** I define spacing and border radius defaults (UX11)
**Then** default border radius is `rounded-xl` (16px) for containers
**And** shadow tokens are defined:
- `shadow-soft`: subtle elevation
- `shadow-medium`: cards, dropdowns
- `shadow-glow`: accent glow on focus
- `shadow-warm`: dark mode modal shadows

**Given** the theme is implemented
**When** I apply cozy styling to existing components
**Then** all shadcn/ui components use cozy color tokens
**And** the dark theme is the default (FR23)
**And** all text meets WCAG AA contrast requirements (NFR10)
**And** focus indicators are visible (NFR11)

**Given** the cozy theme exists
**When** I view any app window
**Then** the overall aesthetic feels warm, not clinical
**And** colors are muted and calming
**And** generous spacing creates breathing room

---

### Story 5.2: Create Character Sprite System

As a user,
I want to see an animated companion character in the app,
So that I have a cozy presence during my focus sessions.

**Acceptance Criteria:**

**Given** the character feature directory
**When** I create `CharacterSprite.tsx` in `src/features/character/components/`
**Then** the component renders a character image/sprite
**And** the component accepts props: `character`, `state`, `size`
**And** the component handles animation transitions smoothly

**Given** the CharacterSprite component
**When** I define character states (UX2)
**Then** the following states are supported:
- `idle`: relaxed, occasional blink/breathing animation
- `focus`: working pose, concentrated expression
- `break`: stretching, relaxed pose
- `celebrate`: happy dance, celebration animation
**And** each state has corresponding sprite/animation

**Given** character states exist
**When** I implement state transitions
**Then** transitions between states are smooth (300ms ease-out)
**And** the `prefers-reduced-motion` media query is respected (UX14)
**And** if reduced motion is preferred, static images are shown instead

**Given** the CharacterSprite component
**When** I define size variants
**Then** the following sizes are available:
- `sm`: 40px (tray icon area)
- `md`: 80px (tray menu)
- `lg`: 120px (main window, celebrations)
**And** sprites scale appropriately for each size

**Given** character selection is needed
**When** I create `useCharacterStore` in `src/features/character/stores/`
**Then** the store holds `selectedCharacter` (persisted in settings)
**And** the store provides `setCharacter(character)` action
**And** character preference is loaded from settings on startup

---

### Story 5.3: Add Character Assets for All 5 Characters

As a user,
I want to choose from 5 different companion characters,
So that I can personalize my focus companion.

**Acceptance Criteria:**

**Given** the character system from Story 5.2
**When** I create character assets in `src/features/character/assets/`
**Then** the following characters exist (UX1):
- `cat/` - Cozy cat character
- `cow/` - Friendly cow character
- `polarBear/` - Polar bear character
- `koala/` - Koala character
- `platypus/` - Platypus character

**Given** each character directory
**When** I add sprite assets
**Then** each character has the following images:
- `idle.png` - default relaxed state
- `focus.png` - working/concentrated state
- `break.png` - stretching/relaxed state
- `celebrate.png` - celebration pose
- `dance.png` - extended celebration animation (optional spritesheet)
**And** images are optimized for web (PNG with transparency)
**And** images are sized appropriately for largest use (120px base)

**Given** character assets exist
**When** I create `CharacterSelector.tsx` component
**Then** the component displays all 5 characters in a selection grid
**And** each character shows a preview of their idle state
**And** the currently selected character is highlighted
**And** clicking a character updates the selection

**Given** character assets are loaded
**When** the app displays a character
**Then** images load quickly (preloaded on app start)
**And** there's no flash of missing image during state transitions
**And** fallback handling exists if an asset fails to load

**Given** character colors are defined (from UX spec)
**When** characters have accent colors
**Then** the following accents are available for badges/highlights:
- Cat: Peachy Coral (#F4B8A8)
- Cow: Cream Spots (#F5E6D3)
- Polar Bear: Icy Blue (#B8D4E3)
- Koala: Eucalyptus (#A8C5A0)
- Platypus: Teal Brown (#7BAFA3)

---

### Story 5.4: Implement Character State Animations

As a user,
I want my companion character to respond to my focus sessions,
So that the character feels alive and connected to my activity.

**Acceptance Criteria:**

**Given** the CharacterSprite and timer state
**When** I connect character state to timer state
**Then** character state updates automatically based on timer:
- Timer idle → Character idle
- Timer focus → Character focus
- Timer break → Character break
- Session complete → Character celebrate (temporary)

**Given** character state connection exists
**When** the timer starts a focus session
**Then** the character transitions from idle to focus pose
**And** the transition animates smoothly (300ms)
**And** the character maintains focus pose throughout session

**Given** a focus session completes
**When** the `SessionComplete` event fires
**Then** the character transitions to celebrate state (FR25)
**And** the celebration plays for 2-3 seconds
**And** the character then transitions to break or idle state

**Given** the character is in idle state
**When** I implement idle animations
**Then** the character has subtle "breathing" animation (scale pulse)
**And** occasional blink animation (every 3-5 seconds)
**And** animations are gentle and not distracting
**And** animations stop if `prefers-reduced-motion` is enabled

**Given** celebration animation is triggered
**When** the character celebrates
**Then** the character does a happy bounce or dance
**And** the animation is cheerful but brief
**And** the animation matches the cozy aesthetic (not over-the-top)

**Given** the tray menu displays character
**When** I add character to tray menu
**Then** a small character sprite appears in the timer ring or nearby
**And** the character state matches the current timer state
**And** the character adds personality without cluttering the UI

---

### Story 5.5: Add Lo-Fi Ambient Audio System

As a user,
I want calming lo-fi music during my focus sessions,
So that I can enter a focused state more easily.

**Acceptance Criteria:**

**Given** the audio feature
**When** I create audio management in `src/shared/hooks/useAudio.ts`
**Then** the hook provides:
- `playAmbient()` - starts lo-fi audio loop
- `stopAmbient()` - stops ambient audio
- `setVolume(level)` - adjusts volume (0-1)
- `isPlaying` - current playback state
**And** the hook uses Web Audio API or HTML5 Audio

**Given** audio management exists
**When** I add ambient audio files
**Then** `public/assets/audio/` contains lo-fi ambient track(s)
**And** audio files are optimized for web (MP3 or OGG)
**And** audio loops seamlessly without audible gap

**Given** ambient audio is available
**When** a focus session starts (UX3)
**Then** lo-fi audio fades in over 500ms
**And** audio volume respects system volume settings
**And** audio continues playing throughout the session

**Given** a focus session ends or is stopped
**When** the session transitions
**Then** lo-fi audio fades out over 300ms
**And** audio stops completely (no background drain)

**Given** audio preferences exist
**When** I add audio toggle to settings
**Then** `audioEnabled` setting controls ambient audio
**And** users can disable ambient audio entirely
**And** the setting persists across sessions

**Given** break mode is active
**When** ambient audio plays during break (optional)
**Then** a different, lighter ambient track may play
**And** or audio remains silent during breaks (based on preference)

---

### Story 5.6: Add Session Boundary Sound Effects

As a user,
I want gentle sound cues when sessions start and end,
So that I'm aware of transitions without jarring interruptions.

**Acceptance Criteria:**

**Given** the audio system from Story 5.5
**When** I add sound effect files
**Then** `public/assets/audio/` contains:
- `session-start.mp3` - gentle chime for session start
- `session-complete.mp3` - soft completion chime (UX4)
- `break-complete.mp3` - break end notification sound
- `celebration.mp3` - achievement/milestone fanfare
**And** sounds are short (< 3 seconds)
**And** sounds match the cozy aesthetic (warm, not harsh)

**Given** sound effects exist
**When** I create `useSoundEffects` hook
**Then** the hook provides:
- `playSessionStart()` - plays start chime
- `playSessionComplete()` - plays completion chime
- `playBreakComplete()` - plays break end chime
- `playCelebration(tier)` - plays celebration sound (varies by tier)
**And** sounds respect `audioEnabled` setting

**Given** the timer fires events
**When** a focus session starts
**Then** a gentle start chime plays (if audio enabled)
**And** the chime is subtle and non-intrusive

**Given** a focus session completes
**When** the `SessionComplete` event fires
**Then** the completion chime plays
**And** the sound is distinctly different from start chime
**And** the sound is satisfying and rewarding

**Given** a break completes
**When** the break timer ends
**Then** the break-complete chime plays
**And** the sound gently prompts user to start next session

**Given** an achievement unlocks
**When** the celebration overlay appears
**Then** the celebration sound plays
**And** sound intensity matches achievement tier:
  - Bronze: warm chime
  - Silver: celebratory tune
  - Gold/Platinum: full fanfare
**And** sounds layer appropriately with celebration visuals

---

## Epic 6: Onboarding & First-Run Experience

New users are welcomed with character selection and guided through their first session.

### Story 6.1: Detect First-Run State

As a user launching the app for the first time,
I want the app to recognize this is my first time,
So that I can be guided through setup instead of dropped into an empty interface.

**Acceptance Criteria:**

**Given** the app is launched
**When** I implement first-run detection in Rust backend
**Then** the app checks for existence of `settings.json` in data directory
**And** if settings file doesn't exist, `isFirstRun` is true
**And** if settings file exists with `onboardingComplete: true`, `isFirstRun` is false

**Given** first-run detection exists
**When** I implement `getAppState()` Rust command
**Then** the command returns `{ isFirstRun, onboardingComplete, ... }`
**And** the frontend can check this on startup

**Given** the frontend checks first-run state
**When** `isFirstRun` is true
**Then** the onboarding flow is triggered automatically
**And** the main app UI is not shown until onboarding completes

**Given** onboarding completes
**When** the user finishes the flow
**Then** `onboardingComplete: true` is saved to settings
**And** subsequent app launches skip onboarding
**And** the main tray interface becomes active

**Given** the user wants to replay onboarding
**When** a "Replay Welcome" option exists in settings (optional)
**Then** the user can trigger onboarding again
**And** this resets `onboardingComplete` temporarily

---

### Story 6.2: Create Welcome Screen

As a new user,
I want to be greeted warmly when I first open the app,
So that I feel welcomed and excited to use it.

**Acceptance Criteria:**

**Given** first-run is detected
**When** I create the onboarding feature in `src/features/onboarding/`
**Then** the following components exist:
- `OnboardingFlow.tsx` - main flow controller
- `WelcomeScreen.tsx` - initial welcome step
**And** components are in `src/features/onboarding/components/`

**Given** the WelcomeScreen component
**When** displayed to a new user
**Then** the screen shows:
- Warm greeting: "Welcome to test-bmad!" in Nunito display font
- Friendly tagline: "Your cozy focus companion"
- A preview character waving (default cat or random)
- "Get Started" button to proceed
**And** the background uses `cozy-bg` color
**And** the overall feel is warm and inviting

**Given** the welcome screen is displayed
**When** I implement the layout
**Then** the content is centered vertically and horizontally
**And** generous padding creates a calm, spacious feel
**And** a subtle entrance animation fades in the content

**Given** the "Get Started" button exists
**When** the user clicks it
**Then** the flow transitions to character selection (Story 6.3)
**And** the transition is smooth (slide or fade)

**Given** the onboarding window
**When** I configure it in Tauri
**Then** onboarding uses the main window (800x600)
**And** the window is centered on screen
**And** the window cannot be closed until onboarding completes (or has skip option)

---

### Story 6.3: Build Character Selection Step

As a new user,
I want to choose my companion character during setup,
So that I feel personal ownership of my focus companion.

**Acceptance Criteria:**

**Given** the onboarding flow
**When** I create `CharacterSelectionStep.tsx`
**Then** the component displays all 5 characters in a selection grid
**And** each character is shown with their idle animation
**And** character names are displayed below each option

**Given** the character selection grid
**When** displayed to the user (UX12)
**Then** the screen shows:
- Heading: "Choose your companion"
- Subheading: "They'll be with you on your focus journey"
- 5 character cards in a responsive grid (2-3 columns)
- "Continue" button (disabled until selection made)

**Given** a character card
**When** I implement the card design
**Then** each card shows:
- Character sprite in idle pose (80px)
- Character name (e.g., "Cat", "Koala")
- Subtle border in character's accent color on hover
**And** cards have `rounded-xl` corners
**And** cards have hover lift effect

**Given** the user clicks a character
**When** a character is selected
**Then** the selected card shows a visible selection indicator (border, checkmark, or glow)
**And** the selection is stored in component state
**And** the "Continue" button becomes enabled

**Given** the user clicks "Continue"
**When** a character is selected
**Then** the character preference is saved to settings (`character: "koala"`)
**And** the flow proceeds to the tutorial step (Story 6.4)
**And** the selected character appears in subsequent steps

**Given** no character is selected
**When** the user tries to proceed
**Then** the "Continue" button remains disabled
**And** a subtle hint encourages selection

---

### Story 6.4: Create Quick Tutorial Walkthrough

As a new user,
I want a brief tutorial showing how to use the app,
So that I understand the core features without reading documentation.

**Acceptance Criteria:**

**Given** character selection is complete
**When** I create `TutorialStep.tsx`
**Then** the component shows a 3-step tutorial (UX12)
**And** steps are presented one at a time
**And** progress indicator shows current step (1/3, 2/3, 3/3)

**Given** the tutorial steps
**When** I define tutorial content
**Then** the 3 steps are:

**Step 1: "Click the tray to start"**
- Visual: Tray icon illustration/screenshot
- Text: "Find me in your menu bar. Click to open the timer."
- Shows tray icon location for macOS/Linux

**Step 2: "25 minutes focus, 5 minutes break"**
- Visual: Timer ring illustration
- Text: "Start a session and I'll keep you company. Take breaks guilt-free."
- Shows the Pomodoro concept briefly

**Step 3: "Build streaks, earn badges"**
- Visual: Streak flame and achievement badge
- Text: "Complete sessions daily to build streaks. Unlock achievements along the way!"
- Shows gamification elements

**Given** each tutorial step
**When** displayed to the user
**Then** the selected character appears alongside the content
**And** the character has an encouraging pose
**And** "Next" button advances to next step
**And** "Back" button returns to previous step (except step 1)

**Given** the tutorial navigation
**When** the user reaches step 3
**Then** the "Next" button changes to "Let's Go!" or "Start First Session"
**And** clicking proceeds to the final onboarding step (Story 6.5)

**Given** the tutorial UI
**When** I implement the design
**Then** each step has consistent layout
**And** visuals are simple illustrations, not overwhelming
**And** text is concise (2-3 sentences max per step)

---

### Story 6.5: Prompt First Focus Session

As a new user completing onboarding,
I want the option to start my first focus session immediately,
So that I can begin using the app right away.

**Acceptance Criteria:**

**Given** the tutorial is complete
**When** I create `FirstSessionPrompt.tsx`
**Then** the component offers to start the first session
**And** the selected character is prominently displayed
**And** the character shows an encouraging/excited pose

**Given** the first session prompt
**When** displayed to the user
**Then** the screen shows:
- Character greeting by name (if we collected it, or generic "Ready to focus?")
- Heading: "Ready for your first session?"
- The character in an inviting pose
- Two options: "Start Session" (primary) and "Maybe Later" (secondary)

**Given** the "Start Session" button
**When** the user clicks it
**Then** `onboardingComplete: true` is saved to settings
**And** the onboarding window closes
**And** a 25-minute focus session starts immediately
**And** the tray icon shows active state
**And** the user's first session begins!

**Given** the "Maybe Later" button
**When** the user clicks it
**Then** `onboardingComplete: true` is saved to settings
**And** the onboarding window closes
**And** the app minimizes to tray in idle state
**And** the user can start a session whenever ready

**Given** the first session completes
**When** the user finishes their first focus session
**Then** the `first_session` achievement unlocks
**And** the celebration overlay is shown
**And** the user feels accomplished and welcomed

**Given** onboarding is complete
**When** the app launches in the future
**Then** onboarding is skipped
**And** the app starts minimized to tray (or per user preference)
**And** the selected character is remembered
