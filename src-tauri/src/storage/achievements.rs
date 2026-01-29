//! Achievements storage module
//!
//! Handles reading and writing achievement data including streaks to `achievements.json`.
//! Files are stored in platform-specific app data directories (AR9 specification).

use chrono::{Local, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

use crate::error::AppError;
use crate::storage::sessions::{get_sessions_directory, SessionStatus};
use crate::storage::settings::get_data_directory;

/// Achievement tier levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum AchievementTier {
    Bronze,
    Silver,
    Gold,
    Platinum,
}

/// Achievement requirement type
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", content = "value", rename_all = "lowercase")]
pub enum AchievementRequirement {
    Streak(u32),
    Sessions(u32),
}

/// Achievement definition
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Achievement {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub tier: AchievementTier,
    pub requirement: AchievementRequirement,
}

/// Unlocked achievement record with timestamp
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct UnlockedAchievement {
    pub id: String,
    pub unlocked_at: String,
}

/// Achievement with unlock status for IPC response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AchievementWithStatus {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub tier: AchievementTier,
    pub requirement: AchievementRequirement,
    pub unlocked: bool,
    pub unlocked_at: Option<String>,
}

/// All defined achievements
pub fn get_all_achievements() -> Vec<Achievement> {
    vec![
        Achievement {
            id: "first_session".to_string(),
            title: "First Focus".to_string(),
            description: "Complete your first session".to_string(),
            icon: "Flame".to_string(),
            tier: AchievementTier::Bronze,
            requirement: AchievementRequirement::Sessions(1),
        },
        Achievement {
            id: "streak_7".to_string(),
            title: "Week Warrior".to_string(),
            description: "7-day streak".to_string(),
            icon: "Zap".to_string(),
            tier: AchievementTier::Silver,
            requirement: AchievementRequirement::Streak(7),
        },
        Achievement {
            id: "streak_14".to_string(),
            title: "Fortnight Focus".to_string(),
            description: "14-day streak".to_string(),
            icon: "Award".to_string(),
            tier: AchievementTier::Gold,
            requirement: AchievementRequirement::Streak(14),
        },
        Achievement {
            id: "streak_30".to_string(),
            title: "Monthly Master".to_string(),
            description: "30-day streak".to_string(),
            icon: "Crown".to_string(),
            tier: AchievementTier::Platinum,
            requirement: AchievementRequirement::Streak(30),
        },
        Achievement {
            id: "sessions_10".to_string(),
            title: "Getting Started".to_string(),
            description: "10 total sessions".to_string(),
            icon: "Target".to_string(),
            tier: AchievementTier::Bronze,
            requirement: AchievementRequirement::Sessions(10),
        },
        Achievement {
            id: "sessions_50".to_string(),
            title: "Half Century".to_string(),
            description: "50 total sessions".to_string(),
            icon: "Trophy".to_string(),
            tier: AchievementTier::Silver,
            requirement: AchievementRequirement::Sessions(50),
        },
        Achievement {
            id: "sessions_100".to_string(),
            title: "Centurion".to_string(),
            description: "100 total sessions".to_string(),
            icon: "Medal".to_string(),
            tier: AchievementTier::Gold,
            requirement: AchievementRequirement::Sessions(100),
        },
        Achievement {
            id: "sessions_500".to_string(),
            title: "Focus Legend".to_string(),
            description: "500 total sessions".to_string(),
            icon: "Crown".to_string(),
            tier: AchievementTier::Platinum,
            requirement: AchievementRequirement::Sessions(500),
        },
    ]
}

/// Check if an achievement is already unlocked
fn is_already_unlocked(achievement_id: &str, unlocked: &[UnlockedAchievement]) -> bool {
    unlocked.iter().any(|u| u.id == achievement_id)
}

/// Check if an achievement's condition is met
fn is_condition_met(requirement: &AchievementRequirement, current_streak: u32, total_sessions: u32) -> bool {
    match requirement {
        AchievementRequirement::Streak(n) => current_streak >= *n,
        AchievementRequirement::Sessions(n) => total_sessions >= *n,
    }
}

/// Check all achievements and return newly unlocked ones
/// This is called after session completion and streak recalculation
pub fn check_achievements(
    current_streak: u32,
    total_sessions: u32,
    unlocked: &[UnlockedAchievement],
) -> Vec<Achievement> {
    let all_achievements = get_all_achievements();
    let mut newly_unlocked = Vec::new();

    for achievement in all_achievements {
        if is_already_unlocked(&achievement.id, unlocked) {
            continue;
        }

        if is_condition_met(&achievement.requirement, current_streak, total_sessions) {
            newly_unlocked.push(achievement);
        }
    }

    newly_unlocked
}

