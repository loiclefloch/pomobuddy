# Story 3.6: Add Settings Storage and Configuration

Status: review

## Story

As a user,
I want to configure where my data is stored,
So that I can sync it with Dropbox, git, or my preferred backup solution.

## Acceptance Criteria

1. **Given** the Tauri project
   **When** I implement settings storage in `src-tauri/src/storage/settings.rs`
   **Then** settings are stored in `{data_dir}/settings.json`
   **And** the settings file is created on first launch with defaults

2. **Given** the settings storage exists
   **When** I define the settings schema
   **Then** settings include:
     - `focusDuration`: number (default: 1500 seconds / 25 minutes)
     - `breakDuration`: number (default: 300 seconds / 5 minutes)
     - `storagePath`: string | null (default: null = use system default)
     - `audioEnabled`: boolean (default: true)
     - `character`: string (default: "cat")
   **And** the schema matches Architecture AR8 specification

3. **Given** settings can be stored
   **When** I implement settings commands
   **Then** `getSettings()` returns current settings
   **And** `updateSettings(settings)` saves updated settings
   **And** settings changes are persisted immediately

4. **Given** the settings window exists
   **When** I create a basic settings form in `src/features/settings/`
   **Then** the form allows changing the storage location (FR28)
   **And** a folder picker dialog allows browsing for custom location
   **And** changing storage location moves existing data files

5. **Given** a custom storage path is set
   **When** sessions are saved
   **Then** files are written to the custom path instead of default
   **And** the app works fully offline with the custom path (FR30)

6. **Given** settings are changed
   **When** the app restarts
   **Then** settings are loaded from `settings.json`
   **And** the custom storage path is used if configured

## Tasks / Subtasks

