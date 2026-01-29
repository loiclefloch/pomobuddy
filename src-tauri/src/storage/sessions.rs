//! Session file storage module
//!
//! Handles reading and writing session data to local `.md` files.
//! Files are stored in platform-specific app data directories.

use chrono::{DateTime, Local, NaiveDate, TimeZone};
use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

use crate::error::AppError;

/// Session completion status
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SessionStatus {
    Complete,
    Interrupted,
}

impl SessionStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            SessionStatus::Complete => "Complete",
            SessionStatus::Interrupted => "Interrupted",
        }
    }

    pub fn marker(&self) -> &'static str {
        match self {
            SessionStatus::Complete => "✓",
            SessionStatus::Interrupted => "○",
        }
    }
}

/// Type of session (focus or break)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SessionType {
    Focus,
    Break,
}

impl SessionType {
    pub fn as_str(&self) -> &'static str {
        match self {
            SessionType::Focus => "focus",
            SessionType::Break => "break",
        }
    }
}

/// A single session record
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    pub start_time: DateTime<Local>,
    pub end_time: DateTime<Local>,
    pub duration_seconds: u32,
    pub status: SessionStatus,
    pub session_type: SessionType,
}

impl Session {
    /// Create a new session
    pub fn new(
        start_time: DateTime<Local>,
        end_time: DateTime<Local>,
        status: SessionStatus,
        session_type: SessionType,
    ) -> Self {
        let duration_seconds = (end_time - start_time).num_seconds().max(0) as u32;
        Self {
            start_time,
            end_time,
            duration_seconds,
            status,
            session_type,
        }
    }

    /// Format session as markdown line
    pub fn to_markdown_line(&self) -> String {
        let start = self.start_time.format("%H:%M");
        let end = self.end_time.format("%H:%M");
        let marker = self.status.marker();
        let status = self.status.as_str();
        let minutes = self.duration_seconds / 60;
        format!("- {} - {} {} {} ({}m)", start, end, marker, status, minutes)
    }
}

/// Summary statistics for a day's sessions
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DailySummary {
    pub complete_count: u32,
    pub complete_minutes: u32,
    pub partial_count: u32,
    pub partial_minutes: u32,
    pub total_focus_minutes: u32,
}

impl DailySummary {
    /// Calculate summary from sessions
    pub fn from_sessions(sessions: &[Session]) -> Self {
        let mut summary = Self::default();
        
        for session in sessions {
            // Only count focus sessions in summary (not breaks)
            if session.session_type != SessionType::Focus {
                continue;
            }
            
            let minutes = session.duration_seconds / 60;
            match session.status {
                SessionStatus::Complete => {
                    summary.complete_count += 1;
                    summary.complete_minutes += minutes;
                }
                SessionStatus::Interrupted => {
                    summary.partial_count += 1;
                    summary.partial_minutes += minutes;
                }
            }
        }
        
        summary.total_focus_minutes = summary.complete_minutes + summary.partial_minutes;
        summary
    }

    /// Format summary as markdown
    pub fn to_markdown(&self) -> String {
        let mut lines = Vec::new();
        
        if self.complete_count > 0 || self.partial_count > 0 {
            if self.complete_count > 0 {
                lines.push(format!(
                    "- Complete: {} session{} ({}m)",
                    self.complete_count,
                    if self.complete_count == 1 { "" } else { "s" },
                    self.complete_minutes
                ));
            }
            if self.partial_count > 0 {
                lines.push(format!(
                    "- Partial: {} session{} ({}m)",
                    self.partial_count,
                    if self.partial_count == 1 { "" } else { "s" },
                    self.partial_minutes
                ));
            }
            lines.push(format!("- Total focus: {}m", self.total_focus_minutes));
        }
        
        lines.join("\n")
    }
}

/// Container for a daily session file
#[derive(Debug, Clone, Default)]
pub struct DailySessionFile {
    pub date: NaiveDate,
    pub sessions: Vec<Session>,
    pub summary: DailySummary,
}

