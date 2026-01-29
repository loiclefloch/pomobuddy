---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - prd.md
  - product-brief-test-bmad-2026-01-29.md
  - ux-design-specification.md
workflowType: 'architecture'
project_name: 'test-bmad'
user_name: 'Master'
date: '2026-01-29'
lastStep: 8
status: 'complete'
completedAt: '2026-01-29'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The PRD defines 33 functional requirements across 6 domains:

| Domain               | FR Range  | Key Capabilities                                                                |
| -------------------- | --------- | ------------------------------------------------------------------------------- |
| **Timer Core**           | FR1-FR8   | 25/5 pomodoro cycles, start/pause/stop, auto-transitions, interruption tracking |
| **Session Tracking**     | FR9-FR13  | Daily counts, focus time aggregation, local file persistence, history view      |
| **Gamification**         | FR14-FR19 | Streak tracking, achievement badges, milestone notifications                    |
| **UI/Experience**        | FR20-FR26 | System tray, dark theme, animated characters, onboarding                        |
| **Data & Storage**       | FR27-FR30 | Local `.md` files, configurable location, offline-only, git-friendly              |
| **Platform Integration** | FR31-FR33 | macOS menu bar, Linux system tray, native notifications                         |

**Non-Functional Requirements:**

| Category      | Requirement                  | Architectural Impact                        |
| ------------- | ---------------------------- | ------------------------------------------- |
| **Performance**   | < 3s startup                 | Lightweight framework, lazy loading         |
| **Performance**   | < 200MB memory               | Careful dependency management               |
| **Performance**   | < 100ms UI response          | Optimized rendering, no blocking operations |
| **Reliability**   | Zero data loss               | Atomic file writes, crash recovery          |
| **Reliability**   | Timer survives backgrounding | Process-level timer, not UI-dependent       |
| **Accessibility** | WCAG AA compliance           | Semantic HTML, ARIA, keyboard nav           |
| **Accessibility** | Screen reader support        | VoiceOver (macOS), Orca (Linux)             |

**Scale & Complexity:**

- Primary domain: **Desktop application** (Tauri-based)
- Complexity level: **Medium** - specialized tray integration with bounded scope
- Estimated architectural components: **8-12** (tray, windows, timer, storage, audio, notifications, characters, achievements)

### Technical Constraints & Dependencies

**Platform Constraints:**
- macOS: Menu bar app with native feel
- Linux: System tray (GNOME, KDE compatibility required)
- Windows: Explicitly out of scope

**Technology Constraints (updated from UX spec):**
- Framework: Tauri 2.0 (for cross-platform desktop with native performance)
- UI: shadcn/ui + Tailwind CSS + Radix UI primitives
- Icons: Lucide Icons (MIT license)
- Fonts: Nunito (headings), Inter (body), JetBrains Mono (code)

**Data Constraints:**
- 100% local storage - no cloud, no sync, no network calls
- Human-readable `.md` file format
- User-configurable storage location
- Git-friendly (diffable, mergeable)

### Cross-Cutting Concerns Identified

| Concern              | Affected Components                              | Architectural Approach Needed              |
| -------------------- | ------------------------------------------------ | ------------------------------------------ |
| **Timer State**          | Tray icon, tray menu, main window, notifications | Centralized state management               |
| **File Persistence**     | Sessions, settings, achievements, streaks        | Unified storage layer                      |
| **Platform Abstraction** | Tray, notifications, file paths                  | Platform-specific adapters                 |
| **Accessibility**        | All UI surfaces                                  | Consistent ARIA, keyboard, motion patterns |
| **Character System**     | Tray, windows, celebrations                      | Shared sprite/animation infrastructure     |
| **Audio**                | Focus sessions, celebrations                     | Audio manager with system volume respect   |

## Starter Template Evaluation

### Primary Technology Domain

**Desktop Application (Tray-First)** based on project requirements analysis:
- System tray/menu bar as primary interface
- Local-first, offline-only operation
- Cross-platform (macOS, Linux)
- React-based UI with animations

### Framework Decision: Tauri 2.0 over Electron

**Decision:** Use **Tauri 2.0** instead of originally-specified Electron.

**Rationale:**

| Requirement        | Electron       | Tauri 2.0    | Winner |
| ------------------ | -------------- | ------------ | ------ |
| Memory < 200MB     | 150-300MB (⚠️) | 30-40MB (✅) | Tauri  |
| Startup < 3s       | 2-5s (⚠️)      | < 1s (✅)    | Tauri  |
| Bundle Size        | 150-200MB      | 4-12MB       | Tauri  |
| System Tray        | ✅             | ✅ (v2.0)    | Tie    |
| React + TypeScript | ✅             | ✅           | Tie    |
| shadcn/ui          | ✅             | ✅           | Tie    |

