//! Session crash recovery module
//!
//! Handles recovery of sessions interrupted by app crashes or force quits.
//! Uses a recovery file that tracks active session state.

use chrono::{DateTime, Local, Utc};
use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

use crate::error::AppError;
use crate::storage::sessions::{save_session, Session, SessionStatus, SessionType};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecoveryData {
    pub session_start: DateTime<Utc>,
    pub session_type: String,
    pub last_tick: DateTime<Utc>,
}

fn get_recovery_file_path() -> Result<PathBuf, AppError> {
    let data_dir = dirs::data_dir()
        .ok_or_else(|| AppError::StorageError("Could not determine data directory".to_string()))?;
    
    let app_dir = data_dir.join("test-bmad");
    
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir).map_err(|e| {
            AppError::StorageError(format!("Failed to create app directory: {}", e))
        })?;
    }
    
    Ok(app_dir.join(".session_recovery.json"))
}

pub fn create_recovery_file(session_type: SessionType) -> Result<(), AppError> {
    let recovery_path = get_recovery_file_path()?;
    let now = Utc::now();
    
    let data = RecoveryData {
        session_start: now,
        session_type: session_type.as_str().to_string(),
        last_tick: now,
    };
    
    let json = serde_json::to_string_pretty(&data).map_err(|e| {
        AppError::StorageError(format!("Failed to serialize recovery data: {}", e))
    })?;
    
    let mut file = File::create(&recovery_path).map_err(|e| {
        AppError::StorageError(format!("Failed to create recovery file: {}", e))
    })?;
    
    file.write_all(json.as_bytes()).map_err(|e| {
        AppError::StorageError(format!("Failed to write recovery file: {}", e))
    })?;
    
    file.sync_all().map_err(|e| {
        AppError::StorageError(format!("Failed to sync recovery file: {}", e))
    })?;
    
    Ok(())
}

pub fn update_recovery_tick() -> Result<(), AppError> {
    let recovery_path = get_recovery_file_path()?;
    
    if !recovery_path.exists() {
        return Ok(());
    }
    
    let content = fs::read_to_string(&recovery_path).map_err(|e| {
        AppError::StorageError(format!("Failed to read recovery file: {}", e))
    })?;
    
    let mut data: RecoveryData = serde_json::from_str(&content).map_err(|e| {
        AppError::StorageError(format!("Failed to parse recovery file: {}", e))
    })?;
    
    data.last_tick = Utc::now();
    
    let json = serde_json::to_string_pretty(&data).map_err(|e| {
        AppError::StorageError(format!("Failed to serialize recovery data: {}", e))
    })?;
    
    let mut file = File::create(&recovery_path).map_err(|e| {
        AppError::StorageError(format!("Failed to update recovery file: {}", e))
    })?;
    
    file.write_all(json.as_bytes()).map_err(|e| {
        AppError::StorageError(format!("Failed to write recovery file: {}", e))
    })?;
    
    Ok(())
}

pub fn delete_recovery_file() -> Result<(), AppError> {
    let recovery_path = get_recovery_file_path()?;
    
    if recovery_path.exists() {
        fs::remove_file(&recovery_path).map_err(|e| {
            AppError::StorageError(format!("Failed to delete recovery file: {}", e))
        })?;
    }
    
    Ok(())
}

pub fn check_and_recover_session() -> Result<Option<Session>, AppError> {
    let recovery_path = get_recovery_file_path()?;
    
    if !recovery_path.exists() {
        return Ok(None);
    }
    
    let content = fs::read_to_string(&recovery_path).map_err(|e| {
        AppError::StorageError(format!("Failed to read recovery file: {}", e))
    })?;
    
    let data: RecoveryData = serde_json::from_str(&content).map_err(|e| {
        delete_recovery_file().ok();
        AppError::StorageError(format!("Failed to parse recovery file (deleted corrupt file): {}", e))
    })?;
    
    let session_type = match data.session_type.as_str() {
        "focus" => SessionType::Focus,
        "break" => SessionType::Break,
        _ => SessionType::Focus,
    };
    
    // Only recover focus sessions (breaks are not critical)
    if session_type != SessionType::Focus {
        delete_recovery_file()?;
        return Ok(None);
    }
    
    let start_local = data.session_start.with_timezone(&Local);
    let end_local = data.last_tick.with_timezone(&Local);
    
    let session = Session::new(start_local, end_local, SessionStatus::Interrupted, session_type);
    
    save_session(session.clone())?;
    
    delete_recovery_file()?;
    
    Ok(Some(session))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::thread;
    use std::time::Duration;

    #[test]
    fn test_recovery_file_lifecycle() {
        create_recovery_file(SessionType::Focus).unwrap();
        
        let recovery_path = get_recovery_file_path().unwrap();
        assert!(recovery_path.exists());
        
        thread::sleep(Duration::from_millis(10));
        update_recovery_tick().unwrap();
        
        let content = fs::read_to_string(&recovery_path).unwrap();
        let data: RecoveryData = serde_json::from_str(&content).unwrap();
        assert_eq!(data.session_type, "focus");
        
        delete_recovery_file().unwrap();
        assert!(!recovery_path.exists());
    }

    #[test]
    fn test_recovery_check_no_file() {
        let result = check_and_recover_session().unwrap();
        assert!(result.is_none());
    }

    #[test]
    fn test_delete_nonexistent_file_is_ok() {
        let recovery_path = get_recovery_file_path().unwrap();
        if recovery_path.exists() {
            fs::remove_file(&recovery_path).unwrap();
        }
        
        let result = delete_recovery_file();
        assert!(result.is_ok());
    }
}
