---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - product-brief-test-bmad-2026-01-29.md
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
projectContext: 'greenfield'
date: 2026-01-29
author: Master
projectName: test-bmad
classification:
  projectType: desktop_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - test-bmad

**Author:** Master  
**Date:** 2026-01-29

## Executive Summary

A cozy, developer-focused Pomodoro desktop application that combines local-first data ownership with delightful minimal aesthetics. Built for macOS and Linux, it lives in your menu bar and helps developers protect their flow state, track deep work hours, and build lasting focus habits.

### Vision

Developers struggle to maintain focus in distraction-heavy environments. Existing Pomodoro apps are either generic consumer tools or sterile productivity software. This app brings cozy UX (cute cats/bears, warm dark theme, coffee vibes) to serious focus enforcement, with file-based storage that respects data ownership.

### Key Differentiators

| Differentiator            | Why It Matters                                    |
| ------------------------- | ------------------------------------------------- |
| **Cozy UX**               | Productivity tool you actually enjoy opening      |
| **Local-first, file-first** | Your data stays yours, plain `.md` files, git-friendly |
| **Developer-focused**     | Built by developers, for developers               |
| **Desktop-native**        | Always accessible in toolbar, not buried in tabs  |

### Target Users

- **Alex (Tech Lead)**: Protects flow state, needs proof of deep work hours
- **Sam (Junior Dev)**: Builds discipline through gamification, fights imposter syndrome with visible progress

## Success Criteria

### User Success

| Metric                        | What It Measures                | Success Indicator                                       |
| ----------------------------- | ------------------------------- | ------------------------------------------------------- |
| **Distraction-free sessions** | App enforces focus time         | Zero social media visits during active pomodoro         |
| **Deep work visibility**      | Users can quantify productivity | Weekly deep work hours displayed (target: 15-20h/week)  |
| **Streak maintenance**        | Habit formation working         | Users maintain 7+ day streaks                           |
| **Blocking proof**            | System actually works           | Blocked distraction attempts logged (v1.1 feature)      |
| **Daily engagement**          | Tool becomes routine            | App used during working hours daily                     |

**Emotional Success Moments:**
- "Aha!" moment: First weekly review showing 20+ hours of real deep work
- Relief: Seeing blocked attempts proves the app saved them from themselves
- Pride: Growing streak counter and unlocked achievements

### Business Success

| Timeframe     | Objective           | Target                                                       |
| ------------- | ------------------- | ------------------------------------------------------------ |
| **Day 1**     | Ship functional MVP | You use it tomorrow morning                                  |
| **1 month**   | Early adoption      | 10+ daily active users, 3+ GitHub issues from external users |
| **3 months**  | Community traction  | 100 GitHub stars, 30-day retention > 40%                     |
| **6 months**  | Contributor growth  | First external PR merged                                     |

### Technical Success

| Metric               | Target                                           |
| -------------------- | ------------------------------------------------ |
| **Data format**      | Plain `.md` files (human-readable, git-friendly) |
| **Reliability**      | Sessions persist across app restarts             |
| **Platform support** | Functional on macOS and Linux                    |

### Measurable Outcomes

- **Session completion rate** > 70%
- **Daily pomodoros** per active user: 4-8
- **Streak retention**: Users who hit 7-day streak continue to 14-day

## Product Scope

### MVP (Phase 1)

| Feature                | Description                                   | Why Essential                            |
| ---------------------- | --------------------------------------------- | ---------------------------------------- |
| **Pomodoro Timer**     | 25min work / 5min break with start/pause/stop | Core value                               |
| **System Tray Icon**   | macOS/Linux toolbar presence                  | Always accessible                        |
| **Session Counter**    | "Sessions completed today"                    | Immediate feedback                       |
| **Cozy UI**            | Dark mode, minimal, cute cat/bear animation   | Differentiator                           |
| **File-based Storage** | Local `.md` files, Obsidian-style             | Data ownership                           |
| **Gamification**       | Streaks and basic achievements                | Habit formation                          |
| **Notifications**      | Session start/end, milestones                 | Awareness                                |

**MVP Philosophy:** "You use it tomorrow morning" - ship fast, iterate based on real usage.

**Resource Requirements:** Solo developer, ~1 day to functional MVP.

### Growth Features (v1.1)

- System-level distraction blocking (apps, websites, notifications)
- Flexible intervals and multiple focus modes (deep work, pairing, learning)
- Weekly/monthly deep work analytics
- Auto-launch on startup