Tauri 2.0 (released October 2024) provides full system tray support, the same web frontend stack, and dramatically better performance characteristics that easily meet all NFRs.

**Trade-off Acknowledged:** Backend logic requires Rust instead of Node.js. For this app's simple timer/storage needs, this is acceptable and provides better reliability.

### Starter Options Considered

| Starter              | Description                        | Status       |
| -------------------- | ---------------------------------- | ------------ |
| `npm create tauri-app` | Official Tauri CLI with React + TS | ✅ Selected  |
| `electron-vite`        | Electron + Vite + React            | ❌ Rejected  |
| `jbolda/personal-tray` | Community tray-focused Tauri       | ❌ Too niche |

### Selected Starter: Tauri Official (React + TypeScript)

**Initialization Command:**

```bash
npm create tauri-app@latest test-bmad -- --template react-ts
cd test-bmad
npm install
```

**Post-initialization Setup:**

```bash
# Add Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# Add shadcn/ui
npx shadcn@latest init

# Add Lucide icons
npm install lucide-react
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- Frontend: TypeScript + React 19
- Backend: Rust (Tauri core)
- Build: Vite 6.x with HMR

**Project Structure:**
```
test-bmad/
├── src/                    # React frontend
│   ├── components/
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs         # Entry point
│   │   └── lib.rs          # Commands/state
│   ├── Cargo.toml
│   └── tauri.conf.json     # App configuration
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**Development Experience:**
- Hot Module Replacement (HMR) for frontend
- Rust recompilation on backend changes
- TypeScript strict mode enabled
- Vite dev server with proxy to Tauri

**Platform Integration (Tauri 2.0 features):**
- System tray via `tauri-plugin-tray`
- Native notifications via `tauri-plugin-notification`
- File system access via `tauri-plugin-fs`
- Persistent storage via `tauri-plugin-store`

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- ✅ Framework: Tauri 2.0 (decided in Step 3)
- ✅ State Management: Hybrid Tauri backend + Zustand
- ✅ Data Storage: Daily `.md` files with configurable location
- ✅ Component Organization: Feature-based structure
- ✅ Window Architecture: Multi-window (tray, main, settings as separate Tauri windows)

**Important Decisions (Shape Architecture):**
- ✅ CI/CD: GitHub Actions with Tauri official action
- ✅ Distribution: GitHub Releases (DMG, AppImage, deb)

**Not Applicable (Local-first app):**
- ❌ Database - Using local `.md` files
- ❌ Authentication - Single-user, no accounts
- ❌ API Design - No external APIs
- ❌ Cloud Hosting - Desktop app
- ❌ Scaling - Single-user local app

### Data Architecture

**Storage Location:**
- Default: Platform app data directory (`~/Library/Application Support/test-bmad/` on macOS)
- Configurable: User can change via settings (FR28)
- Structure: `{storage_path}/sessions/`, `{storage_path}/settings.json`, `{storage_path}/achievements.json`

**Session File Format (Daily Files):**
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

**State Management Architecture:**

| State Type   | Location       | Technology         | Rationale                       |
| ------------ | -------------- | ------------------ | ------------------------------- |
| Timer state  | Rust backend   | Tauri managed      | Survives window close, reliable |
| Session data | Rust backend   | File I/O           | Atomic writes, crash recovery   |
| UI state     | React frontend | Zustand 5.0.10     | Component state, preferences    |
| Settings     | Rust backend   | tauri-plugin-store | Persistent, type-safe           |

**State Synchronization:**
```
┌─────────────────┐     IPC Events      ┌──────────────────┐
│  Rust Backend   │◄──────────────────►│  React Frontend  │
│                 │                     │                  │
│ • Timer logic   │  timer:tick         │ • TimerRing      │
│ • File I/O      │  timer:complete     │ • TrayMenu       │
│ • Settings      │  session:saved      │ • StatsView      │
│ • Achievements  │  achievement:unlock │ • Celebrations   │
└─────────────────┘                     └──────────────────┘
```

### Frontend Architecture

**Component Organization (Feature-Based):**
```
src/
├── features/
│   ├── timer/
│   │   ├── components/     # TimerRing, TimerControls
│   │   ├── hooks/          # useTimer, useTimerState
│   │   └── stores/         # timerStore.ts
│   ├── stats/
│   │   ├── components/     # StatsCard, WeeklyChart
│   │   └── hooks/          # useStats, useWeeklyData
│   ├── achievements/
│   │   ├── components/     # AchievementBadge, CelebrationOverlay
│   │   └── stores/         # achievementsStore.ts
│   ├── character/
│   │   ├── components/     # CharacterSprite, CharacterSelector
│   │   └── assets/         # Sprite sheets
│   └── settings/
│       ├── components/     # SettingsForm
│       └── stores/         # settingsStore.ts
├── shared/
│   ├── components/         # Button, Card (shadcn customized)
│   ├── hooks/              # useIPC, usePlatform
│   └── lib/                # utils, constants
├── windows/
│   ├── tray/               # TrayMenu entry point
│   ├── main/               # Main window entry point
│   └── settings/           # Settings window entry point
└── styles/
    └── globals.css         # Tailwind + cozy theme
```

