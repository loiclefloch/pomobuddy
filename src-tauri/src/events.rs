use serde::Serialize;

/// Event payload for timer tick updates sent to frontend
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimerTickPayload {
    pub remaining_seconds: u32,
    pub status: String,
}

/// Event payload for session completion notifications
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionCompletePayload {
    pub session_type: String,
    pub duration_seconds: u32,
    pub completed_at: String,
}

/// Event payload for session saved notifications (sent to frontend after any session is persisted)
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionSavedPayload {
    pub session_type: String,
    pub status: String,
    pub duration_seconds: u32,
    pub complete_count: u32,
    pub partial_count: u32,
    pub total_focus_minutes: u32,
}

/// Event payload for streak updates (sent to frontend when streak changes)
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreakUpdatedPayload {
    pub current_streak: u32,
    pub longest_streak: u32,
}