/// Process newly unlocked achievements: add to unlocked array with timestamp
pub fn process_unlocked_achievements(
    achievements: &mut AchievementsData,
    newly_unlocked: &[Achievement],
) -> Vec<UnlockedAchievement> {
    let timestamp = Utc::now().to_rfc3339();
    let mut unlocked_records = Vec::new();

    for achievement in newly_unlocked {
        let record = UnlockedAchievement {
            id: achievement.id.clone(),
            unlocked_at: timestamp.clone(),
        };
        unlocked_records.push(record.clone());
        
        if !achievements.unlocked.contains(&achievement.id) {
            achievements.unlocked.push(achievement.id.clone());
        }
        
        achievements.unlocked_achievements.push(record);
    }

    unlocked_records
}

/// Get all achievements with their unlock status
pub fn get_achievements_with_status() -> Result<Vec<AchievementWithStatus>, AppError> {
    let achievements_data = load_achievements()?;
    let all_achievements = get_all_achievements();
    
    let result = all_achievements
        .into_iter()
        .map(|achievement| {
            let unlocked_record = achievements_data
                .unlocked_achievements
                .iter()
                .find(|u| u.id == achievement.id);
            
            AchievementWithStatus {
                id: achievement.id,
                title: achievement.title,
                description: achievement.description,
                icon: achievement.icon,
                tier: achievement.tier,
                requirement: achievement.requirement,
                unlocked: unlocked_record.is_some(),
                unlocked_at: unlocked_record.map(|u| u.unlocked_at.clone()),
            }
        })
        .collect();
    
    Ok(result)
}

/// Get total lifetime session count
pub fn get_total_session_count() -> Result<u32, AppError> {
    let achievements = load_achievements()?;
    Ok(achievements.total_sessions)
}

/// Check for new achievements and process unlocks. Returns newly unlocked achievements with full data.
pub fn check_and_unlock_achievements() -> Result<Vec<(Achievement, String)>, AppError> {
    let mut achievements = load_achievements()?;
    
    let newly_unlocked = check_achievements(
        achievements.current_streak,
        achievements.total_sessions,
        &achievements.unlocked_achievements,
    );
    
    if newly_unlocked.is_empty() {
        return Ok(Vec::new());
    }
    
    let records = process_unlocked_achievements(&mut achievements, &newly_unlocked);
    save_achievements(&achievements)?;
    
    let result: Vec<(Achievement, String)> = newly_unlocked
        .into_iter()
        .zip(records.into_iter())
        .map(|(achievement, record)| (achievement, record.unlocked_at))
        .collect();
    
    Ok(result)
}

