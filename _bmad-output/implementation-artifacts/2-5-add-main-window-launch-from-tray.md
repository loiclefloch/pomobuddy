# Story 2.5: Add Main Window Launch from Tray

Status: ready-for-dev

## Story

As a user,
I want to open the main statistics window from the tray menu,
So that I can view detailed stats and achievements when needed.

## Acceptance Criteria

1. **Given** the tray menu with timer controls
   **When** I add menu items section below the action button
   **Then** a separator divides the timer section from menu items
   **And** menu items are displayed in a list format

2. **Given** the menu items section exists
   **When** I add navigation menu items
   **Then** the following items are available:
     - "Stats & History" with bar-chart icon
     - "Achievements" with trophy icon
     - "Settings" with settings icon
     - Separator
     - "Quit" with x icon
   **And** menu items use shadcn/ui DropdownMenu styling
   **And** menu items have hover states with `bg-cozy-elevated`

3. **Given** the main window is configured in `tauri.conf.json`
   **When** the window configuration is set
   **Then** main window has label `main`, title "test-bmad"
   **And** main window default size is 800x600px
   **And** main window is initially hidden

4. **Given** the "Stats & History" menu item exists
   **When** I click "Stats & History"
   **Then** the main window opens (or focuses if already open)
   **And** the tray menu closes
   **And** the main window shows the stats view (placeholder for Epic 3)

5. **Given** the "Settings" menu item exists
   **When** I click "Settings"
   **Then** the settings window opens (400x500px per AR6)
   **And** the tray menu closes
   **And** the settings window shows preferences (placeholder for future)

6. **Given** the "Quit" menu item exists
   **When** I click "Quit"
   **Then** the application exits gracefully
   **And** any running timer state is preserved (prepared for Epic 3 persistence)

## Tasks / Subtasks

- [ ] Task 1: Configure Main and Settings Windows in Tauri (AC: #3, #5)
  - [ ] 1.1: Update `tauri.conf.json` with main window config (800x600, hidden)
  - [ ] 1.2: Update `tauri.conf.json` with settings window config (400x500, hidden)
  - [ ] 1.3: Create `src/windows/main/index.html` entry point
  - [ ] 1.4: Create `src/windows/main/main.tsx` React mount
  - [ ] 1.5: Create `src/windows/main/MainWindow.tsx` placeholder component
  - [ ] 1.6: Create `src/windows/settings/` structure similarly
  - [ ] 1.7: Update `vite.config.ts` with main and settings entry points

- [ ] Task 2: Create TrayMenuItems Component (AC: #1, #2)
  - [ ] 2.1: Create `src/windows/tray/components/TrayMenuItems.tsx`
  - [ ] 2.2: Implement menu item list with icons
  - [ ] 2.3: Use Lucide icons: BarChart3, Trophy, Settings, X
  - [ ] 2.4: Apply hover states with `bg-cozy-elevated`
  - [ ] 2.5: Add separators between sections

- [ ] Task 3: Implement Window Management Commands (AC: #4, #5, #6)
  - [ ] 3.1: Create `openMainWindow()` function using Tauri window API
  - [ ] 3.2: Create `openSettingsWindow()` function
  - [ ] 3.3: Create `quitApp()` function with graceful shutdown
  - [ ] 3.4: Handle "window already open" case (focus instead of create)

- [ ] Task 4: Implement Menu Item Click Handlers (AC: #4, #5, #6)
  - [ ] 4.1: "Stats & History" opens main window, closes tray
  - [ ] 4.2: "Achievements" opens main window to achievements tab
  - [ ] 4.3: "Settings" opens settings window, closes tray
  - [ ] 4.4: "Quit" calls graceful exit

- [ ] Task 5: Integrate into TrayMenu (AC: #1)
  - [ ] 5.1: Import TrayMenuItems into TrayMenu.tsx
  - [ ] 5.2: Add separator after ActionButton
  - [ ] 5.3: Position menu items at bottom of tray menu
  - [ ] 5.4: Ensure tray menu closes after navigation

- [ ] Task 6: Create Placeholder Windows (AC: #4, #5)
  - [ ] 6.1: MainWindow.tsx with "Stats coming in Epic 3" placeholder
  - [ ] 6.2: SettingsWindow.tsx with "Settings coming soon" placeholder
  - [ ] 6.3: Apply cozy theme styling to both
  - [ ] 6.4: Ensure windows can be closed back to tray

- [ ] Task 7: Testing
  - [ ] 7.1: Test menu items render with correct icons
  - [ ] 7.2: Test main window opens on click
  - [ ] 7.3: Test settings window opens on click
  - [ ] 7.4: Test quit functionality
  - [ ] 7.5: Test tray menu closes after navigation

## Dev Notes

### Final TrayMenu Layout After This Story

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
│ [   Start Session   ]        │
│                              │
│ ─────────────────────────── │  ← Separator
│ 📊 Stats & History       ►  │  ← Menu items (THIS STORY)
│ 🏆 Achievements          ►  │
│ ⚙️ Settings              ►  │
│ ─────────────────────────── │
│ ✕ Quit                      │
└──────────────────────────────┘
```

### Architecture - Multi-Window Configuration

**From Architecture (AR6):**
```json
{
  "windows": [
    { "label": "tray", "visible": false, "width": 280, "height": 400 },
    { "label": "main", "title": "test-bmad", "width": 800, "height": 600, "visible": false },
    { "label": "settings", "title": "Settings", "width": 400, "height": 500, "visible": false }
  ]
}
```

### Tauri Window API

**Opening Windows:**
```typescript
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

async function openMainWindow() {
  const mainWindow = WebviewWindow.getByLabel('main');
  if (mainWindow) {
    await mainWindow.show();
    await mainWindow.setFocus();
  }
}
```

**Closing Tray Menu:**
```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

async function closeTrayMenu() {
  const trayWindow = getCurrentWindow();
  await trayWindow.hide();
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/windows/tray/components/TrayMenuItems.tsx` | Menu navigation items |
| `src/windows/main/index.html` | Main window entry |
| `src/windows/main/main.tsx` | Main window React mount |
| `src/windows/main/MainWindow.tsx` | Main window component |
| `src/windows/settings/index.html` | Settings window entry |
| `src/windows/settings/main.tsx` | Settings window React mount |
| `src/windows/settings/SettingsWindow.tsx` | Settings window component |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/tauri.conf.json` | Add main and settings windows |
| `vite.config.ts` | Add main and settings entries |
| `src/windows/tray/TrayMenu.tsx` | Add TrayMenuItems |

### Dependencies

**Completes Epic 2:** This story completes the System Tray Integration epic.

**Enables:**
- Epic 3: Stats views in main window
- Epic 4: Achievements view
- Future: Settings functionality

### References

- [Source: epics.md#Story-2.5] - Full acceptance criteria
- [Source: architecture.md#Multi-Window-Architecture] - Window specs
- [Source: architecture.md#Vite-Multi-Entry] - Build configuration

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
