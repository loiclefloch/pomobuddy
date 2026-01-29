//! Settings storage module
//!
//! Handles reading and writing application settings to `settings.json`.
//! Settings are stored in platform-specific app data directories.

use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

use crate::error::AppError;

/// Application settings matching AR8 specification
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    /// Focus session duration in seconds (default: 1500 = 25 minutes)
    #[serde(default = "default_focus_duration")]
    pub focus_duration: u32,

    /// Break duration in seconds (default: 300 = 5 minutes)
    #[serde(default = "default_break_duration")]
    pub break_duration: u32,

    /// Custom storage path for sessions (None = use system default)
    #[serde(default)]
    pub storage_path: Option<String>,

    /// Whether audio is enabled for notifications
    #[serde(default = "default_audio_enabled")]
    pub audio_enabled: bool,

    /// Selected character (cat, owl, etc.)
    #[serde(default = "default_character")]
    pub character: String,
}

fn default_focus_duration() -> u32 {
    1500
}

fn default_break_duration() -> u32 {
    300
}

fn default_audio_enabled() -> bool {
    true
}

fn default_character() -> String {
    "cat".to_string()
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            focus_duration: default_focus_duration(),
            break_duration: default_break_duration(),
            storage_path: None,
            audio_enabled: default_audio_enabled(),
            character: default_character(),
        }
    }
}

/// Get the platform-specific data directory for the application
pub fn get_data_directory() -> Result<PathBuf, AppError> {
    let data_dir = dirs::data_dir()
        .ok_or_else(|| AppError::StorageError("Could not determine data directory".to_string()))?;

    let app_dir = data_dir.join("test-bmad");

    // Create directory if it doesn't exist
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir).map_err(|e| {
            AppError::StorageError(format!("Failed to create data directory: {}", e))
        })?;
    }

    Ok(app_dir)
}

/// Get the path to the settings file
pub fn get_settings_file_path() -> Result<PathBuf, AppError> {
    let data_dir = get_data_directory()?;
    Ok(data_dir.join("settings.json"))
}

/// Load settings from disk
///
/// If the settings file doesn't exist, creates it with default values.
/// If the file exists but is invalid JSON, returns an error.
pub fn load_settings() -> Result<Settings, AppError> {
    let settings_path = get_settings_file_path()?;

    if !settings_path.exists() {
        // Create settings file with defaults on first launch
        let settings = Settings::default();
        save_settings(&settings)?;
        return Ok(settings);
    }

    let content = fs::read_to_string(&settings_path).map_err(|e| {
        AppError::StorageError(format!("Failed to read settings file: {}", e))
    })?;

    let settings: Settings = serde_json::from_str(&content).map_err(|e| {
        AppError::ParseError(format!("Failed to parse settings file: {}", e))
    })?;

    Ok(settings)
}

/// Save settings to disk atomically
pub fn save_settings(settings: &Settings) -> Result<(), AppError> {
    let settings_path = get_settings_file_path()?;

    let content = serde_json::to_string_pretty(settings).map_err(|e| {
        AppError::StorageError(format!("Failed to serialize settings: {}", e))
    })?;

    atomic_write(&settings_path, &content)
}

/// Initialize settings on app startup
///
/// Loads settings, validates custom storage path if set, falls back to default if invalid.
/// Returns the validated settings.
pub fn initialize_settings() -> Result<Settings, AppError> {
    let mut settings = load_settings()?;

    if let Some(ref custom_path) = settings.storage_path {
        let path = std::path::PathBuf::from(custom_path);
        if !path.exists() || validate_storage_path(custom_path).is_err() {
            eprintln!(
                "Warning: Custom storage path '{}' is invalid or inaccessible. Falling back to default.",
                custom_path
            );
            settings.storage_path = None;
            save_settings(&settings)?;
        }
    }

    let _ = get_effective_sessions_directory(&settings)?;

    Ok(settings)
}