- [x] Task 1: Create Settings Storage Module (AC: #1)
  - [x] 1.1: Create `src-tauri/src/storage/settings.rs`
  - [x] 1.2: Define `Settings` struct with all fields
  - [x] 1.3: Implement default values
  - [x] 1.4: Implement `load_settings()` function
  - [x] 1.5: Implement `save_settings()` function
  - [x] 1.6: Create settings file on first launch

- [x] Task 2: Define Settings Schema (AC: #2)
  - [x] 2.1: focusDuration: u32 (default 1500)
  - [x] 2.2: breakDuration: u32 (default 300)
  - [x] 2.3: storagePath: Option<String> (default None)
  - [x] 2.4: audioEnabled: bool (default true)
  - [x] 2.5: character: String (default "cat")

- [x] Task 3: Create Settings Commands (AC: #3)
  - [x] 3.1: Create `getSettings` Tauri command
  - [x] 3.2: Create `updateSettings` Tauri command
  - [x] 3.3: Create `pickStorageFolder` command (file dialog)
  - [x] 3.4: Register commands in builder

- [x] Task 4: Implement Storage Path Change (AC: #4, #5)
  - [x] 4.1: Validate new storage path is writable
  - [x] 4.2: Move existing session files to new location
  - [x] 4.3: Update settings.json with new path
  - [x] 4.4: Update all storage operations to use custom path

- [x] Task 5: Create Settings Form UI (AC: #4)
  - [x] 5.1: Create `src/features/settings/components/SettingsForm.tsx`
  - [x] 5.2: Add storage location field with browse button
  - [x] 5.3: Add timer duration settings (future use)
  - [x] 5.4: Add audio toggle (future use)
  - [x] 5.5: Add character selector preview (future use)

- [x] Task 6: Integrate with Settings Window (AC: #4)
  - [x] 6.1: Add SettingsForm to SettingsWindow.tsx
  - [x] 6.2: Connect form to settings store
  - [x] 6.3: Handle save/cancel actions

- [x] Task 7: Settings Persistence on Startup (AC: #6)
  - [x] 7.1: Load settings on app startup
  - [x] 7.2: Configure storage module with custom path
  - [x] 7.3: Validate custom path still exists
  - [x] 7.4: Fallback to default if custom path invalid

## Dev Notes

### Architecture - Settings Schema (AR8)

**settings.json Format:**
```json
{
  "focusDuration": 1500,
  "breakDuration": 300,
  "storagePath": null,
  "audioEnabled": true,
  "character": "cat"
}
```

**Storage Locations:**
- Settings file: `{data_dir}/settings.json`
- Default session path: `{data_dir}/sessions/`
- Custom session path: `{storagePath}/sessions/` if configured

### Rust Implementation

**Settings Struct:**
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    #[serde(default = "default_focus_duration")]
    pub focus_duration: u32,
    #[serde(default = "default_break_duration")]
    pub break_duration: u32,
    #[serde(default)]
    pub storage_path: Option<String>,
    #[serde(default = "default_audio_enabled")]
    pub audio_enabled: bool,
    #[serde(default = "default_character")]
    pub character: String,
}

fn default_focus_duration() -> u32 { 1500 }
fn default_break_duration() -> u32 { 300 }
fn default_audio_enabled() -> bool { true }
fn default_character() -> String { "cat".to_string() }
```

### File Dialog for Storage Path

**Using tauri-plugin-dialog:**
```rust
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
async fn pickStorageFolder(app: AppHandle) -> Result<Option<String>, String> {
    let folder = app.dialog()
        .file()
        .set_title("Select Storage Location")
        .pick_folder()
        .await;
    Ok(folder.map(|p| p.to_string_lossy().to_string()))
}
```

### Moving Data Files

**Migration Logic:**
```rust
fn migrate_storage(old_path: &Path, new_path: &Path) -> Result<(), Error> {
    // 1. Create new sessions directory
    fs::create_dir_all(new_path.join("sessions"))?;
    
    // 2. Move all .md files
    for entry in fs::read_dir(old_path.join("sessions"))? {
        let entry = entry?;
        let dest = new_path.join("sessions").join(entry.file_name());
        fs::rename(entry.path(), dest)?;
    }
    
    // 3. Move achievements.json if exists
    // 4. Move settings.json (stays in data_dir)
    
    Ok(())
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src-tauri/src/storage/settings.rs` | Settings I/O |
| `src/features/settings/components/SettingsForm.tsx` | Settings UI |
| `src/features/settings/stores/settingsStore.ts` | Settings state |

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/Cargo.toml` | Add tauri-plugin-dialog |
| `src-tauri/src/storage/mod.rs` | Export settings |
| `src-tauri/src/storage/sessions.rs` | Use configurable path |
| `src-tauri/src/main.rs` | Load settings on startup |
| `src/windows/settings/SettingsWindow.tsx` | Add form |

### References

- [Source: epics.md#Story-3.6] - Full acceptance criteria
- [Source: architecture.md#AR8] - Settings schema
- [Source: prd.md#FR28] - Configure storage location
- [Source: prd.md#FR30] - Fully offline operation

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4 (claude-sonnet-4-20250514)

### Debug Log References

No debug issues encountered.

### Completion Notes List

- Implemented complete settings storage module in Rust with load/save functions and atomic file writes
- Settings schema matches AR8 specification with all required fields (focusDuration, breakDuration, storagePath, audioEnabled, character)
- Created 5 Tauri commands: get_settings, update_settings, pick_storage_folder, change_storage_location, reset_storage_location
- Implemented storage migration logic to safely move session files when path changes
- Built settings form UI with storage location picker, timer settings display, and audio/character display
- Integrated settings form into SettingsWindow replacing placeholder
- Settings are initialized on app startup with path validation and fallback to default
- Sessions module now uses effective_sessions_directory which respects custom storage path
- Added comprehensive test suites: 10 Rust tests for settings module, 20 TypeScript tests for settings store/hooks/components
- All 35 Rust tests and 268 frontend tests pass

### File List

**New Files:**
- src-tauri/src/storage/settings.rs
- src-tauri/src/commands/settings.rs
- src/features/settings/stores/settingsStore.ts
- src/features/settings/hooks/useSettings.ts
- src/features/settings/components/SettingsForm.tsx
- src/features/settings/components/index.ts
- src/features/settings/stores/settingsStore.test.ts
- src/features/settings/hooks/useSettings.test.ts
- src/features/settings/components/SettingsForm.test.tsx

**Modified Files:**
- src-tauri/Cargo.toml (added tauri-plugin-dialog, tempfile dev-dependency)
- src-tauri/src/storage/mod.rs (export settings module)
- src-tauri/src/storage/sessions.rs (use configurable sessions directory)
- src-tauri/src/commands/mod.rs (export settings commands)
- src-tauri/src/lib.rs (register settings commands, initialize settings on startup)
- src/windows/settings/SettingsWindow.tsx (integrate SettingsForm)
- _bmad-output/implementation-artifacts/sprint-status.yaml (status: in-progress)

**Deleted Files:**
- src/features/settings/components/.gitkeep
- src/features/settings/stores/.gitkeep

## Change Log

- 2026-01-29: Implemented settings storage and configuration (Story 3.6)