impl DailySessionFile {
    /// Create a new daily file for given date
    pub fn new(date: NaiveDate) -> Self {
        Self {
            date,
            sessions: Vec::new(),
            summary: DailySummary::default(),
        }
    }

    /// Add a session and recalculate summary
    pub fn add_session(&mut self, session: Session) {
        self.sessions.push(session);
        self.summary = DailySummary::from_sessions(&self.sessions);
    }

    /// Generate full markdown content
    pub fn to_markdown(&self) -> String {
        let mut content = String::new();
        
        // Header
        content.push_str(&format!("# {}\n\n", self.date.format("%Y-%m-%d")));
        
        // Sessions section
        content.push_str("## Sessions\n");
        if self.sessions.is_empty() {
            content.push_str("*No sessions recorded*\n");
        } else {
            for session in &self.sessions {
                content.push_str(&session.to_markdown_line());
                content.push('\n');
            }
        }
        
        // Summary section
        content.push_str("\n## Summary\n");
        let summary_md = self.summary.to_markdown();
        if summary_md.is_empty() {
            content.push_str("*No focus sessions completed*\n");
        } else {
            content.push_str(&summary_md);
            content.push('\n');
        }
        
        content
    }

    /// Parse markdown content into DailySessionFile
    pub fn from_markdown(content: &str, date: NaiveDate) -> Result<Self, AppError> {
        let mut file = Self::new(date);
        
        let mut in_sessions_section = false;
        
        for line in content.lines() {
            let line = line.trim();
            
            // Track sections
            if line.starts_with("## Sessions") {
                in_sessions_section = true;
                continue;
            } else if line.starts_with("## ") {
                in_sessions_section = false;
                continue;
            }
            
            // Parse session lines
            if in_sessions_section && line.starts_with("- ") {
                if let Some(session) = parse_session_line(line, date) {
                    file.sessions.push(session);
                }
            }
        }
        
        file.summary = DailySummary::from_sessions(&file.sessions);
        Ok(file)
    }
}

/// Parse a single session line from markdown
fn parse_session_line(line: &str, date: NaiveDate) -> Option<Session> {
    // Format: "- HH:MM - HH:MM ✓ Complete (XXm)"
    // or:     "- HH:MM - HH:MM ○ Interrupted (XXm)"
    
    let line = line.strip_prefix("- ")?;
    
    // Parse start time
    let start_str = &line[0..5];
    let start_time_naive = chrono::NaiveTime::parse_from_str(start_str, "%H:%M").ok()?;
    
    // Skip " - "
    let rest = &line[8..];
    
    // Parse end time
    let end_str = &rest[0..5];
    let end_time_naive = chrono::NaiveTime::parse_from_str(end_str, "%H:%M").ok()?;
    
    // Parse status
    let status = if rest.contains("✓") || rest.contains("Complete") {
        SessionStatus::Complete
    } else {
        SessionStatus::Interrupted
    };
    
    // Parse duration from (XXm)
    let duration_seconds = if let Some(start) = rest.rfind('(') {
        if let Some(end) = rest.rfind('m') {
            let minutes_str = &rest[start + 1..end];
            minutes_str.parse::<u32>().unwrap_or(0) * 60
        } else {
            0
        }
    } else {
        0
    };
    
    // Construct DateTime<Local>
    let start_datetime = date.and_time(start_time_naive);
    let end_datetime = date.and_time(end_time_naive);
    
    // Convert to Local timezone
    let start_time = Local::now()
        .timezone()
        .from_local_datetime(&start_datetime)
        .single()?;
    let end_time = Local::now()
        .timezone()
        .from_local_datetime(&end_datetime)
        .single()?;
    
    Some(Session {
        start_time,
        end_time,
        duration_seconds,
        status,
        session_type: SessionType::Focus, // Default to focus when parsing
    })
}

