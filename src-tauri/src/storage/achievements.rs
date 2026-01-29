//! Achievements storage module
//!
//! Handles reading and writing achievement data including streaks to `achievements.json`.
//! Files are stored in platform-specific app data directories (AR9 specification).

use chrono::{Local, NaiveDate};
use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

use crate::error::AppError;
use crate::storage::sessions::{get_sessions_directory, SessionStatus};
use crate::storage::settings::get_data_directory;

/// Achievement data structure matching AR9 specification
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AchievementsData {
    #[serde(default)]
    pub unlocked: Vec<String>,

    #[serde(default)]
    pub current_streak: u32,

    #[serde(default)]
    pub longest_streak: u32,

    #[serde(default)]
    pub total_sessions: u32,

    #[serde(default)]
    pub last_streak_date: Option<String>,
}

impl Default for AchievementsData {
    fn default() -> Self {
        Self {
            unlocked: Vec::new(),
            current_streak: 0,
            longest_streak: 0,
            total_sessions: 0,
            last_streak_date: None,
        }
    }
}

/// Streak data response for IPC commands
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreakDataResponse {
    pub current_streak: u32,
    pub longest_streak: u32,
    pub last_streak_date: Option<String>,
}

impl From<&AchievementsData> for StreakDataResponse {
    fn from(data: &AchievementsData) -> Self {
        Self {
            current_streak: data.current_streak,
            longest_streak: data.longest_streak,
            last_streak_date: data.last_streak_date.clone(),
        }
    }
}

pub fn get_achievements_file_path() -> Result<PathBuf, AppError> {
    let data_dir = get_data_directory()?;
    Ok(data_dir.join("achievements.json"))
}

pub fn load_achievements() -> Result<AchievementsData, AppError> {
    let achievements_path = get_achievements_file_path()?;

    if !achievements_path.exists() {
        let achievements = AchievementsData::default();
        save_achievements(&achievements)?;
        return Ok(achievements);
    }

    let content = fs::read_to_string(&achievements_path).map_err(|e| {
        AppError::StorageError(format!("Failed to read achievements file: {}", e))
    })?;

    let achievements: AchievementsData = serde_json::from_str(&content).map_err(|e| {
        AppError::ParseError(format!("Failed to parse achievements file: {}", e))
    })?;

    Ok(achievements)
}

pub fn save_achievements(achievements: &AchievementsData) -> Result<(), AppError> {
    let achievements_path = get_achievements_file_path()?;

    let content = serde_json::to_string_pretty(achievements).map_err(|e| {
        AppError::StorageError(format!("Failed to serialize achievements: {}", e))
    })?;

    atomic_write(&achievements_path, &content)
}

fn atomic_write(path: &PathBuf, content: &str) -> Result<(), AppError> {
    let temp_path = path.with_extension("tmp");

    let mut file = File::create(&temp_path).map_err(|e| {
        AppError::StorageError(format!("Failed to create temp file: {}", e))
    })?;

    file.write_all(content.as_bytes()).map_err(|e| {
        AppError::StorageError(format!("Failed to write to temp file: {}", e))
    })?;

    file.sync_all().map_err(|e| {
        AppError::StorageError(format!("Failed to sync temp file: {}", e))
    })?;

    fs::rename(&temp_path, path).map_err(|e| {
        let _ = fs::remove_file(&temp_path);
        AppError::StorageError(format!("Failed to rename temp file: {}", e))
    })?;

    Ok(())
}

fn has_complete_session_on_date(date: NaiveDate) -> Result<bool, AppError> {
    let sessions_dir = get_sessions_directory()?;
    let file_path = sessions_dir.join(format!("{}.md", date.format("%Y-%m-%d")));

    if !file_path.exists() {
        return Ok(false);
    }

    let content = fs::read_to_string(&file_path).map_err(|e| {
        AppError::StorageError(format!("Failed to read session file: {}", e))
    })?;

    Ok(content.contains("✓") && content.contains("Complete"))
}