/// Write content to file atomically (write to temp, then rename)
fn atomic_write(path: &PathBuf, content: &str) -> Result<(), AppError> {
    let temp_path = path.with_extension("tmp");

    // Write to temp file
    let mut file = File::create(&temp_path).map_err(|e| {
        AppError::StorageError(format!("Failed to create temp file: {}", e))
    })?;

    file.write_all(content.as_bytes()).map_err(|e| {
        AppError::StorageError(format!("Failed to write to temp file: {}", e))
    })?;

    // Sync to ensure data is on disk
    file.sync_all().map_err(|e| {
        AppError::StorageError(format!("Failed to sync temp file: {}", e))
    })?;

    // Atomic rename
    fs::rename(&temp_path, path).map_err(|e| {
        // Clean up temp file if rename fails
        let _ = fs::remove_file(&temp_path);
        AppError::StorageError(format!("Failed to rename temp file: {}", e))
    })?;

    Ok(())
}

/// Get the effective sessions directory based on settings
///
/// Returns the custom storage path if set, otherwise the default sessions directory.
pub fn get_effective_sessions_directory(settings: &Settings) -> Result<PathBuf, AppError> {
    match &settings.storage_path {
        Some(custom_path) => {
            let path = PathBuf::from(custom_path).join("sessions");
            // Ensure directory exists
            if !path.exists() {
                fs::create_dir_all(&path).map_err(|e| {
                    AppError::StorageError(format!("Failed to create sessions directory: {}", e))
                })?;
            }
            Ok(path)
        }
        None => {
            let data_dir = get_data_directory()?;
            let sessions_dir = data_dir.join("sessions");
            if !sessions_dir.exists() {
                fs::create_dir_all(&sessions_dir).map_err(|e| {
                    AppError::StorageError(format!("Failed to create sessions directory: {}", e))
                })?;
            }
            Ok(sessions_dir)
        }
    }
}

/// Validate that a path is writable
pub fn validate_storage_path(path: &str) -> Result<bool, AppError> {
    let path = PathBuf::from(path);

    // Check if path exists or can be created
    if !path.exists() {
        // Try to create the directory
        fs::create_dir_all(&path).map_err(|e| {
            AppError::StorageError(format!("Cannot create directory: {}", e))
        })?;
    }

    // Check if writable by creating a test file
    let test_file = path.join(".write_test");
    match File::create(&test_file) {
        Ok(_) => {
            let _ = fs::remove_file(test_file);
            Ok(true)
        }
        Err(e) => Err(AppError::StorageError(format!(
            "Path is not writable: {}",
            e
        ))),
    }
}

