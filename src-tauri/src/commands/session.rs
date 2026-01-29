use chrono::{Local, NaiveDate};
use tauri::State;

use crate::state::TimerStateWrapper;
use crate::storage::sessions::{
    load_sessions_for_date, load_today_sessions, save_session, DailySummary, Session,
    SessionStatus, SessionType,
};

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionResponse {
    pub sessions: Vec<Session>,
    pub summary: DailySummary,
}

#[tauri::command]
pub fn save_session_cmd(
    start_time: String,
    end_time: String,
    status: String,
    session_type: String,
) -> Result<SessionResponse, String> {
    let start = chrono::DateTime::parse_from_rfc3339(&start_time)
        .map_err(|e| format!("Invalid start_time: {}", e))?
        .with_timezone(&Local);

    let end = chrono::DateTime::parse_from_rfc3339(&end_time)
        .map_err(|e| format!("Invalid end_time: {}", e))?
        .with_timezone(&Local);

    let status = match status.to_lowercase().as_str() {
        "complete" => SessionStatus::Complete,
        "interrupted" => SessionStatus::Interrupted,
        _ => return Err(format!("Invalid status: {}", status)),
    };

    let session_type = match session_type.to_lowercase().as_str() {
        "focus" => SessionType::Focus,
        "break" => SessionType::Break,
        _ => return Err(format!("Invalid session_type: {}", session_type)),
    };

    let session = Session::new(start, end, status, session_type);
    let daily_file = save_session(session).map_err(|e| e.to_string())?;

    Ok(SessionResponse {
        sessions: daily_file.sessions,
        summary: daily_file.summary,
    })
}

#[tauri::command]
pub fn get_sessions_for_date(date: String) -> Result<SessionResponse, String> {
    let naive_date = NaiveDate::parse_from_str(&date, "%Y-%m-%d")
        .map_err(|e| format!("Invalid date format (expected YYYY-MM-DD): {}", e))?;

    let sessions = load_sessions_for_date(naive_date).map_err(|e| e.to_string())?;
    let summary = DailySummary::from_sessions(&sessions);

    Ok(SessionResponse { sessions, summary })
}

#[tauri::command]
pub fn get_today_sessions() -> Result<SessionResponse, String> {
    let sessions = load_today_sessions().map_err(|e| e.to_string())?;
    let summary = DailySummary::from_sessions(&sessions);

    Ok(SessionResponse { sessions, summary })
}

#[tauri::command]
pub fn save_completed_session(
    _timer_state: State<'_, TimerStateWrapper>,
    start_time: String,
    duration_seconds: u32,
    session_type: String,
) -> Result<SessionResponse, String> {
    let start = chrono::DateTime::parse_from_rfc3339(&start_time)
        .map_err(|e| format!("Invalid start_time: {}", e))?
        .with_timezone(&Local);

    let end = start + chrono::Duration::seconds(duration_seconds as i64);

    let session_type = match session_type.to_lowercase().as_str() {
        "focus" => SessionType::Focus,
        "break" => SessionType::Break,
        _ => return Err(format!("Invalid session_type: {}", session_type)),
    };

    let session = Session::new(start, end, SessionStatus::Complete, session_type);
    let daily_file = save_session(session).map_err(|e| e.to_string())?;

    Ok(SessionResponse {
        sessions: daily_file.sessions,
        summary: daily_file.summary,
    })
}

#[tauri::command]
pub fn save_interrupted_session(
    _timer_state: State<'_, TimerStateWrapper>,
    start_time: String,
    elapsed_seconds: u32,
    session_type: String,
) -> Result<SessionResponse, String> {
    let start = chrono::DateTime::parse_from_rfc3339(&start_time)
        .map_err(|e| format!("Invalid start_time: {}", e))?
        .with_timezone(&Local);

    let end = start + chrono::Duration::seconds(elapsed_seconds as i64);

    let session_type = match session_type.to_lowercase().as_str() {
        "focus" => SessionType::Focus,
        "break" => SessionType::Break,
        _ => return Err(format!("Invalid session_type: {}", session_type)),
    };

    let session = Session::new(start, end, SessionStatus::Interrupted, session_type);
    let daily_file = save_session(session).map_err(|e| e.to_string())?;

    Ok(SessionResponse {
        sessions: daily_file.sessions,
        summary: daily_file.summary,
    })
}