/// Calculate streak by scanning session files backwards from today.
/// Returns (current_streak, longest_streak) tuple.
/// Only counts days with at least one completed session.
pub fn calculate_streak() -> Result<(u32, u32), AppError> {
    let mut current_streak: u32;
    let mut date = Local::now().date_naive();
    let today = date;

    let achievements = load_achievements()?;
    let mut longest_streak = achievements.longest_streak;

    let today_has_session = has_complete_session_on_date(today)?;

    if today_has_session {
        current_streak = 1;
        date = match date.pred_opt() {
            Some(d) => d,
            None => return Ok((current_streak, longest_streak.max(current_streak))),
        };
    } else {
        date = match date.pred_opt() {
            Some(d) => d,
            None => return Ok((0, longest_streak)),
        };

        if !has_complete_session_on_date(date)? {
            return Ok((0, longest_streak));
        }

        current_streak = 1;
        date = match date.pred_opt() {
            Some(d) => d,
            None => return Ok((current_streak, longest_streak.max(current_streak))),
        };
    }

    loop {
        if has_complete_session_on_date(date)? {
            current_streak += 1;
            date = match date.pred_opt() {
                Some(d) => d,
                None => break,
            };
        } else {
            break;
        }
    }

    longest_streak = longest_streak.max(current_streak);

    Ok((current_streak, longest_streak))
}

/// Update streak after a COMPLETE session is saved. Interrupted sessions don't count.
pub fn update_streak_on_completion(session_status: SessionStatus) -> Result<AchievementsData, AppError> {
    if session_status != SessionStatus::Complete {
        return load_achievements();
    }

    let mut achievements = load_achievements()?;
    let today = Local::now().date_naive();
    let today_str = today.format("%Y-%m-%d").to_string();

    if achievements.last_streak_date.as_ref() == Some(&today_str) {
        achievements.total_sessions += 1;
        save_achievements(&achievements)?;
        return Ok(achievements);
    }

    let (current_streak, longest_streak) = calculate_streak()?;

    achievements.current_streak = current_streak;
    achievements.longest_streak = longest_streak;
    achievements.last_streak_date = Some(today_str);
    achievements.total_sessions += 1;

    save_achievements(&achievements)?;

    Ok(achievements)
}

/// Recalculate streak on app startup to handle missed days while app was closed.
pub fn recalculate_streak_on_startup() -> Result<AchievementsData, AppError> {
    let mut achievements = load_achievements()?;
    
    let (current_streak, longest_streak) = calculate_streak()?;
    
    if achievements.current_streak != current_streak || achievements.longest_streak != longest_streak {
        achievements.current_streak = current_streak;
        achievements.longest_streak = longest_streak;
        save_achievements(&achievements)?;
    }

    Ok(achievements)
}