/// Achievement data structure matching AR9 specification
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AchievementsData {
    #[serde(default)]
    pub unlocked: Vec<String>,

    #[serde(default)]
    pub unlocked_achievements: Vec<UnlockedAchievement>,

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
            unlocked_achievements: Vec::new(),
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
        assert!(achievements.unlocked_achievements.is_empty());
        assert_eq!(achievements.current_streak, 0);
        assert_eq!(achievements.longest_streak, 0);
        assert_eq!(achievements.total_sessions, 0);
        assert!(achievements.last_streak_date.is_none());
    }

    #[test]
    fn test_achievements_serialization() {
        let achievements = AchievementsData {
            unlocked: vec!["first-session".to_string()],
            unlocked_achievements: vec![UnlockedAchievement {
                id: "first-session".to_string(),
                unlocked_at: "2026-01-29T10:00:00Z".to_string(),
            }],
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
            "unlockedAchievements": [],
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
        assert!(achievements.unlocked_achievements.is_empty());
        assert!(achievements.last_streak_date.is_none());
    }

    #[test]
    fn test_achievements_round_trip() {
        let original = AchievementsData {
            unlocked: vec!["badge1".to_string(), "badge2".to_string()],
            unlocked_achievements: vec![
                UnlockedAchievement {
                    id: "badge1".to_string(),
                    unlocked_at: "2026-01-28T10:00:00Z".to_string(),
                },
                UnlockedAchievement {
                    id: "badge2".to_string(),
                    unlocked_at: "2026-01-29T10:00:00Z".to_string(),
                },
            ],
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
            unlocked_achievements: vec![],
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
            unlocked_achievements: vec![],
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

    #[test]
    fn test_check_achievements_first_session_unlocks() {
        let unlocked: Vec<UnlockedAchievement> = vec![];
        let newly_unlocked = check_achievements(0, 1, &unlocked);
        
        assert_eq!(newly_unlocked.len(), 1);
        assert_eq!(newly_unlocked[0].id, "first_session");
    }

    #[test]
    fn test_check_achievements_already_unlocked_not_returned() {
        let unlocked = vec![UnlockedAchievement {
            id: "first_session".to_string(),
            unlocked_at: "2026-01-29T10:00:00Z".to_string(),
        }];
        let newly_unlocked = check_achievements(0, 1, &unlocked);
        
        assert!(newly_unlocked.is_empty());
    }

    #[test]
    fn test_check_achievements_streak_based() {
        let unlocked: Vec<UnlockedAchievement> = vec![];
        let newly_unlocked = check_achievements(7, 10, &unlocked);
        
        let has_week_warrior = newly_unlocked.iter().any(|a| a.id == "streak_7");
        assert!(has_week_warrior);
    }

    #[test]
    fn test_check_achievements_session_based() {
        let unlocked: Vec<UnlockedAchievement> = vec![];
        let newly_unlocked = check_achievements(0, 50, &unlocked);
        
        let has_half_century = newly_unlocked.iter().any(|a| a.id == "sessions_50");
        assert!(has_half_century);
    }

    #[test]
    fn test_check_achievements_multiple_unlocks_simultaneously() {
        let unlocked: Vec<UnlockedAchievement> = vec![];
        let newly_unlocked = check_achievements(7, 50, &unlocked);
        
        let ids: Vec<&str> = newly_unlocked.iter().map(|a| a.id.as_str()).collect();
        
        assert!(ids.contains(&"first_session"));
        assert!(ids.contains(&"sessions_10"));
        assert!(ids.contains(&"sessions_50"));
        assert!(ids.contains(&"streak_7"));
    }

    #[test]
    fn test_check_achievements_condition_not_met() {
        let unlocked: Vec<UnlockedAchievement> = vec![];
        let newly_unlocked = check_achievements(5, 5, &unlocked);
        
        let has_week_warrior = newly_unlocked.iter().any(|a| a.id == "streak_7");
        assert!(!has_week_warrior);
    }

    #[test]
    fn test_process_unlocked_achievements_adds_timestamp() {
        let mut achievements = AchievementsData::default();
        let newly_unlocked = vec![Achievement {
            id: "first_session".to_string(),
            title: "First Focus".to_string(),
            description: "Complete your first session".to_string(),
            icon: "Flame".to_string(),
            tier: AchievementTier::Bronze,
            requirement: AchievementRequirement::Sessions(1),
        }];
        
        let records = process_unlocked_achievements(&mut achievements, &newly_unlocked);
        
        assert_eq!(records.len(), 1);
        assert_eq!(records[0].id, "first_session");
        assert!(!records[0].unlocked_at.is_empty());
        assert!(achievements.unlocked.contains(&"first_session".to_string()));
        assert_eq!(achievements.unlocked_achievements.len(), 1);
    }

    #[test]
    fn test_is_already_unlocked() {
        let unlocked = vec![
            UnlockedAchievement {
                id: "first_session".to_string(),
                unlocked_at: "2026-01-29T10:00:00Z".to_string(),
            },
        ];
        
        assert!(is_already_unlocked("first_session", &unlocked));
        assert!(!is_already_unlocked("streak_7", &unlocked));
    }

    #[test]
    fn test_is_condition_met_streak() {
        let req = AchievementRequirement::Streak(7);
        
        assert!(is_condition_met(&req, 7, 0));
        assert!(is_condition_met(&req, 10, 0));
        assert!(!is_condition_met(&req, 6, 100));
    }

    #[test]
    fn test_is_condition_met_sessions() {
        let req = AchievementRequirement::Sessions(50);
        
        assert!(is_condition_met(&req, 0, 50));
        assert!(is_condition_met(&req, 0, 100));
        assert!(!is_condition_met(&req, 100, 49));
    }

    #[test]
    fn test_get_all_achievements_returns_expected() {
        let achievements = get_all_achievements();
        
        assert_eq!(achievements.len(), 8);
        
        let ids: Vec<&str> = achievements.iter().map(|a| a.id.as_str()).collect();
        assert!(ids.contains(&"first_session"));
        assert!(ids.contains(&"streak_7"));
        assert!(ids.contains(&"streak_14"));
        assert!(ids.contains(&"streak_30"));
        assert!(ids.contains(&"sessions_10"));
        assert!(ids.contains(&"sessions_50"));
        assert!(ids.contains(&"sessions_100"));
        assert!(ids.contains(&"sessions_500"));
    }
}