/// Get the platform-specific data directory for sessions
pub fn get_sessions_directory() -> Result<PathBuf, AppError> {
    let data_dir = dirs::data_dir()
        .ok_or_else(|| AppError::StorageError("Could not determine data directory".to_string()))?;
    
    let sessions_dir = data_dir.join("test-bmad").join("sessions");
    
    // Create directory if it doesn't exist
    if !sessions_dir.exists() {
        fs::create_dir_all(&sessions_dir).map_err(|e| {
            AppError::StorageError(format!("Failed to create sessions directory: {}", e))
        })?;
    }
    
    Ok(sessions_dir)
}

/// Get the file path for a specific date
pub fn get_session_file_path(date: NaiveDate) -> Result<PathBuf, AppError> {
    let dir = get_sessions_directory()?;
    let filename = format!("{}.md", date.format("%Y-%m-%d"));
    Ok(dir.join(filename))
}

/// Save a session to the appropriate daily file (atomic write)
pub fn save_session(session: Session) -> Result<DailySessionFile, AppError> {
    let date = session.start_time.date_naive();
    let file_path = get_session_file_path(date)?;
    
    // Load existing file or create new one
    let mut daily_file = if file_path.exists() {
        let content = fs::read_to_string(&file_path).map_err(|e| {
            AppError::StorageError(format!("Failed to read session file: {}", e))
        })?;
        DailySessionFile::from_markdown(&content, date)?
    } else {
        DailySessionFile::new(date)
    };
    
    // Add session and recalculate summary
    daily_file.add_session(session);
    
    // Write atomically
    atomic_write(&file_path, &daily_file.to_markdown())?;
    
    Ok(daily_file)
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

/// Load sessions for a specific date
pub fn load_sessions_for_date(date: NaiveDate) -> Result<Vec<Session>, AppError> {
    let file_path = get_session_file_path(date)?;
    
    if !file_path.exists() {
        return Ok(Vec::new());
    }
    
    let content = fs::read_to_string(&file_path).map_err(|e| {
        AppError::StorageError(format!("Failed to read session file: {}", e))
    })?;
    
    let daily_file = DailySessionFile::from_markdown(&content, date)?;
    Ok(daily_file.sessions)
}

/// Load today's sessions
pub fn load_today_sessions() -> Result<Vec<Session>, AppError> {
    let today = Local::now().date_naive();
    load_sessions_for_date(today)
}

/// Get daily summary for a specific date
pub fn get_daily_summary(date: NaiveDate) -> Result<DailySummary, AppError> {
    let sessions = load_sessions_for_date(date)?;
    Ok(DailySummary::from_sessions(&sessions))
}

/// Get today's summary
pub fn get_today_summary() -> Result<DailySummary, AppError> {
    let today = Local::now().date_naive();
    get_daily_summary(today)
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::{Datelike, TimeZone};

    fn create_test_session(
        hour: u32,
        minute: u32,
        duration_minutes: u32,
        status: SessionStatus,
    ) -> Session {
        let date = Local::now().date_naive();
        let start = Local
            .with_ymd_and_hms(date.year(), date.month(), date.day(), hour, minute, 0)
            .single()
            .unwrap();
        let end = start + chrono::Duration::minutes(duration_minutes as i64);
        
        Session {
            start_time: start,
            end_time: end,
            duration_seconds: duration_minutes * 60,
            status,
            session_type: SessionType::Focus,
        }
    }

    #[test]
    fn test_session_to_markdown_line() {
        let session = create_test_session(9, 15, 25, SessionStatus::Complete);
        let line = session.to_markdown_line();
        
        assert!(line.contains("09:15"));
        assert!(line.contains("✓"));
        assert!(line.contains("Complete"));
        assert!(line.contains("25m"));
    }

    #[test]
    fn test_session_to_markdown_line_interrupted() {
        let session = create_test_session(10, 0, 14, SessionStatus::Interrupted);
        let line = session.to_markdown_line();
        
        assert!(line.contains("10:00"));
        assert!(line.contains("○"));
        assert!(line.contains("Interrupted"));
        assert!(line.contains("14m"));
    }

    #[test]
    fn test_daily_summary_from_sessions() {
        let sessions = vec![
            create_test_session(9, 0, 25, SessionStatus::Complete),
            create_test_session(10, 0, 25, SessionStatus::Complete),
            create_test_session(11, 0, 14, SessionStatus::Interrupted),
        ];
        
        let summary = DailySummary::from_sessions(&sessions);
        
        assert_eq!(summary.complete_count, 2);
        assert_eq!(summary.complete_minutes, 50);
        assert_eq!(summary.partial_count, 1);
        assert_eq!(summary.partial_minutes, 14);
        assert_eq!(summary.total_focus_minutes, 64);
    }

    #[test]
    fn test_daily_summary_to_markdown() {
        let summary = DailySummary {
            complete_count: 2,
            complete_minutes: 50,
            partial_count: 1,
            partial_minutes: 14,
            total_focus_minutes: 64,
        };
        
        let md = summary.to_markdown();
        
        assert!(md.contains("Complete: 2 sessions (50m)"));
        assert!(md.contains("Partial: 1 session (14m)"));
        assert!(md.contains("Total focus: 64m"));
    }

    #[test]
    fn test_daily_file_to_markdown() {
        let today = Local::now().date_naive();
        let mut daily_file = DailySessionFile::new(today);
        
        daily_file.add_session(create_test_session(9, 15, 25, SessionStatus::Complete));
        daily_file.add_session(create_test_session(10, 2, 14, SessionStatus::Interrupted));
        
        let md = daily_file.to_markdown();
        
        assert!(md.contains(&format!("# {}", today.format("%Y-%m-%d"))));
        assert!(md.contains("## Sessions"));
        assert!(md.contains("09:15"));
        assert!(md.contains("✓ Complete"));
        assert!(md.contains("○ Interrupted"));
        assert!(md.contains("## Summary"));
    }

    #[test]
    fn test_parse_session_line() {
        let today = Local::now().date_naive();
        let line = "- 09:15 - 09:40 ✓ Complete (25m)";
        
        let session = parse_session_line(line, today).unwrap();
        
        assert_eq!(session.status, SessionStatus::Complete);
        assert_eq!(session.duration_seconds, 25 * 60);
    }

    #[test]
    fn test_daily_file_round_trip() {
        let today = Local::now().date_naive();
        let mut original = DailySessionFile::new(today);
        
        original.add_session(create_test_session(9, 15, 25, SessionStatus::Complete));
        original.add_session(create_test_session(10, 2, 14, SessionStatus::Interrupted));
        original.add_session(create_test_session(14, 30, 25, SessionStatus::Complete));
        
        let md = original.to_markdown();
        let parsed = DailySessionFile::from_markdown(&md, today).unwrap();
        
        assert_eq!(parsed.sessions.len(), 3);
        assert_eq!(parsed.summary.complete_count, 2);
        assert_eq!(parsed.summary.partial_count, 1);
    }

    #[test]
    fn test_sessions_directory_creation() {
        let result = get_sessions_directory();
        assert!(result.is_ok());
        
        let dir = result.unwrap();
        assert!(dir.exists());
        assert!(dir.ends_with("sessions"));
    }

    #[test]
    fn test_empty_daily_file() {
        let today = Local::now().date_naive();
        let daily_file = DailySessionFile::new(today);
        
        let md = daily_file.to_markdown();
        
        assert!(md.contains("## Sessions"));
        assert!(md.contains("*No sessions recorded*"));
        assert!(md.contains("## Summary"));
        assert!(md.contains("*No focus sessions completed*"));
    }

    #[test]
    fn test_break_sessions_not_counted_in_summary() {
        let today = Local::now().date_naive();
        let start = Local::now();
        let end = start + chrono::Duration::minutes(5);
        
        let break_session = Session {
            start_time: start,
            end_time: end,
            duration_seconds: 300,
            status: SessionStatus::Complete,
            session_type: SessionType::Break,
        };
        
        let mut daily_file = DailySessionFile::new(today);
        daily_file.add_session(break_session);
        
        // Break sessions should not be counted
        assert_eq!(daily_file.summary.complete_count, 0);
        assert_eq!(daily_file.summary.total_focus_minutes, 0);
    }
}
