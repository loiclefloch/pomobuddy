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
