# Story 2.1: Implement System Tray Icon with Platform Support

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the app to display an icon in my system tray/menu bar,
So that I can access the app quickly without it taking up space in my taskbar.

## Acceptance Criteria

1. **Given** the Tauri project from Epic 1
   **When** I add the tray plugin to the project
   **Then** the plugin is listed in `src-tauri/Cargo.toml` dependencies
   **And** the plugin is registered in `src-tauri/src/main.rs`
   **And** tray permissions are configured in `src-tauri/capabilities/default.json`

2. **Given** the tray plugin is configured
   **When** I create tray icon assets in `public/assets/icons/tray/`
   **Then** the following icon files exist:
     - `tray-idle.png` (default state)
     - `tray-focus.png` (active focus session)
     - `tray-break.png` (break mode)
   **And** icons are appropriately sized for both macOS (22x22 @1x, 44x44 @2x) and Linux (22x22)

3. **Given** tray icons exist
   **When** the app starts on macOS
   **Then** the tray icon appears in the menu bar
   **And** the icon is visible and correctly sized
   **And** clicking the icon triggers the tray menu to open

4. **Given** tray icons exist
   **When** the app starts on Linux
   **Then** the tray icon appears in the system tray
   **And** the icon works on GNOME desktop environments
   **And** the icon works on KDE desktop environments
   **And** right-clicking the icon shows the tray menu (Note: left-click events unsupported on Linux)

5. **Given** the timer state changes
   **When** the timer transitions between idle, focus, and break states
   **Then** the tray icon updates to reflect the current state
   **And** icon transitions happen within 100ms of state change

## Tasks / Subtasks

