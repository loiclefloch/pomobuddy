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