**Multi-Window Architecture:**

| Window   | Entry Point       | Size        | Purpose             |
| -------- | ----------------- | ----------- | ------------------- |
| Tray     | `windows/tray/`     | 280px fixed | Primary interface   |
| Main     | `windows/main/`     | 600-1200px  | Stats, achievements |
| Settings | `windows/settings/` | 400x500px   | User preferences    |

**Tauri Window Configuration:**
```json
{
  "windows": [
    { "label": "tray", "visible": false, "width": 280, "height": 400 },
    { "label": "main", "title": "test-bmad", "width": 800, "height": 600 },
    { "label": "settings", "title": "Settings", "width": 400, "height": 500 }
  ]
}
```

### Infrastructure & Deployment

**CI/CD Pipeline: GitHub Actions**

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags: ['v*']
jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, ubuntu-22.04]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - uses: tauri-apps/tauri-action@v0
        with:
          tagName: ${{ github.ref_name }}
          releaseName: 'test-bmad v__VERSION__'
          releaseBody: 'See CHANGELOG.md for details'
          releaseDraft: true
```

**Release Artifacts:**

| Platform | Format   | File                           |
| -------- | -------- | ------------------------------ |
| macOS    | DMG      | `test-bmad_x.x.x_aarch64.dmg`    |
| macOS    | DMG      | `test-bmad_x.x.x_x64.dmg`        |
| Linux    | AppImage | `test-bmad_x.x.x_amd64.AppImage` |
| Linux    | deb      | `test-bmad_x.x.x_amd64.deb`      |

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization (Tauri + React + TypeScript)
2. Tailwind + shadcn/ui setup
3. Multi-window structure
4. Rust backend state management
5. Zustand frontend stores
6. Feature modules (timer → stats → achievements)
7. GitHub Actions CI/CD

**Cross-Component Dependencies:**

| Decision                | Affects                             |
| ----------------------- | ----------------------------------- |
| Tauri backend timer     | All UI components subscribe via IPC |
| Daily file format       | Stats aggregation, history views    |
| Multi-window            | State sync via Tauri events         |
| Feature-based structure | Import paths, code splitting        |
| Zustand stores          | React component organization        |

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 8 areas where AI agents could make different choices, all now standardized.

**Not Applicable for This Project:**
- Database naming (no database)
- API endpoint naming (no external APIs)
- REST response formats (no REST)

### Naming Patterns

**Tauri IPC Naming:**

| Type           | Convention            | Example                                         |
| -------------- | --------------------- | ----------------------------------------------- |
| Commands       | `camelCase`             | `getTimerState`, `saveSession`, `startTimer`          |
| Events         | `PascalCase`            | `TimerTick`, `SessionComplete`, `AchievementUnlocked` |
| Event Payloads | TypeScript interfaces | `TimerTickPayload`, `SessionData`                   |

```rust
// Rust command (callable from JS)
#[tauri::command]
fn getTimerState() -> TimerState { ... }

// Rust event emission
app.emit("TimerTick", TimerTickPayload { remaining: 300 });
```

```typescript
// TypeScript event listening
listen<TimerTickPayload>("TimerTick", (event) => { ... });
```

**File Naming:**

| File Type        | Convention     | Example                         |
| ---------------- | -------------- | ------------------------------- |
| React Components | `PascalCase.tsx` | `TimerRing.tsx`, `StatsCard.tsx`    |
| Hooks            | `camelCase.ts`   | `useTimer.ts`, `useIPC.ts`          |
| Stores           | `camelCase.ts`   | `timerStore.ts`, `settingsStore.ts` |
| Utils            | `camelCase.ts`   | `formatTime.ts`, `dateUtils.ts`     |
| Tests            | `*.test.tsx`     | `TimerRing.test.tsx` (co-located) |
| Types            | `camelCase.ts`   | `types.ts`, `timerTypes.ts`         |

**Code Naming:**

| Element          | Convention        | Example                                |
| ---------------- | ----------------- | -------------------------------------- |
| Components       | `PascalCase`        | `TimerRing`, `CharacterSprite`             |
| Hooks            | `useCamelCase`      | `useTimer`, `useTimerState`                |
| Zustand Stores   | `use{Feature}Store` | `useTimerStore`, `useSettingsStore`        |
| Functions        | `camelCase`         | `formatDuration`, `calculateStreak`        |
| Constants        | `SCREAMING_SNAKE`   | `DEFAULT_FOCUS_DURATION`, `BREAK_DURATION` |
| Types/Interfaces | `PascalCase`        | `TimerState`, `SessionData`                |

### Structure Patterns

**Test Organization: Co-located**
```
src/features/timer/
├── components/
│   ├── TimerRing.tsx
│   ├── TimerRing.test.tsx      # Test next to component
│   ├── TimerControls.tsx
│   └── TimerControls.test.tsx
├── hooks/
│   ├── useTimer.ts
│   └── useTimer.test.ts
└── stores/
    ├── timerStore.ts
    └── timerStore.test.ts