### Vision (v1.2+)

- Git integration (correlate commits with focus sessions)
- Project/task tagging
- IDE plugins (VS Code, JetBrains)
- Mobile companion app
- Theme/character marketplace

### Risk Mitigation

| Risk Type     | Risk                                | Mitigation                                         |
| ------------- | ----------------------------------- | -------------------------------------------------- |
| **Technical** | Cross-platform tray behavior varies | Start with one platform, validate before expanding |
| **Market**    | Crowded Pomodoro space              | Differentiate on cozy UX + local-first philosophy  |
| **Resource**  | Solo dev, limited time              | Ruthless MVP scope - ship tomorrow, iterate later  |

## User Journeys

### Journey 1: Alex - The Tech Lead (Success Path)

**Opening Scene:**
It's 8:47 AM. Alex has just finished tech watch and the daily standup. A meaty refactoring task awaits - the kind that requires 2-3 hours of uninterrupted focus. Alex knows the pattern: open the IDE, then "just quickly check Slack"... and suddenly it's 10:30 AM with nothing shipped.

**Rising Action:**
Alex clicks the cozy cat icon in the menu bar. The warm dark UI opens - a little bear waves. Alex hits "Start Focus" and the 25-minute timer begins. Ten minutes in, muscle memory kicks in - fingers drift toward the browser. But the blocked attempt gets logged. The cat shakes its head disapprovingly. Alex smiles, refocuses.

**Climax:**
Four pomodoros later, the refactoring PR is ready for review. Alex glances at the session counter: "4 sessions today." The streak counter shows "Day 12." There's a quiet pride - objective proof that the morning wasn't wasted on Twitter doom-scrolling.

**Resolution:**
Friday afternoon, Alex opens the weekly view. 18 hours of logged deep work. The client demo went well. The weekend starts guilt-free - the numbers prove the work got done.

### Journey 2: Sam - The Junior Developer (Gamification Path)

**Opening Scene:**
Sam stares at a PR review with 47 comments. Imposter syndrome whispers. The YouTube tab is already open - "just one video to decompress." An hour later, the PR is untouched, guilt is mounting, and it's almost lunch.

**Rising Action:**
Sam remembers the app a senior dev recommended. Downloads it. A cute cat greets them on first launch. "Start your first focus session?" Sure, why not. 25 minutes feels manageable. Sam silences Slack, starts the timer, and tackles the first review comment.

**Climax:**
The timer dings. One comment addressed. The cat celebrates with a little dance. "Session 1 complete! Start streak?" Sam feels... something. Not pride exactly, but a tiny spark. Hits "Start" again. By end of day: 6 sessions, 23 comments addressed, PR approved.

**Resolution:**
Two weeks later, Sam's streak counter shows "14 days." A badge unlocks: "Fortnight Focus." Sam screenshots it, almost posts to Twitter, then laughs - but internally, something shifted. There's evidence now. "I am a real developer. Look at my hours."

### Journey 3: Alex - Edge Case (Interruption Recovery)

**Opening Scene:**
Mid-pomodoro, Alex's phone buzzes. Production incident. The focus session must be abandoned.

**Rising Action:**
Alex clicks "Stop" - the session is marked incomplete. The app doesn't guilt-trip; it just notes "Session interrupted at 14:32." The incident takes 45 minutes to resolve.

**Resolution:**
Alex returns, starts a fresh session. The day's counter shows the partial session separately. The streak isn't broken - Alex completed 4 full sessions earlier. The data is honest: interruptions happen, progress still counts.

### Journey Requirements Summary

| Journey                     | Capabilities Revealed                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Alex - Success Path**     | Timer with start/stop, session counter, streak tracking, weekly view, blocked attempt logging, system tray presence |
| **Sam - Gamification Path** | First-run onboarding, achievement badges, streak celebrations, character animations, progress visualization         |
| **Alex - Edge Case**        | Graceful session interruption, partial session tracking, streak protection logic, honest data recording             |

## Desktop App Requirements

### Platform Support

| Platform    | Support Level | Notes                          |
| ----------- | ------------- | ------------------------------ |
| **macOS**   | Primary       | Menu bar app, native feel      |
| **Linux**   | Primary       | System tray (GNOME, KDE, etc.) |
| **Windows** | Not supported | Out of scope                   |

### System Integration