- [ ] Task 1: Add Tauri Tray Plugin to Project (AC: #1)
  - [ ] 1.1: Add `tauri-plugin-tray-icon` or equivalent tray dependency to `src-tauri/Cargo.toml`
  - [ ] 1.2: Register tray plugin in `src-tauri/src/main.rs` using Tauri 2.0 builder pattern
  - [ ] 1.3: Configure tray permissions in `src-tauri/capabilities/default.json`
  - [ ] 1.4: Run `cargo build` to verify plugin integration compiles

- [ ] Task 2: Create Tray Icon Assets (AC: #2)
  - [ ] 2.1: Create `public/assets/icons/tray/` directory structure
  - [ ] 2.2: Create `tray-idle.png` - default state icon (22x22 and 44x44@2x)
  - [ ] 2.3: Create `tray-focus.png` - active focus session icon (coral accent tint)
  - [ ] 2.4: Create `tray-break.png` - break mode icon (sage green tint)
  - [ ] 2.5: Ensure icons have transparency and work on both light and dark system themes

- [ ] Task 3: Implement Tray Icon Setup in Rust Backend (AC: #3, #4)
  - [ ] 3.1: Create `src-tauri/src/tray.rs` module for tray management
  - [ ] 3.2: Implement `setup_tray()` function to create initial tray icon
  - [ ] 3.3: Register tray setup in `src-tauri/src/main.rs` builder
  - [ ] 3.4: Implement click handler to show/hide tray window (Story 2.2 prep)
  - [ ] 3.5: Export tray module in `src-tauri/src/lib.rs`

- [ ] Task 4: Implement Dynamic Icon Updates Based on Timer State (AC: #5)
  - [ ] 4.1: Create `update_tray_icon(state: TimerStatus)` function in tray module
  - [ ] 4.2: Integrate icon updates with timer state changes in `timer_state.rs`
  - [ ] 4.3: Call `update_tray_icon()` when timer status changes (idle → focus → break)
  - [ ] 4.4: Ensure icon update performance is < 100ms

- [ ] Task 5: Platform Testing (AC: #3, #4)
  - [ ] 5.1: Test tray icon appearance on macOS menu bar
  - [ ] 5.2: Verify icon displays correctly in Retina (@2x) resolution on macOS
  - [ ] 5.3: Test tray icon on Linux (if available) - GNOME/KDE
  - [ ] 5.4: Verify click events work on both platforms
  - [ ] 5.5: Document any platform-specific issues encountered

- [ ] Task 6: Error Handling and Edge Cases
  - [ ] 6.1: Handle tray creation failure gracefully (log, don't crash)
  - [ ] 6.2: Handle icon file not found (use fallback or default)
  - [ ] 6.3: Test behavior when tray area is full/unavailable
  - [ ] 6.4: Ensure tray icon is removed on app quit

## Dev Notes

### Epic 2 Context: System Tray Integration & Platform Experience

**Epic Objective:** User can access the timer from their menu bar/system tray without opening a window.

**FRs Covered by This Epic:**
- FR20: App displays in system tray/menu bar
- FR21: User can open main window from system tray icon
- FR22: User can start/stop sessions directly from system tray menu
- FR31: App runs on macOS with menu bar integration
- FR32: App runs on Linux with system tray integration
- FR33: App sends native OS notifications

**This Story (2.1) Establishes:**
- The foundational tray icon presence
- Platform-specific tray integration (macOS/Linux)
- Dynamic icon state updates tied to timer
- Base for Story 2.2 (tray menu) to build upon

### Previous Epic Intelligence (Epic 1 Foundation)

**What Epic 1 Established:**
- Tauri 2.0 project initialized with React + TypeScript (`npm create tauri-app@latest`)
- Tailwind CSS v4 + shadcn/ui + Zustand configured
- Feature-based directory structure in `src/features/`
- Timer state management in Rust backend (`src-tauri/src/state/timer_state.rs`)
- Timer commands in `src-tauri/src/commands/timer.rs`
- Frontend timer components in `src/features/timer/`
- IPC events: `TimerTick`, `SessionComplete`
- Timer status: `idle`, `focus`, `break`, `paused`

**Key Files Already Exist:**
```
src-tauri/
├── src/
│   ├── main.rs           # Tauri entry point
│   ├── lib.rs            # Module exports
│   ├── state/
│   │   ├── mod.rs
│   │   └── timer_state.rs    # Timer state (idle/focus/break/paused)
│   └── commands/
│       └── timer.rs          # startTimer, pauseTimer, stopTimer, getTimerState
```

**Timer Status Enum (from timer_state.rs):**
```rust
pub enum TimerStatus {
    Idle,
    Focus,
    Break,
    Paused,
}
```

### Architecture Requirements

**From Architecture Document - System Tray:**
```
Platform Integration (Tauri 2.0 features):
- System tray via Tauri built-in tray functionality
```

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

**Project Structure for Tray:**
```
public/
└── assets/
    └── icons/
        ├── icon.icns             # macOS app icon
        ├── icon.png              # Linux app icon
        └── tray/
            ├── tray-idle.png     # Tray icon states
            ├── tray-focus.png
            └── tray-break.png
```

**Rust Module Organization:**
```
src-tauri/src/
├── main.rs                   # Tray setup integration
├── lib.rs                    # Module exports
├── tray.rs                   # NEW: Tray management
├── state/
│   └── timer_state.rs        # Timer state - triggers icon updates
└── commands/
    └── timer.rs              # Timer commands
```

### Tauri 2.0 Tray Implementation

**CRITICAL: Tauri 2.0 has BUILT-IN tray support - no external plugin needed!**

**Cargo.toml - Tray is built into Tauri 2.0:**
```toml
[dependencies]
tauri = { version = "2", features = ["tray-icon"] }
```

**Capability Configuration (capabilities/default.json):**
```json
{
  "permissions": [
    "core:default",
    "core:tray:default",
    "core:tray:allow-set-icon",
    "core:tray:allow-set-title",
    "core:tray:allow-set-tooltip"
  ]
}
```

**Tray Setup in main.rs (Tauri 2.0 Pattern):**
```rust
use tauri::{
    tray::{TrayIconBuilder, TrayIconEvent},
    Manager,
};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Create tray icon on app setup
            let tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("test-bmad - Focus Timer")
                .on_tray_icon_event(|tray, event| {
                    match event {
                        TrayIconEvent::Click { button, button_state, .. } => {
                            // Handle click - toggle tray window visibility
                            if let Some(window) = tray.app_handle().get_webview_window("tray") {
                                if window.is_visible().unwrap_or(false) {
                                    let _ = window.hide();
                                } else {
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }
                            }
                        }
                        _ => {}
                    }
                })
                .build(app)?;
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**Dynamic Icon Update Function:**
```rust
use tauri::{AppHandle, Manager, image::Image};
use std::path::Path;

pub fn update_tray_icon(app: &AppHandle, status: &str) -> Result<(), Box<dyn std::error::Error>> {
    let icon_path = match status {
        "focus" => "assets/icons/tray/tray-focus.png",
        "break" => "assets/icons/tray/tray-break.png",
        _ => "assets/icons/tray/tray-idle.png",
    };
    
    // Load icon from resources
    let icon = Image::from_path(icon_path)?;
    
    // Update tray icon
    if let Some(tray) = app.tray_by_id("main") {
        tray.set_icon(Some(icon))?;
    }
    
    Ok(())
}
```

### Icon Asset Specifications

**From UX Design Specification:**

**Tray Icon States:**
- **Idle**: Default cozy icon (character at rest)
- **Active Session (Focus)**: Animated/distinct icon with coral accent
- **Break Time**: Distinct break state indicator with sage green

**Size Requirements:**
| Platform | Size | Notes |
|----------|------|-------|
| macOS @1x | 22x22 | Standard menu bar size |
| macOS @2x | 44x44 | Retina displays |
| Linux | 22x22 | Standard system tray |

**Icon Design Guidelines:**
- Use PNG with transparency
- Simple, recognizable silhouette
- Work on both light and dark system themes
- Coral accent (#E8A598) for focus state
- Sage green (#A8C5A0) for break state
- Neutral for idle state

**Icon File Naming:**
```
public/assets/icons/tray/
├── tray-idle.png       # 22x22, neutral state
├── tray-idle@2x.png    # 44x44, macOS Retina
├── tray-focus.png      # 22x22, coral tint
├── tray-focus@2x.png   # 44x44, macOS Retina
├── tray-break.png      # 22x22, sage tint
└── tray-break@2x.png   # 44x44, macOS Retina
```

### Integration with Timer State

**Timer State → Tray Icon Flow:**
```
Timer State Changes (timer_state.rs):
  -> Status becomes Focus
  -> Call update_tray_icon(app_handle, "focus")
  -> Tray icon changes to tray-focus.png

Timer State Changes:
  -> Status becomes Break
  -> Call update_tray_icon(app_handle, "break")
  -> Tray icon changes to tray-break.png

Timer State Changes:
  -> Status becomes Idle
  -> Call update_tray_icon(app_handle, "idle")
  -> Tray icon changes to tray-idle.png
```

**Modify timer_state.rs to trigger icon updates:**
```rust
// In set_status function or wherever status changes
pub fn set_status(&mut self, app: &AppHandle, new_status: TimerStatus) {
    self.status = new_status;
    
    // Update tray icon based on new status
    let icon_state = match new_status {
        TimerStatus::Focus => "focus",
        TimerStatus::Break => "break",
        _ => "idle",
    };
    
    if let Err(e) = crate::tray::update_tray_icon(app, icon_state) {
        eprintln!("Failed to update tray icon: {}", e);
    }
}
```

### Platform-Specific Considerations

**⚠️ CRITICAL: Platform Feature Support Matrix**

| Feature       | macOS | Linux |
| ------------- | ----- | ----- |
| Tray icon     | ✅    | ✅    |
| Click events  | ✅    | ❌ **UNSUPPORTED** |
| Context menu  | ✅    | ✅    |
| Tooltip       | ✅    | ❌ **UNSUPPORTED** |
| Title         | ✅    | ✅* (requires icon) |
| Template icon | ✅    | ❌    |

**macOS:**
- Menu bar icon placement (right side, near clock)
- Uses NSStatusItem under the hood
- Supports template images for auto light/dark mode (use `icon_as_template(true)`)
- @2x icons for Retina displays essential
- Click events work: `TrayIconEvent::Click` fires on left/right click
- Title displays next to icon in menu bar

**Linux:**
- Uses StatusNotifierItem (freedesktop spec) / AppIndicator
- **CRITICAL LIMITATION: Click events are NOT emitted on Linux!**
- Must rely on context menu (right-click) for interaction
- May need `libayatana-appindicator` on some distros:
  ```bash
  # Ubuntu/Debian
  sudo apt install libayatana-appindicator3-dev
  ```
- GNOME: Uses AppIndicator extension
- KDE: Native system tray support
- Tooltip is also unsupported on Linux

**Tauri 2.0 Platform Notes:**
- Same Rust API works on both platforms
- Icon paths resolve from app resources
- **For Linux compatibility: Always provide a context menu as fallback interaction**

**Recommended Implementation Pattern for Cross-Platform:**
```rust
TrayIconBuilder::new()
    .icon(...)
    .icon_as_template(true)  // macOS: adapt to dark/light mode
    .tooltip("test-bmad - Focus Timer")  // macOS only
    .menu(&menu)  // REQUIRED for Linux interaction
    .show_menu_on_left_click(false)  // Right-click for menu (works everywhere)
    .on_tray_icon_event(|tray, event| {
        // Note: This callback does NOT fire on Linux!
        // Only use for enhanced macOS experience
    })
    .build(app)?;
```

### Error Handling Strategy

**Tray Creation Failures:**
```rust
match TrayIconBuilder::new().build(app) {
    Ok(tray) => {
        // Tray created successfully
    }
    Err(e) => {
        // Log error but don't crash - tray is enhancement
        eprintln!("Failed to create tray icon: {}", e);
        // App continues to work without tray
    }
}
```

**Icon Load Failures:**
```rust
// Use fallback if specific icon fails to load
let icon = Image::from_path(icon_path)
    .or_else(|_| Image::from_path("assets/icons/tray/tray-idle.png"))
    .or_else(|_| app.default_window_icon().cloned().ok_or("No icon"))?;
```

### Testing Strategy

**Manual Testing Checklist:**
1. Launch app → tray icon appears in menu bar/system tray
2. Icon displays at correct size (not blurry on Retina)
3. Start focus session → icon changes to focus state
4. Session completes → icon changes to break state
5. Break ends → icon changes to idle state
6. Click tray icon → (prepare for Story 2.2 - window toggle)
7. Quit app → tray icon removed

**Platform Testing:**
- macOS: Test on Intel and Apple Silicon if possible
- macOS: Verify Retina icon quality
- Linux: Test on Ubuntu/GNOME if VM available

### Dependencies on Other Stories

**Depends On:**
- Epic 1 stories (1.1-1.6) - Project foundation and timer state

**Enables:**
- Story 2.2: Tray menu with timer ring display
- Story 2.3: Quick stats in tray menu
- Story 2.4: Start/stop from tray menu
- Story 2.5: Main window launch from tray

### Files to Create

| File | Purpose |
|------|---------|
| `src-tauri/src/tray.rs` | Tray icon management module |
| `public/assets/icons/tray/tray-idle.png` | Idle state icon |
| `public/assets/icons/tray/tray-idle@2x.png` | Idle state icon (Retina) |
| `public/assets/icons/tray/tray-focus.png` | Focus state icon |
| `public/assets/icons/tray/tray-focus@2x.png` | Focus state icon (Retina) |
| `public/assets/icons/tray/tray-break.png` | Break state icon |
| `public/assets/icons/tray/tray-break@2x.png` | Break state icon (Retina) |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/Cargo.toml` | Add `tray-icon` feature if not present |
| `src-tauri/src/main.rs` | Add tray setup in builder |
| `src-tauri/src/lib.rs` | Export tray module |
| `src-tauri/capabilities/default.json` | Add tray permissions |
| `src-tauri/src/state/timer_state.rs` | Call tray icon update on status change |

### References

- [Source: architecture.md#Platform-Integration] - Tauri tray support
- [Source: architecture.md#Multi-Window-Architecture] - Window configuration
- [Source: architecture.md#Project-Structure] - Asset organization
- [Source: epics.md#Epic-2] - Epic 2 objectives
- [Source: epics.md#Story-2.1] - Full acceptance criteria
- [Source: prd.md#FR20] - System tray display requirement
- [Source: prd.md#FR31] - macOS menu bar integration
- [Source: prd.md#FR32] - Linux system tray integration
- [Source: ux-design-specification.md#Tray-Icon-States] - Icon state definitions
- [Source: ux-design-specification.md#TrayMenu-Component] - Tray menu specs
- [Source: Tauri 2.0 Tray Docs] - https://v2.tauri.app/learn/system-tray/

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2026-01-29: Story created by create-story workflow - comprehensive context for system tray implementation