```

**Import Order (enforced by ESLint):**
1. React imports
2. Third-party imports (tauri, zustand, lucide)
3. Shared imports (`@/shared/...`)
4. Feature imports (`@/features/...`)
5. Relative imports (`./...`)
6. Type imports

### Format Patterns

**Data File Formats:**

Session files (`.md`):
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

Settings (`settings.json`):
```json
{
  "focusDuration": 1500,
  "breakDuration": 300,
  "character": "koala",
  "audioEnabled": true,
  "storagePath": null
}
```

Achievements (`achievements.json`):
```json
{
  "unlocked": [
    { "id": "first_session", "unlockedAt": "2026-01-29T09:45:00Z" },
    { "id": "streak_7", "unlockedAt": "2026-02-04T14:30:00Z" }
  ],
  "currentStreak": 7,
  "longestStreak": 7,
  "totalSessions": 42
}
```

### Communication Patterns

**Tauri Event Flow:**
```
┌─────────────────────────────────────────────────────────────┐
│                     Event Naming Convention                  │
├─────────────────────────────────────────────────────────────┤
│  Rust Backend                    React Frontend             │
│  ─────────────                   ──────────────             │
│  emit("TimerTick", payload)  →   listen("TimerTick", cb)    │
│  emit("SessionComplete", d)  →   listen("SessionComplete")  │
│  emit("AchievementUnlocked") →   listen("AchievementUnlocked") │
└─────────────────────────────────────────────────────────────┘
```

**State Management Patterns:**

Zustand store structure:
```typescript
// timerStore.ts
interface TimerState {
  // State
  status: 'idle' | 'focus' | 'break' | 'paused';
  remainingSeconds: number;
  
  // Derived (computed in selectors, not stored)
  // progress, formattedTime, etc.
  
  // Actions
  setStatus: (status: TimerState['status']) => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  status: 'idle',
  remainingSeconds: 0,
  setStatus: (status) => set({ status }),
  tick: () => set((state) => ({ remainingSeconds: state.remainingSeconds - 1 })),
}));
```

### Process Patterns

**Error Handling: Boundaries + Toasts**

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Handling Flow                       │
├─────────────────────────────────────────────────────────────┤
│  Rust Backend           IPC              React Frontend      │
│  ────────────           ───              ──────────────      │
│  Result<T, E>     →     Error event  →   Error Boundary      │
│                                          ↓                   │
│                                          Toast notification  │
│                                          (user-friendly msg) │
└─────────────────────────────────────────────────────────────┘
```

Rust errors:
```rust
#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error("Failed to save session: {0}")]
    SaveError(String),
    #[error("Invalid timer state")]
    InvalidState,
}
```

React error boundary:
```typescript
// Wrap each window's root
<ErrorBoundary fallback={<ErrorFallback />}>
  <TrayMenu />
</ErrorBoundary>
```

Toast for recoverable errors:
```typescript
// Using sonner or similar
toast.error("Couldn't save session. Retrying...");
```

**Loading State Pattern:**

```typescript
// In Zustand stores
interface AsyncState {
  isLoading: boolean;
  error: string | null;
}

// Component usage
const { isLoading } = useStatsStore();
if (isLoading) return <Skeleton />;
```

### Styling Patterns

**Tailwind Class Order:**
```
layout → spacing → sizing → typography → colors → effects → states
```

Example:
```tsx
<div className="
  flex items-center justify-between     {/* layout */}
  p-4 gap-2                              {/* spacing */}
  w-full h-12                            {/* sizing */}
  text-sm font-medium                    {/* typography */}
  bg-cozy-surface text-cozy-text         {/* colors */}
  rounded-xl shadow-soft                 {/* effects */}
  hover:bg-cozy-elevated                 {/* states */}
">
```

