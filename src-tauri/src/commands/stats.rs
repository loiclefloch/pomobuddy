use chrono::{Duration, Local};
use serde::Serialize;

use crate::error::AppError;
use crate::storage::sessions::{
    get_today_summary, load_sessions_for_date, DailySummary, Session, SessionStatus,
};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QuickStatsResponse {
    pub current_streak: u32,
    pub today_sessions: u32,
    pub today_focus_minutes: u32,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TodayStatsResponse {
    pub completed_count: u32,
    pub interrupted_count: u32,
    pub total_focus_minutes: u32,
}

impl From<DailySummary> for TodayStatsResponse {
    fn from(summary: DailySummary) -> Self {
        TodayStatsResponse {
            completed_count: summary.complete_count,
            interrupted_count: summary.partial_count,
            total_focus_minutes: summary.total_focus_minutes,
        }
    }
}

#[tauri::command]
pub fn get_quick_stats() -> Result<QuickStatsResponse, AppError> {
    let summary = get_today_summary()?;
    
    Ok(QuickStatsResponse {
        current_streak: 0, // Streak calculation not implemented yet (Epic 4)
        today_sessions: summary.complete_count + summary.partial_count,
        today_focus_minutes: summary.total_focus_minutes,
    })
}

#[tauri::command]
pub fn get_today_stats() -> Result<TodayStatsResponse, AppError> {
    let summary = get_today_summary()?;
    Ok(TodayStatsResponse::from(summary))
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionSummary {
    pub start_time: String,
    pub end_time: String,
    pub duration_seconds: u32,
    pub status: String,
}

impl From<&Session> for SessionSummary {
    fn from(session: &Session) -> Self {
        SessionSummary {
            start_time: session.start_time.to_rfc3339(),
            end_time: session.end_time.to_rfc3339(),
            duration_seconds: session.duration_seconds,
            status: match session.status {
                SessionStatus::Complete => "complete".to_string(),
                SessionStatus::Interrupted => "interrupted".to_string(),
            },
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DayHistory {
    pub date: String,
    pub sessions: Vec<SessionSummary>,
    pub total_complete: u32,
    pub total_interrupted: u32,
    pub total_minutes: u32,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionHistoryResponse {
    pub days: Vec<DayHistory>,
    pub has_more: bool,
    pub total_days: u32,
}

#[tauri::command]
pub fn get_session_history(days: Option<u32>) -> Result<SessionHistoryResponse, AppError> {
    let days_to_fetch = days.unwrap_or(7);
    let today = Local::now().date_naive();

    let mut day_histories: Vec<DayHistory> = Vec::new();
    let mut total_days_with_sessions = 0u32;

    for i in 0..days_to_fetch {
        let date = today - Duration::days(i as i64);
        let sessions = load_sessions_for_date(date)?;

        if !sessions.is_empty() {
            total_days_with_sessions += 1;

            let mut total_complete = 0u32;
            let mut total_interrupted = 0u32;
            let mut total_minutes = 0u32;

            let mut session_summaries: Vec<SessionSummary> = sessions
                .iter()
                .map(|s| {
                    match s.status {
                        SessionStatus::Complete => total_complete += 1,
                        SessionStatus::Interrupted => total_interrupted += 1,
                    }
                    total_minutes += s.duration_seconds / 60;
                    SessionSummary::from(s)
                })
                .collect();

            session_summaries.sort_by(|a, b| b.start_time.cmp(&a.start_time));

            day_histories.push(DayHistory {
                date: date.format("%Y-%m-%d").to_string(),
                sessions: session_summaries,
                total_complete,
                total_interrupted,
                total_minutes,
            });
        }
    }

    Ok(SessionHistoryResponse {
        days: day_histories,
        has_more: false,
        total_days: total_days_with_sessions,
    })
}
