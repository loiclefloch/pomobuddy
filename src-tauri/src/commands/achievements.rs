use crate::error::AppError;
use crate::storage::achievements::{
    get_achievements_with_status, get_total_session_count, AchievementWithStatus,
};

#[tauri::command]
pub fn get_achievements() -> Result<Vec<AchievementWithStatus>, AppError> {
    get_achievements_with_status()
}

#[tauri::command]
pub fn get_total_sessions() -> Result<u32, AppError> {
    get_total_session_count()
}