**Component Variants with CVA:**
```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-cozy-accent text-white hover:bg-cozy-accent/90",
        secondary: "bg-cozy-surface text-cozy-accent border border-cozy-border",
        ghost: "hover:bg-cozy-surface",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Follow naming conventions exactly** - No mixing camelCase/snake_case
2. **Co-locate tests** - Test files next to source files
3. **Use CVA for variants** - Not inline conditionals
4. **Use Zustand naming** - `use{Feature}Store` pattern
5. **Handle errors via boundaries** - Not try-catch in components
6. **Order Tailwind classes** - Layout → spacing → typography → colors → effects

**Pattern Verification:**
- ESLint rules enforce import order and naming
- TypeScript strict mode catches type mismatches
- PR reviews check pattern compliance

### Anti-Patterns to Avoid

| Anti-Pattern               | Correct Pattern        |
| -------------------------- | ---------------------- |
| `timer_store.ts`             | `timerStore.ts`          |
| `timer-ring.tsx`             | `TimerRing.tsx`          |
| `__tests__/` folder          | Co-located `*.test.tsx`  |
| `timerStore` (no use prefix) | `useTimerStore`          |
| `timer:tick` events          | `TimerTick` events       |
| `get_timer_state` commands   | `getTimerState` commands |
| Inline class conditionals  | CVA variants           |
| Try-catch in components    | Error boundaries       |

## Project Structure & Boundaries

### Complete Project Directory Structure

```
test-bmad/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # PR checks (lint, type-check, test)
│       └── release.yml               # Build & publish to GitHub Releases
├── .vscode/
│   ├── extensions.json               # Recommended extensions
│   └── settings.json                 # Workspace settings
├── public/
│   └── assets/
│       ├── icons/
│       │   ├── icon.icns             # macOS app icon
│       │   ├── icon.png              # Linux app icon
│       │   └── tray/
│       │       ├── tray-idle.png     # Tray icon states
│       │       ├── tray-focus.png
│       │       └── tray-break.png
│       ├── audio/
│       │   ├── session-complete.mp3
│       │   ├── break-complete.mp3
│       │   └── celebration.mp3
│       └── fonts/
│           ├── Nunito-*.woff2
│           ├── Inter-*.woff2
│           └── JetBrainsMono-*.woff2
├── src/
│   ├── features/
│   │   ├── timer/
│   │   │   ├── components/
│   │   │   │   ├── TimerRing.tsx
│   │   │   │   ├── TimerRing.test.tsx
│   │   │   │   ├── TimerControls.tsx
│   │   │   │   └── TimerControls.test.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useTimer.ts
│   │   │   │   └── useTimer.test.ts
│   │   │   ├── stores/
│   │   │   │   ├── timerStore.ts
│   │   │   │   └── timerStore.test.ts
│   │   │   └── types.ts
│   │   ├── stats/
│   │   │   ├── components/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── StatsCard.test.tsx
│   │   │   │   ├── WeeklyBarChart.tsx
│   │   │   │   └── WeeklyBarChart.test.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useStats.ts
│   │   │   │   └── useWeeklyData.ts
│   │   │   └── types.ts
│   │   ├── achievements/
│   │   │   ├── components/
│   │   │   │   ├── AchievementBadge.tsx
│   │   │   │   ├── AchievementBadge.test.tsx
│   │   │   │   ├── CelebrationOverlay.tsx
│   │   │   │   ├── CelebrationOverlay.test.tsx
│   │   │   │   └── ParticleSystem.tsx
│   │   │   ├── stores/
│   │   │   │   └── achievementsStore.ts
│   │   │   └── types.ts
│   │   ├── character/
│   │   │   ├── components/
│   │   │   │   ├── CharacterSprite.tsx
│   │   │   │   ├── CharacterSprite.test.tsx
│   │   │   │   └── CharacterSelector.tsx
│   │   │   ├── assets/
│   │   │   │   ├── cat/
│   │   │   │   │   ├── idle.png
│   │   │   │   │   ├── focus.png
│   │   │   │   │   ├── break.png
│   │   │   │   │   ├── celebrate.png
│   │   │   │   │   └── dance.png
│   │   │   │   ├── cow/
│   │   │   │   ├── polarBear/
│   │   │   │   ├── koala/
│   │   │   │   └── platypus/
│   │   │   └── types.ts
│   │   ├── settings/
│   │   │   ├── components/
│   │   │   │   ├── SettingsForm.tsx
│   │   │   │   └── SettingsForm.test.tsx
│   │   │   ├── stores/
│   │   │   │   └── settingsStore.ts
│   │   │   └── types.ts
│   │   └── onboarding/
│   │       ├── components/
│   │       │   ├── OnboardingFlow.tsx
│   │       │   └── WelcomeScreen.tsx
│   │       └── types.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components (customized)
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── DropdownMenu.tsx
│   │   │   │   ├── Separator.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── Toast.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ErrorFallback.tsx
│   │   ├── hooks/
│   │   │   ├── useIPC.ts             # Tauri IPC wrapper
│   │   │   ├── useIPC.test.ts
│   │   │   ├── usePlatform.ts        # Platform detection
│   │   │   └── useReducedMotion.ts   # Accessibility
│   │   ├── lib/
│   │   │   ├── utils.ts              # cn() and helpers
│   │   │   ├── constants.ts          # App-wide constants
│   │   │   ├── formatTime.ts
│   │   │   └── dateUtils.ts
│   │   └── types/
│   │       ├── tauri.d.ts            # Tauri type extensions
│   │       └── global.d.ts
│   ├── windows/
│   │   ├── tray/
│   │   │   ├── index.html            # Tray window entry
│   │   │   ├── main.tsx              # React mount for tray
│   │   │   └── TrayMenu.tsx          # Tray menu component
│   │   ├── main/
│   │   │   ├── index.html            # Main window entry
│   │   │   ├── main.tsx              # React mount for main
│   │   │   └── MainWindow.tsx        # Main window component
│   │   └── settings/
│   │       ├── index.html            # Settings window entry
│   │       ├── main.tsx              # React mount for settings
│   │       └── SettingsWindow.tsx    # Settings window component
│   └── styles/
│       └── globals.css               # Tailwind + cozy theme tokens
├── src-tauri/
│   ├── src/
│   │   ├── main.rs                   # Tauri entry point
│   │   ├── lib.rs                    # Module exports
│   │   ├── commands/
│   │   │   ├── mod.rs
│   │   │   ├── timer.rs              # Timer commands
│   │   │   ├── session.rs            # Session management
│   │   │   ├── settings.rs           # Settings commands
│   │   │   └── achievements.rs       # Achievement commands
│   │   ├── state/
│   │   │   ├── mod.rs
│   │   │   ├── timer_state.rs        # Timer state management
│   │   │   └── app_state.rs          # Global app state
│   │   ├── storage/
│   │   │   ├── mod.rs
│   │   │   ├── sessions.rs           # Session file I/O
│   │   │   ├── settings.rs           # Settings persistence
│   │   │   └── achievements.rs       # Achievement persistence
│   │   ├── events.rs                 # Event definitions
│   │   └── error.rs                  # Error types
│   ├── Cargo.toml
│   ├── tauri.conf.json               # Tauri configuration
│   ├── capabilities/
│   │   └── default.json              # Permission capabilities
│   └── icons/
│       ├── icon.icns
│       ├── icon.ico
│       └── icon.png
├── .env.example                      # Environment template
├── .eslintrc.cjs                     # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── components.json                   # shadcn/ui configuration
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts                  # Test configuration
├── CHANGELOG.md
├── LICENSE
└── README.md
```

### Architectural Boundaries

**IPC Boundaries (Rust ↔ React):**

| Boundary      | Direction    | Pattern                               |
| ------------- | ------------ | ------------------------------------- |
| Commands      | React → Rust | `invoke("commandName", { args })`       |
| Events        | Rust → React | `emit("EventName", payload)` / `listen()` |
| State queries | React → Rust | Commands return current state         |
| State updates | Rust → React | Events push state changes             |

**Window Boundaries:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        Rust Backend                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Timer State │  │  Storage    │  │ Achievements│              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          │ Events (IPC)                          │
├──────────────────────────┼──────────────────────────────────────┤
│         ┌────────────────┼────────────────┐                      │
│         ▼                ▼                ▼                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Tray Window │  │ Main Window │  │Settings Win │              │
│  │ (280px)     │  │ (800x600)   │  │ (400x500)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                │                │                      │
│         └───────► Zustand Stores ◄────────┘                      │
│                   (UI state sync)                                │
└─────────────────────────────────────────────────────────────────┘
```

