use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QuickStatsResponse {
    pub current_streak: u32,
    pub today_sessions: u32,
    pub today_focus_minutes: u32,
}

#[tauri::command]
pub fn get_quick_stats() -> QuickStatsResponse {
    QuickStatsResponse {
        current_streak: 0,
        today_sessions: 0,
        today_focus_minutes: 0,
    }
}
