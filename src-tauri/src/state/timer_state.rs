use chrono::{DateTime, Utc};
use serde::Serialize;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};

pub const FOCUS_DURATION_SECONDS: u32 = 1500; // 25 minutes
pub const BREAK_DURATION_SECONDS: u32 = 300;  // 5 minutes

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum TimerStatus {
    Idle,
    Focus,
    Break,
    Paused,
}

impl TimerStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            TimerStatus::Idle => "idle",
            TimerStatus::Focus => "focus",
            TimerStatus::Break => "break",
            TimerStatus::Paused => "paused",
        }
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimerState {
    pub status: TimerStatus,
    pub remaining_seconds: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub session_start_time: Option<DateTime<Utc>>,
    #[serde(skip)]
    pub paused_status: Option<TimerStatus>,
}

impl Default for TimerState {
    fn default() -> Self {
        Self {
            status: TimerStatus::Idle,
            remaining_seconds: 0,
            session_start_time: None,
            paused_status: None,
        }
    }
}

impl TimerState {
    pub fn start_focus(&mut self) {
        self.status = TimerStatus::Focus;
        self.remaining_seconds = FOCUS_DURATION_SECONDS;
        self.session_start_time = Some(Utc::now());
        self.paused_status = None;
    }

    pub fn start_break(&mut self) {
        self.status = TimerStatus::Break;
        self.remaining_seconds = BREAK_DURATION_SECONDS;
        self.session_start_time = Some(Utc::now());
        self.paused_status = None;
    }

    pub fn pause(&mut self) -> bool {
        match self.status {
            TimerStatus::Focus | TimerStatus::Break => {
                self.paused_status = Some(self.status);
                self.status = TimerStatus::Paused;
                true
            }
            _ => false,
        }
    }

    pub fn resume(&mut self) -> bool {
        if self.status == TimerStatus::Paused {
            if let Some(previous) = self.paused_status.take() {
                self.status = previous;
                return true;
            }
        }
        false
    }

    pub fn stop(&mut self) {
        self.status = TimerStatus::Idle;
        self.remaining_seconds = 0;
        self.session_start_time = None;
        self.paused_status = None;
    }

    pub fn tick(&mut self) -> bool {
        if self.remaining_seconds > 0
            && (self.status == TimerStatus::Focus || self.status == TimerStatus::Break)
        {
            self.remaining_seconds -= 1;
            true
        } else {
            false
        }
    }

    pub fn is_complete(&self) -> bool {
        self.remaining_seconds == 0
            && (self.status == TimerStatus::Focus || self.status == TimerStatus::Break)
    }

    pub fn session_duration(&self) -> u32 {
        match self.status {
            TimerStatus::Focus => FOCUS_DURATION_SECONDS - self.remaining_seconds,
            TimerStatus::Break => BREAK_DURATION_SECONDS - self.remaining_seconds,
            _ => 0,
        }
    }
}

pub struct TimerStateWrapper {
    pub state: Arc<Mutex<TimerState>>,
    pub running: Arc<AtomicBool>,
}

impl TimerStateWrapper {
    pub fn new() -> Self {
        Self {
            state: Arc::new(Mutex::new(TimerState::default())),
            running: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn is_running(&self) -> bool {
        self.running.load(Ordering::SeqCst)
    }

    pub fn set_running(&self, running: bool) {
        self.running.store(running, Ordering::SeqCst);
    }
}

impl Default for TimerStateWrapper {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_state_is_idle() {
        let state = TimerState::default();
        assert_eq!(state.status, TimerStatus::Idle);
        assert_eq!(state.remaining_seconds, 0);
        assert!(state.session_start_time.is_none());
    }

    #[test]
    fn test_start_focus_sets_correct_state() {
        let mut state = TimerState::default();
        state.start_focus();

        assert_eq!(state.status, TimerStatus::Focus);
        assert_eq!(state.remaining_seconds, FOCUS_DURATION_SECONDS);
        assert!(state.session_start_time.is_some());
    }

    #[test]
    fn test_start_break_sets_correct_state() {
        let mut state = TimerState::default();
        state.start_break();

        assert_eq!(state.status, TimerStatus::Break);
        assert_eq!(state.remaining_seconds, BREAK_DURATION_SECONDS);
        assert!(state.session_start_time.is_some());
    }

    #[test]
    fn test_pause_from_focus() {
        let mut state = TimerState::default();
        state.start_focus();

        assert!(state.pause());
        assert_eq!(state.status, TimerStatus::Paused);
        assert_eq!(state.paused_status, Some(TimerStatus::Focus));
    }

    #[test]
    fn test_pause_from_idle_fails() {
        let mut state = TimerState::default();
        assert!(!state.pause());
        assert_eq!(state.status, TimerStatus::Idle);
    }

    #[test]
    fn test_resume_after_pause() {
        let mut state = TimerState::default();
        state.start_focus();
        state.remaining_seconds = 1000;
        state.pause();

        assert!(state.resume());
        assert_eq!(state.status, TimerStatus::Focus);
        assert_eq!(state.remaining_seconds, 1000);
    }

    #[test]
    fn test_resume_without_pause_fails() {
        let mut state = TimerState::default();
        state.start_focus();

        assert!(!state.resume());
        assert_eq!(state.status, TimerStatus::Focus);
    }

    #[test]
    fn test_stop_resets_state() {
        let mut state = TimerState::default();
        state.start_focus();
        state.remaining_seconds = 500;

        state.stop();

        assert_eq!(state.status, TimerStatus::Idle);
        assert_eq!(state.remaining_seconds, 0);
        assert!(state.session_start_time.is_none());
    }

    #[test]
    fn test_tick_decrements_seconds() {
        let mut state = TimerState::default();
        state.start_focus();

        assert!(state.tick());
        assert_eq!(state.remaining_seconds, FOCUS_DURATION_SECONDS - 1);
    }

    #[test]
    fn test_tick_does_nothing_when_paused() {
        let mut state = TimerState::default();
        state.start_focus();
        state.remaining_seconds = 100;
        state.pause();

        assert!(!state.tick());
        assert_eq!(state.remaining_seconds, 100);
    }

    #[test]
    fn test_is_complete() {
        let mut state = TimerState::default();
        state.start_focus();
        state.remaining_seconds = 0;

        assert!(state.is_complete());
    }

    #[test]
    fn test_session_duration() {
        let mut state = TimerState::default();
        state.start_focus();
        state.remaining_seconds = 1200;

        assert_eq!(state.session_duration(), 300);
    }
}