pub fn get_streak_data() -> Result<StreakDataResponse, AppError> {
    let achievements = load_achievements()?;
    Ok(StreakDataResponse::from(&achievements))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_achievements() {
        let achievements = AchievementsData::default();

        assert!(achievements.unlocked.is_empty());
        assert_eq!(achievements.current_streak, 0);
        assert_eq!(achievements.longest_streak, 0);
        assert_eq!(achievements.total_sessions, 0);
        assert!(achievements.last_streak_date.is_none());
    }

    #[test]
    fn test_achievements_serialization() {
        let achievements = AchievementsData {
            unlocked: vec!["first-session".to_string()],
            current_streak: 7,
            longest_streak: 14,
            total_sessions: 42,
            last_streak_date: Some("2026-01-29".to_string()),
        };

        let json = serde_json::to_string_pretty(&achievements).unwrap();

        assert!(json.contains("\"currentStreak\": 7"));
        assert!(json.contains("\"longestStreak\": 14"));
        assert!(json.contains("\"totalSessions\": 42"));
        assert!(json.contains("\"lastStreakDate\": \"2026-01-29\""));
        assert!(json.contains("\"first-session\""));
    }

    #[test]
    fn test_achievements_deserialization() {
        let json = r#"{
            "unlocked": ["first-session", "week-streak"],
            "currentStreak": 7,
            "longestStreak": 14,
            "totalSessions": 42,
            "lastStreakDate": "2026-01-29"
        }"#;

        let achievements: AchievementsData = serde_json::from_str(json).unwrap();

        assert_eq!(achievements.unlocked.len(), 2);
        assert_eq!(achievements.current_streak, 7);
        assert_eq!(achievements.longest_streak, 14);
        assert_eq!(achievements.total_sessions, 42);
        assert_eq!(achievements.last_streak_date, Some("2026-01-29".to_string()));
    }

    #[test]
    fn test_achievements_deserialization_with_defaults() {
        let json = r#"{
            "currentStreak": 5
        }"#;

        let achievements: AchievementsData = serde_json::from_str(json).unwrap();

        assert_eq!(achievements.current_streak, 5);
        assert_eq!(achievements.longest_streak, 0);
        assert_eq!(achievements.total_sessions, 0);
        assert!(achievements.unlocked.is_empty());
        assert!(achievements.last_streak_date.is_none());
    }

    #[test]
    fn test_achievements_round_trip() {
        let original = AchievementsData {
            unlocked: vec!["badge1".to_string(), "badge2".to_string()],
            current_streak: 10,
            longest_streak: 20,
            total_sessions: 100,
            last_streak_date: Some("2026-01-29".to_string()),
        };

        let json = serde_json::to_string(&original).unwrap();
        let parsed: AchievementsData = serde_json::from_str(&json).unwrap();

        assert_eq!(original, parsed);
    }

    #[test]
    fn test_streak_data_response_from_achievements() {
        let achievements = AchievementsData {
            unlocked: vec![],
            current_streak: 7,
            longest_streak: 14,
            total_sessions: 42,
            last_streak_date: Some("2026-01-29".to_string()),
        };

        let response = StreakDataResponse::from(&achievements);

        assert_eq!(response.current_streak, 7);
        assert_eq!(response.longest_streak, 14);
        assert_eq!(response.last_streak_date, Some("2026-01-29".to_string()));
    }

    #[test]
    fn test_streak_response_serialization() {
        let response = StreakDataResponse {
            current_streak: 5,
            longest_streak: 10,
            last_streak_date: Some("2026-01-28".to_string()),
        };

        let json = serde_json::to_string(&response).unwrap();

        assert!(json.contains("\"currentStreak\":5"));
        assert!(json.contains("\"longestStreak\":10"));
        assert!(json.contains("\"lastStreakDate\":\"2026-01-28\""));
    }

    #[test]
    fn test_update_streak_skips_interrupted_sessions() {
        let achievements = AchievementsData {
            current_streak: 5,
            longest_streak: 10,
            total_sessions: 20,
            ..Default::default()
        };

        let json_before = serde_json::to_string(&achievements).unwrap();
        let parsed_before: AchievementsData = serde_json::from_str(&json_before).unwrap();

        assert_eq!(parsed_before.current_streak, 5);
        assert_eq!(parsed_before.longest_streak, 10);
    }

    #[test]
    fn test_longest_streak_preserved_when_current_resets() {
        let achievements = AchievementsData {
            current_streak: 3,
            longest_streak: 10,
            total_sessions: 50,
            ..Default::default()
        };

        assert!(achievements.longest_streak >= achievements.current_streak);
        assert_eq!(achievements.longest_streak, 10);
    }

    #[test]
    fn test_streak_data_includes_all_fields() {
        let achievements = AchievementsData {
            unlocked: vec!["test".to_string()],
            current_streak: 7,
            longest_streak: 14,
            total_sessions: 100,
            last_streak_date: Some("2026-01-29".to_string()),
        };

        let response = StreakDataResponse::from(&achievements);

        assert_eq!(response.current_streak, achievements.current_streak);
        assert_eq!(response.longest_streak, achievements.longest_streak);
        assert_eq!(response.last_streak_date, achievements.last_streak_date);
    }
}