**Data Boundaries:**

| Data Type    | Storage Location                  | Format    |
| ------------ | --------------------------------- | --------- |
| Sessions     | `{data_dir}/sessions/YYYY-MM-DD.md` | Markdown  |
| Settings     | `{data_dir}/settings.json`          | JSON      |
| Achievements | `{data_dir}/achievements.json`      | JSON      |
| App state    | Memory (Rust `Mutex<AppState>`)     | In-memory |

### Requirements to Structure Mapping

**FR Domain → Directory Mapping:**

| FR Domain                      | Frontend Location                                 | Backend Location                       |
| ------------------------------ | ------------------------------------------------- | -------------------------------------- |
| **Timer Core (FR1-8)**             | `src/features/timer/`                               | `src-tauri/src/commands/timer.rs`        |
| **Session Tracking (FR9-13)**      | `src/features/stats/`                               | `src-tauri/src/storage/sessions.rs`      |
| **Gamification (FR14-19)**         | `src/features/achievements/`                        | `src-tauri/src/commands/achievements.rs` |
| **UI/Experience (FR20-26)**        | `src/features/character/`, `src/features/onboarding/` | —                                      |
| **Data & Storage (FR27-30)**       | —                                                 | `src-tauri/src/storage/`                 |
| **Platform Integration (FR31-33)** | `src/windows/tray/`                                 | `src-tauri/src/main.rs` (tray setup)     |

