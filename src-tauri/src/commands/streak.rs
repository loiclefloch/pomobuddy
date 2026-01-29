use crate::error::AppError;
use crate::storage::achievements::{get_streak_data, StreakDataResponse};

#[tauri::command]
pub fn get_streak_data_cmd() -> Result<StreakDataResponse, AppError> {
    get_streak_data()
}
