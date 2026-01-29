use thiserror::Error;

#[derive(Error, Debug)]
pub enum TimerError {
    #[error("Timer state lock poisoned")]
    LockPoisoned,

    #[error("Invalid timer state transition: cannot {action} when status is {current_status}")]
    InvalidTransition {
        action: String,
        current_status: String,
    },

    #[error("Failed to emit event: {0}")]
    EventEmitFailed(String),
}

impl From<TimerError> for String {
    fn from(error: TimerError) -> Self {
        error.to_string()
    }
}

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Storage error: {0}")]
    StorageError(String),

    #[error("Parse error: {0}")]
    ParseError(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}

impl From<AppError> for String {
    fn from(error: AppError) -> Self {
        error.to_string()
    }
}

impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}