**Cross-Cutting Concerns:**

| Concern           | Location                                                        |
| ----------------- | --------------------------------------------------------------- |
| Error handling    | `src/shared/components/ErrorBoundary.tsx`, `src-tauri/src/error.rs` |
| IPC communication | `src/shared/hooks/useIPC.ts`, `src-tauri/src/events.rs`             |
| Styling/theming   | `src/styles/globals.css`, `tailwind.config.ts`                      |
| Accessibility     | `src/shared/hooks/useReducedMotion.ts`, component ARIA props      |

### Integration Points

**Internal Communication (Frontend):**
```typescript
// Feature → Shared (allowed)
import { Button } from "@/shared/components/ui/Button";
import { useIPC } from "@/shared/hooks/useIPC";

// Feature → Feature (discouraged, use events)
// ❌ import { useTimerStore } from "@/features/timer/stores/timerStore";
// ✅ Listen to Tauri events instead

// Window → Features (allowed)
import { TrayMenu } from "@/features/timer/components/TrayMenu";
```

**Internal Communication (Backend):**
```rust
// Commands use state and storage
use crate::state::timer_state::TimerState;
use crate::storage::sessions::save_session;

// Events emitted from state changes
app_handle.emit("TimerTick", payload)?;
```

**Data Flow:**
```
User Action (React)
    │
    ▼
invoke("startTimer") ──────► Rust Command
                                 │
                                 ▼
                          Update TimerState
                                 │
                                 ▼
                          emit("TimerTick") ──────► React Listener
                                                        │
                                                        ▼
                                                  Update Zustand
                                                        │
                                                        ▼
                                                  Re-render UI
```

### File Organization Patterns

**Configuration Files:**

| File               | Purpose                            |
| ------------------ | ---------------------------------- |
| `tauri.conf.json`    | Tauri app config, windows, plugins |
| `vite.config.ts`     | Vite build, multi-entry points     |
| `tailwind.config.ts` | Tailwind + cozy theme              |
| `components.json`    | shadcn/ui paths, style             |
| `tsconfig.json`      | TypeScript strict mode             |
| `vitest.config.ts`   | Test runner config                 |

**Multi-Entry Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        tray: resolve(__dirname, 'src/windows/tray/index.html'),
        main: resolve(__dirname, 'src/windows/main/index.html'),
        settings: resolve(__dirname, 'src/windows/settings/index.html'),
      },
    },
  },
});
```

**Asset Organization:**

| Asset Type        | Location                       | Used By              |
| ----------------- | ------------------------------ | -------------------- |
| App icons         | `public/assets/icons/`           | Tauri build          |
| Tray icons        | `public/assets/icons/tray/`      | Tray icon states     |
| Audio             | `public/assets/audio/`           | Celebrations, chimes |
| Fonts             | `public/assets/fonts/`           | Custom fonts         |
| Character sprites | `src/features/character/assets/` | CharacterSprite      |

### Development Workflow Integration

**Development Server:**
```bash
# Start Tauri dev (frontend + backend hot reload)
npm run tauri dev
```

**Build Process:**
```bash
# Build for current platform
npm run tauri build

# Build outputs:
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/appimage/, deb/
```

**Test Workflow:**
```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific feature tests
npm run test -- --filter timer
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are compatible and work together seamlessly:
- Tauri 2.0 + React 19 + TypeScript (official template)
- Zustand 5.0.10 works in Tauri webview context
- shadcn/ui + Tailwind CSS v4 + Radix UI (standard stack)
- Multi-window architecture + Rust backend state (IPC sync)

**Pattern Consistency:**
All patterns align with technology choices:
- camelCase commands match TypeScript/JavaScript conventions
- PascalCase events match React component naming patterns
- Feature-based structure supports the chosen organization
- CVA variants align with shadcn/ui patterns

