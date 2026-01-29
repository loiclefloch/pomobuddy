# Story 2.2: Create Tray Menu with Timer Ring Display

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see my timer progress in a circular ring when I click the tray icon,
So that I can quickly check my session progress without opening a window.

## Acceptance Criteria

1. **Given** the tray icon from Story 2.1
   **When** I configure multi-window support in `tauri.conf.json`
   **Then** a tray window is configured with label `tray`, width 280px, initially hidden
   **And** the tray window has no decorations (frameless)
   **And** the tray window is configured to appear below/near the tray icon when activated

2. **Given** the tray window is configured
   **When** I create the tray window entry point at `src/windows/tray/`
   **Then** `index.html`, `main.tsx`, and `TrayMenu.tsx` files exist
   **And** the entry point is registered in `vite.config.ts` as a multi-entry build

3. **Given** the tray window exists
   **When** I create the `TimerRing` component in `src/features/timer/components/TimerRing.tsx`
   **Then** the component renders a circular SVG progress ring
   **And** the ring has diameter of 120px
   **And** the ring stroke width is 8px
   **And** the progress color uses `cozy-accent` (#E8A598) for focus mode
   **And** the progress color uses `cozy-success` (#A8C5A0) for break mode
   **And** the track color uses `cozy-border` (#4A4240)
   **And** the ring fills clockwise as the session progresses

4. **Given** the TimerRing component exists
   **When** I view the tray menu during an active session
   **Then** the remaining time is displayed in MM:SS format centered in the ring
   **And** the progress percentage accurately reflects remaining time
   **And** the ring animation is smooth (CSS transitions)

5. **Given** the timer is idle
   **When** I view the tray menu
   **Then** the ring is empty/unfilled
   **And** the center displays "Start" or a play icon

## Tasks / Subtasks

- [ ] Task 1: Configure Multi-Window Architecture in Tauri (AC: #1)
  - [ ] 1.1: Update `src-tauri/tauri.conf.json` to add tray window configuration
    - Label: `tray`
    - Width: 280
    - Height: 400 (initial, can grow)
    - Visible: false (hidden by default)
    - Decorations: false (frameless)
    - AlwaysOnTop: true
    - SkipTaskbar: true
  - [ ] 1.2: Add window positioning logic in `src-tauri/src/tray.rs` to position near tray icon
  - [ ] 1.3: Modify tray click handler to show/hide tray window at correct position (macOS)
  - [ ] 1.4: Ensure window can be dismissed by clicking outside or pressing Escape

- [ ] Task 2: Set Up Multi-Entry Vite Build (AC: #2)
  - [ ] 2.1: Create `src/windows/tray/` directory structure
  - [ ] 2.2: Create `src/windows/tray/index.html` - HTML entry point for tray window
  - [ ] 2.3: Create `src/windows/tray/main.tsx` - React mount point for tray
  - [ ] 2.4: Create `src/windows/tray/TrayMenu.tsx` - Main tray menu component
  - [ ] 2.5: Update `vite.config.ts` to add tray as multi-entry input:
    ```typescript
    input: {
      main: 'src/windows/main/index.html',
      tray: 'src/windows/tray/index.html',
    }
    ```
  - [ ] 2.6: Verify `npm run tauri dev` builds both entry points successfully

- [ ] Task 3: Create TimerRing Component (AC: #3, #4, #5)
  - [ ] 3.1: Create `src/features/timer/components/TimerRing.tsx`
  - [ ] 3.2: Implement SVG circular progress ring with configurable props:
    - `diameter`: number (default 120)
    - `strokeWidth`: number (default 8)
    - `progress`: number (0-100)
    - `status`: 'idle' | 'focus' | 'break' | 'paused'
  - [ ] 3.3: Use cozy theme colors:
    - Track: `cozy-border` (#4A4240)
    - Focus progress: `cozy-accent` (#E8A598)
    - Break progress: `cozy-success` (#A8C5A0)
  - [ ] 3.4: Add clockwise fill animation (SVG stroke-dasharray/stroke-dashoffset)
  - [ ] 3.5: Add smooth CSS transitions for progress updates
  - [ ] 3.6: Center display: MM:SS when active, "Start" or Play icon when idle

- [ ] Task 4: Create TimerRing Test File (AC: #3)
  - [ ] 4.1: Create `src/features/timer/components/TimerRing.test.tsx`
  - [ ] 4.2: Test rendering with different progress values (0, 50, 100)
  - [ ] 4.3: Test color changes based on status (focus vs break)
  - [ ] 4.4: Test time display formatting (MM:SS)

- [ ] Task 5: Integrate TimerRing into TrayMenu (AC: #4, #5)
  - [ ] 5.1: Import and use TimerRing in TrayMenu.tsx
  - [ ] 5.2: Connect to `useTimerStore` for timer state
  - [ ] 5.3: Listen to Tauri `TimerTick` events to update progress
  - [ ] 5.4: Calculate progress percentage from remaining time
  - [ ] 5.5: Apply cozy theme styling to TrayMenu container

- [ ] Task 6: Style TrayMenu Container (AC: #1)
  - [ ] 6.1: Apply `bg-cozy-bg` background color
  - [ ] 6.2: Add appropriate padding (16-20px)
  - [ ] 6.3: Add `rounded-xl` border radius (16px) for corners if visible
  - [ ] 6.4: Add subtle shadow for depth (`shadow-soft`)
  - [ ] 6.5: Ensure 280px width constraint is respected

- [ ] Task 7: Platform Testing
  - [ ] 7.1: Test tray window appears on tray icon click (macOS)
  - [ ] 7.2: Test tray window positions correctly near tray icon
  - [ ] 7.3: Test TimerRing displays correct progress during focus session
  - [ ] 7.4: Test TimerRing color changes for break mode
  - [ ] 7.5: Test clicking outside dismisses tray window
  - [ ] 7.6: Test Escape key dismisses tray window

## Dev Notes

### Epic 2 Context: System Tray Integration & Platform Experience

**Epic Objective:** User can access the timer from their menu bar/system tray without opening a window.

**This Story (2.2) Builds On:**
- Story 2.1: System tray icon with platform support (COMPLETED in sprint)
- Epic 1: Timer state management in Rust backend

**This Story Establishes:**
- Multi-window Tauri architecture (tray window)
- Multi-entry Vite build configuration
- TimerRing component (reusable for main window later)
- Tray menu foundation for Stories 2.3-2.5

### Previous Story Intelligence (Story 2.1)

**What Story 2.1 Established:**
- Tray icon implemented using Tauri 2.0 built-in `tray-icon` feature
- Tray module at `src-tauri/src/tray.rs`
- Dynamic icon updates based on timer state (idle/focus/break)
- Basic context menu (Show, Hide, Quit) for Linux compatibility
- Click handler infrastructure ready for window toggle

**Key Files from Story 2.1:**
```
src-tauri/
├── src/
│   ├── main.rs           # Tray setup in builder
│   ├── lib.rs            # Module exports
│   ├── tray.rs           # Tray management (NEW from 2.1)
│   └── state/
│       └── timer_state.rs    # Timer state triggers icon updates
public/
└── assets/
    └── icons/
        └── tray/
            ├── tray-idle.png
            ├── tray-focus.png
            └── tray-break.png
```

**Platform Limitations Discovered in 2.1:**
- Linux: Click events are NOT emitted - must use context menu
- Linux: Tooltip is unsupported
- macOS: Full click event support, template icons work

**⚠️ CRITICAL FOR THIS STORY:**
- Tray window click handling already partially implemented in `tray.rs`
- Need to enhance to properly position and toggle tray window
- Linux fallback: Use "Show Timer" menu item instead of click

### Architecture Requirements

**Multi-Window Architecture (AR6):**
```json
{
  "windows": [
    { "label": "tray", "visible": false, "width": 280, "height": 400 },
    { "label": "main", "title": "test-bmad", "width": 800, "height": 600 },
    { "label": "settings", "title": "Settings", "width": 400, "height": 500 }
  ]
}
```

**Project Structure for Tray Window:**
```
src/
├── windows/
│   ├── tray/
│   │   ├── index.html      # Entry point HTML
│   │   ├── main.tsx        # React mount
│   │   └── TrayMenu.tsx    # Main component
│   └── main/
│       ├── index.html
│       └── main.tsx
```

**Vite Multi-Entry Configuration:**
```typescript
// vite.config.ts
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/windows/main/index.html'),
        tray: resolve(__dirname, 'src/windows/tray/index.html'),
        settings: resolve(__dirname, 'src/windows/settings/index.html'),
      },
    },
  },
});
```

### UX Design Specifications

**From UX Design Document - TimerRing Component:**

**TimerRing Specifications (UX6, UX7):**
- Circular progress ring with 120px diameter
- 8px stroke width
- Track color: `cozy-border` (#4A4240)
- Focus progress: `cozy-accent` (#E8A598) - coral
- Break progress: `cozy-success` (#A8C5A0) - sage green
- Clockwise fill animation
- Smooth CSS transitions

**Tray Menu Layout (UX7):**
```
┌──────────────────────────────┐
│         TimerRing            │  ← 120px diameter
│          MM:SS               │  ← Centered time
│                              │
│ ─────────────────────────── │  ← Separator
│                              │
│ 🔥 Day 12        4 sessions │  ← Quick Stats (Story 2.3)
│ ☕ 1h 40m                    │
│                              │
│ [   Start Session   ]        │  ← Action Button (Story 2.4)
│                              │
│ ─────────────────────────── │  ← Separator
│ Stats & History       ►     │  ← Menu Items (Story 2.5)
│ Achievements          ►     │
│ Settings              ►     │
│ ─────────────────────────── │
│ Quit                        │
└──────────────────────────────┘
```

**Cozy Theme Colors:**
- Background: `cozy-bg` (#1C1816)
- Surface: `cozy-surface` (#2A2422)
- Elevated: `cozy-elevated` (#3D3533)
- Text: `cozy-text` (#F5F0E8)
- Muted: `cozy-muted` (#A89888)
- Border: `cozy-border` (#4A4240)
- Accent (coral): `cozy-accent` (#E8A598)
- Success (sage): `cozy-success` (#A8C5A0)

### TimerRing Implementation Details

**SVG Progress Ring Pattern:**
```tsx
// TimerRing.tsx
interface TimerRingProps {
  diameter?: number;           // default: 120
  strokeWidth?: number;        // default: 8
  progress: number;            // 0-100
  status: 'idle' | 'focus' | 'break' | 'paused';
  remainingSeconds?: number;   // For MM:SS display
}

const TimerRing: React.FC<TimerRingProps> = ({
  diameter = 120,
  strokeWidth = 8,
  progress,
  status,
  remainingSeconds,
}) => {
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const progressColor = status === 'break' 
    ? 'var(--cozy-success)' 
    : 'var(--cozy-accent)';
  
  return (
    <div className="relative" style={{ width: diameter, height: diameter }}>
      <svg className="transform -rotate-90" width={diameter} height={diameter}>
        {/* Track */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="var(--cozy-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {status === 'idle' ? (
          <span className="text-cozy-muted text-lg">Start</span>
        ) : (
          <span className="text-cozy-text text-2xl font-mono">
            {formatTime(remainingSeconds || 0)}
          </span>
        )}
      </div>
    </div>
  );
};

// Helper function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

### Tray Window Configuration

**Tauri Window Config for Tray:**
```json
{
  "label": "tray",
  "title": "",
  "width": 280,
  "height": 400,
  "visible": false,
  "decorations": false,
  "resizable": false,
  "alwaysOnTop": true,
  "skipTaskbar": true,
  "focus": false,
  "transparent": false,
  "center": false
}
```

**Window Positioning Logic (macOS):**
```rust
// In tray.rs - position tray window near tray icon
fn position_tray_window(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(window) = app.get_webview_window("tray") {
        // Get tray icon position (macOS only)
        // Position window below/near the tray icon
        // Account for menu bar height and screen bounds
    }
    Ok(())
}
```

### Tauri IPC Integration

**Listening to Timer Events in Tray Window:**
```typescript
// In TrayMenu.tsx
import { listen } from '@tauri-apps/api/event';

useEffect(() => {
  const unlisten = listen<{ remaining: number }>('TimerTick', (event) => {
    setRemainingSeconds(event.payload.remaining);
  });
  
  return () => {
    unlisten.then(fn => fn());
  };
}, []);
```

**Getting Initial State:**
```typescript
import { invoke } from '@tauri-apps/api/core';

// On mount
const timerState = await invoke<TimerState>('getTimerState');
setStatus(timerState.status);
setRemainingSeconds(timerState.remaining_seconds);
```

### Testing Strategy

**Component Tests (Vitest + React Testing Library):**
```typescript
// TimerRing.test.tsx
import { render, screen } from '@testing-library/react';
import { TimerRing } from './TimerRing';

describe('TimerRing', () => {
  it('renders with correct progress', () => {
    render(<TimerRing progress={50} status="focus" />);
    // Assert SVG stroke-dashoffset is correct
  });
  
  it('shows "Start" when idle', () => {
    render(<TimerRing progress={0} status="idle" />);
    expect(screen.getByText('Start')).toBeInTheDocument();
  });
  
  it('shows time when active', () => {
    render(<TimerRing progress={50} status="focus" remainingSeconds={750} />);
    expect(screen.getByText('12:30')).toBeInTheDocument();
  });
  
  it('uses accent color for focus', () => {
    // Assert stroke color is cozy-accent
  });
  
  it('uses success color for break', () => {
    // Assert stroke color is cozy-success
  });
});
```

### Dependencies on Other Stories

**Depends On:**
- Story 2.1: System tray icon (provides click handler infrastructure)
- Epic 1: Timer state management and `TimerTick` events

**Enables:**
- Story 2.3: Quick stats in tray menu (builds on TrayMenu component)
- Story 2.4: Start/stop from tray menu (adds action button)
- Story 2.5: Main window launch (adds menu items)

### Files to Create

| File | Purpose |
|------|---------|
| `src/windows/tray/index.html` | HTML entry for tray window |
| `src/windows/tray/main.tsx` | React mount for tray |
| `src/windows/tray/TrayMenu.tsx` | Main tray menu component |
| `src/features/timer/components/TimerRing.tsx` | Circular progress ring |
| `src/features/timer/components/TimerRing.test.tsx` | TimerRing tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/tauri.conf.json` | Add tray window configuration |
| `vite.config.ts` | Add multi-entry build inputs |
| `src-tauri/src/tray.rs` | Add window positioning and toggle logic |
| `src/features/timer/components/index.ts` | Export TimerRing component |

### Project Structure Notes

**Alignment with Architecture:**
- `src/windows/tray/` follows established multi-window pattern
- `src/features/timer/components/TimerRing.tsx` follows feature-based structure
- Co-located test file per architecture guidelines

**Path Aliases (from tsconfig.json):**
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`
- `@/windows/*` → `src/windows/*`

### References

- [Source: architecture.md#Multi-Window-Architecture] - Window configuration pattern
- [Source: architecture.md#Frontend-Architecture] - Feature-based structure
- [Source: architecture.md#Vite-Multi-Entry] - Build configuration
- [Source: epics.md#Story-2.2] - Full acceptance criteria
- [Source: epics.md#Epic-2] - Epic objectives
- [Source: ux-design-specification.md#TimerRing] - Component specifications
- [Source: ux-design-specification.md#TrayMenu-Layout] - Menu layout
- [Source: ux-design-specification.md#Cozy-Palette] - Theme colors
- [Source: Story 2.1] - Previous story learnings on tray implementation
- [Source: Tauri 2.0 Multi-Window] - https://v2.tauri.app/learn/window-customization/

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2026-01-29: Story created by create-story workflow - comprehensive context for tray menu with timer ring