/// Migrate data files from old path to new path
pub fn migrate_storage(old_path: &PathBuf, new_path: &PathBuf) -> Result<(), AppError> {
    let old_sessions = old_path.join("sessions");
    let new_sessions = new_path.join("sessions");

    // Create new sessions directory
    fs::create_dir_all(&new_sessions).map_err(|e| {
        AppError::StorageError(format!("Failed to create new sessions directory: {}", e))
    })?;

    // Move all .md files from old to new
    if old_sessions.exists() {
        let entries = fs::read_dir(&old_sessions).map_err(|e| {
            AppError::StorageError(format!("Failed to read old sessions directory: {}", e))
        })?;

        for entry in entries {
            let entry = entry.map_err(|e| {
                AppError::StorageError(format!("Failed to read directory entry: {}", e))
            })?;

            let file_name = entry.file_name();
            let dest = new_sessions.join(&file_name);

            // Only move .md files
            if entry.path().extension().map(|e| e == "md").unwrap_or(false) {
                fs::rename(entry.path(), &dest).map_err(|e| {
                    AppError::StorageError(format!(
                        "Failed to move file {:?}: {}",
                        file_name, e
                    ))
                })?;
            }
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn test_default_settings() {
        let settings = Settings::default();

        assert_eq!(settings.focus_duration, 1500);
        assert_eq!(settings.break_duration, 300);
        assert!(settings.storage_path.is_none());
        assert!(settings.audio_enabled);
        assert_eq!(settings.character, "cat");
    }

    #[test]
    fn test_settings_serialization() {
        let settings = Settings::default();
        let json = serde_json::to_string_pretty(&settings).unwrap();

        assert!(json.contains("\"focusDuration\": 1500"));
        assert!(json.contains("\"breakDuration\": 300"));
        assert!(json.contains("\"storagePath\": null"));
        assert!(json.contains("\"audioEnabled\": true"));
        assert!(json.contains("\"character\": \"cat\""));
    }

    #[test]
    fn test_settings_deserialization() {
        let json = r#"{
            "focusDuration": 3000,
            "breakDuration": 600,
            "storagePath": "/custom/path",
            "audioEnabled": false,
            "character": "owl"
        }"#;

        let settings: Settings = serde_json::from_str(json).unwrap();

        assert_eq!(settings.focus_duration, 3000);
        assert_eq!(settings.break_duration, 600);
        assert_eq!(settings.storage_path, Some("/custom/path".to_string()));
        assert!(!settings.audio_enabled);
        assert_eq!(settings.character, "owl");
    }

    #[test]
    fn test_settings_deserialization_with_defaults() {
        // Test that missing fields get default values
        let json = r#"{
            "focusDuration": 2000
        }"#;

        let settings: Settings = serde_json::from_str(json).unwrap();

        assert_eq!(settings.focus_duration, 2000);
        assert_eq!(settings.break_duration, 300); // default
        assert!(settings.storage_path.is_none()); // default
        assert!(settings.audio_enabled); // default
        assert_eq!(settings.character, "cat"); // default
    }

    #[test]
    fn test_settings_round_trip() {
        let original = Settings {
            focus_duration: 1800,
            break_duration: 450,
            storage_path: Some("/my/path".to_string()),
            audio_enabled: false,
            character: "fox".to_string(),
        };

        let json = serde_json::to_string(&original).unwrap();
        let parsed: Settings = serde_json::from_str(&json).unwrap();

        assert_eq!(original, parsed);
    }

    #[test]
    fn test_validate_storage_path_creates_directory() {
        let temp = tempdir().unwrap();
        let new_path = temp.path().join("new_dir");

        let result = validate_storage_path(new_path.to_str().unwrap());
        assert!(result.is_ok());
        assert!(new_path.exists());
    }

    #[test]
    fn test_get_effective_sessions_directory_default() {
        let settings = Settings::default();
        let result = get_effective_sessions_directory(&settings);

        assert!(result.is_ok());
        let dir = result.unwrap();
        assert!(dir.ends_with("sessions"));
    }

    #[test]
    fn test_get_effective_sessions_directory_custom() {
        let temp = tempdir().unwrap();
        let settings = Settings {
            storage_path: Some(temp.path().to_str().unwrap().to_string()),
            ..Default::default()
        };

        let result = get_effective_sessions_directory(&settings);
        assert!(result.is_ok());

        let dir = result.unwrap();
        assert!(dir.ends_with("sessions"));
        assert!(dir.starts_with(temp.path()));
    }

    #[test]
    fn test_migrate_storage() {
        let old_dir = tempdir().unwrap();
        let new_dir = tempdir().unwrap();

        // Create old sessions directory with test files
        let old_sessions = old_dir.path().join("sessions");
        fs::create_dir_all(&old_sessions).unwrap();

        fs::write(old_sessions.join("2024-01-01.md"), "# Test").unwrap();
        fs::write(old_sessions.join("2024-01-02.md"), "# Test 2").unwrap();

        // Migrate
        let result = migrate_storage(&old_dir.path().to_path_buf(), &new_dir.path().to_path_buf());
        assert!(result.is_ok());

        // Verify files moved
        let new_sessions = new_dir.path().join("sessions");
        assert!(new_sessions.join("2024-01-01.md").exists());
        assert!(new_sessions.join("2024-01-02.md").exists());

        // Old files should be gone
        assert!(!old_sessions.join("2024-01-01.md").exists());
        assert!(!old_sessions.join("2024-01-02.md").exists());
    }

    #[test]
    fn test_data_directory_creation() {
        let result = get_data_directory();
        assert!(result.is_ok());

        let dir = result.unwrap();
        assert!(dir.exists());
        assert!(dir.ends_with("test-bmad"));
    }
}