**Structure Alignment:**
Project structure fully supports architectural decisions:
- `src/features/` enables feature-based organization
- `src/windows/` supports multi-window architecture
- `src-tauri/` structure aligns with Rust/Tauri conventions
- Clear separation between frontend and backend concerns

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| FR Domain              | Coverage | Key Components                      |
| ---------------------- | -------- | ----------------------------------- |
| Timer Core (FR1-8)     | 100%     | timer_state.rs, TimerRing, events   |
| Session (FR9-13)       | 100%     | sessions.rs, StatsCard, daily files |
| Gamification (FR14-19) | 100%     | achievements.rs, CelebrationOverlay |
| UI/UX (FR20-26)        | 100%     | CharacterSprite, Onboarding, shadcn |
| Storage (FR27-30)      | 100%     | storage/ module, configurable paths |
| Platform (FR31-33)     | 100%     | Tauri tray/notification plugins     |

**Non-Functional Requirements Coverage:**

| NFR           | Target     | Architecture Delivers | Status |
| ------------- | ---------- | --------------------- | ------ |
| Startup       | < 3s       | < 1s (Tauri)          | ✅     |
| Memory        | < 200MB    | 30-40MB (Tauri)       | ✅     |
| UI Response   | < 100ms    | < 50ms (React + Vite) | ✅     |
| Data Safety   | Zero loss  | Atomic Rust writes    | ✅     |
| Timer Persist | Background | Rust backend timer    | ✅     |
| Accessibility | WCAG AA    | shadcn + ARIA         | ✅     |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical decisions documented with specific versions
- Technology stack fully specified with initialization commands
- Integration patterns defined with code examples
- Performance considerations addressed by framework choice

**Structure Completeness:**
- Complete directory structure with ~80 files/folders
- All feature modules defined with component breakdown
- All window entry points specified
- Rust backend module structure complete

**Pattern Completeness:**
- Naming conventions for all code elements
- File organization patterns documented
- IPC communication patterns with examples
- Error handling flow fully specified
- Styling patterns with CVA examples

### Gap Analysis Results

**Critical Gaps:** None ✅

**Important Gaps (Documented, enhancement opportunities):**

| Gap                   | Impact | Mitigation                                |
| --------------------- | ------ | ----------------------------------------- |
| Audio library choice  | Low    | Web Audio API sufficient, document later  |
| Sprite animation tech | Low    | CSS animations default, enhance if needed |
| Tray icon generation  | Low    | Static icons sufficient for MVP           |

**Nice-to-Have (Post-MVP):**
- Storybook for component development
- E2E testing with Playwright
- Performance monitoring setup

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium)
- [x] Technical constraints identified (macOS/Linux, local-only)
- [x] Cross-cutting concerns mapped (6 identified)

**✅ Architectural Decisions**
- [x] Framework: Tauri 2.0 (with Electron comparison)
- [x] State: Hybrid Rust backend + Zustand frontend
- [x] Storage: Daily `.md` files with configurable location
- [x] Structure: Feature-based with multi-window
- [x] CI/CD: GitHub Actions with Tauri action

**✅ Implementation Patterns**
- [x] Naming conventions (8 categories defined)
- [x] Structure patterns (co-located tests, import order)
- [x] Communication patterns (IPC events, Zustand stores)
- [x] Process patterns (error boundaries, loading states)

**✅ Project Structure**
- [x] Complete directory structure (~80 items)
- [x] Component boundaries established
- [x] Integration points mapped (IPC, windows, data)
- [x] FR → directory mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
1. Tauri 2.0 exceeds all performance NFRs with margin
2. Clear separation between Rust backend (reliability) and React frontend (UX)
3. Comprehensive naming/pattern conventions prevent AI agent conflicts
4. Feature-based structure scales well for the bounded scope
5. Multi-window architecture properly addresses tray-first UX

**Areas for Future Enhancement:**
1. Audio playback library selection (Web Audio API sufficient for now)
2. Sprite animation optimization (CSS animations as baseline)
3. E2E testing infrastructure (Playwright post-MVP)
4. Storybook for component development isolation

### Implementation Handoff

**AI Agent Guidelines:**

1. **Follow all architectural decisions exactly as documented**
   - Use Tauri 2.0, not Electron
   - Use Zustand for frontend state, not Redux/Context
   - Use CVA for variants, not inline conditionals

2. **Use implementation patterns consistently**
   - Commands: camelCase (`getTimerState`)
   - Events: PascalCase (`TimerTick`)
   - Stores: `use{Feature}Store` pattern
   - Tests: Co-located (`*.test.tsx`)

3. **Respect project structure and boundaries**
   - Features import from shared, not from each other
   - Windows import from features
   - Rust commands in `src-tauri/src/commands/`

4. **Refer to this document for all architectural questions**

**First Implementation Priority:**

```bash
# 1. Initialize project
npm create tauri-app@latest test-bmad -- --template react-ts
cd test-bmad

# 2. Add dependencies
npm install zustand lucide-react class-variance-authority clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/vite

# 3. Initialize shadcn/ui
npx shadcn@latest init

# 4. Create feature directory structure
# (as defined in Project Structure section)
```