| Integration            | MVP | Description                                        |
| ---------------------- | --- | -------------------------------------------------- |
| **System Tray Icon**   | Yes | Persistent menu bar/tray presence                  |
| **Notifications**      | Yes | Session start/end, streak milestones, achievements |
| **Auto-launch**        | No  | Deferred to v1.1                                   |
| **Keyboard shortcuts** | No  | Not planned for MVP                                |

### Offline & Data

| Aspect               | Approach                                       |
| -------------------- | ---------------------------------------------- |
| **Data storage**     | 100% local `.md` files                         |
| **Sync**             | None - offline forever                         |
| **Cloud backup**     | User responsibility (git, Dropbox, etc.)       |
| **Data portability** | Plain text files, human-readable, git-friendly |
| **Updates**          | Manual download from GitHub releases           |

### Implementation Considerations

- **Framework**: Cross-platform desktop framework (Electron, Tauri, etc.)
- **Tray API**: Must support both macOS menu bar and Linux system tray
- **Notifications**: Native OS notification APIs
- **File access**: Read/write to user-configurable local directory
- **Minimal footprint**: Lightweight, not resource-heavy

## Functional Requirements

### Timer Core

- **FR1**: User can start a focus session (25-minute pomodoro)
- **FR2**: User can pause an active focus session
- **FR3**: User can stop/cancel an active focus session
- **FR4**: User can see remaining time in the current session
- **FR5**: System automatically transitions to break mode (5 minutes) after focus session completes
- **FR6**: User receives notification when focus session ends
- **FR7**: User receives notification when break ends
- **FR8**: System tracks incomplete/interrupted sessions separately from completed sessions

### Session Tracking & Statistics

- **FR9**: User can view number of completed sessions today
- **FR10**: User can view total focus time for the current day
- **FR11**: System persists all session data to local `.md` files
- **FR12**: Session data survives app restarts
- **FR13**: User can view session history

### Streaks & Gamification

- **FR14**: System tracks consecutive days with at least one completed session (streak)
- **FR15**: User can view current streak count
- **FR16**: System awards achievement badges for milestones (e.g., 7-day streak, 14-day streak)
- **FR17**: User can view earned achievements
- **FR18**: User receives notification when achieving a milestone
- **FR19**: Streak is preserved if user completes at least one session per day

### User Interface & Experience

- **FR20**: App displays in system tray/menu bar
- **FR21**: User can open main window from system tray icon
- **FR22**: User can start/stop sessions directly from system tray menu
- **FR23**: App displays cozy dark-themed UI
- **FR24**: App displays animated character (cat/bear) that responds to session events
- **FR25**: Character celebrates on session completion
- **FR26**: First-time user sees onboarding welcome

### Data & Storage

- **FR27**: All data stored locally in user-accessible `.md` files
- **FR28**: User can configure data storage location
- **FR29**: Data files are human-readable and git-friendly
- **FR30**: App works fully offline with no network dependency

### Platform Integration

- **FR31**: App runs on macOS with menu bar integration
- **FR32**: App runs on Linux with system tray integration
- **FR33**: App sends native OS notifications

## Non-Functional Requirements

### Performance

| Requirement           | Target                    | Rationale                                   |
| --------------------- | ------------------------- | ------------------------------------------- |
| **App startup**       | < 3 seconds               | Should feel instant when clicking tray icon |
| **Timer accuracy**    | ±1 second over 25 minutes | Users trust the timer to be accurate        |
| **UI responsiveness** | < 100ms for user actions  | Buttons, menus feel immediate               |
| **Memory footprint**  | < 200MB idle              | Runs all day without impacting other work   |

### Reliability

| Requirement          | Target                                | Rationale                                 |
| -------------------- | ------------------------------------- | ----------------------------------------- |
| **Data persistence** | Zero data loss on normal exit         | Core promise - sessions always saved      |
| **Crash recovery**   | Graceful recovery, no data corruption | If crash occurs, data remains intact      |
| **Timer continuity** | Timer survives app backgrounding      | Timer keeps running even if window closed |

### Accessibility

| Requirement               | Target                                          | Rationale                                  |
| ------------------------- | ----------------------------------------------- | ------------------------------------------ |
| **Screen reader support** | Compatible with VoiceOver (macOS), Orca (Linux) | Inclusive for visually impaired developers |
| **Keyboard navigation**   | All core functions accessible via keyboard      | Power users expect keyboard control        |
| **Color contrast**        | WCAG AA compliant for text                      | Dark theme still needs readable text       |
| **Focus indicators**      | Visible focus states                            | Clear indication of selected elements      |
