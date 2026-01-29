use crate::error::TimerError;
use crate::events::{SessionCompletePayload, TimerTickPayload};
use crate::state::{TimerState, TimerStateWrapper, TimerStatus, BREAK_DURATION_SECONDS, FOCUS_DURATION_SECONDS};
use chrono::Utc;
use std::sync::Arc;
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter, State};

#[tauri::command]
pub fn start_timer(
    state: State<'_, TimerStateWrapper>,
    app: AppHandle,
) -> Result<TimerState, String> {
    let mut timer = state
        .state
        .lock()
        .map_err(|_| TimerError::LockPoisoned.to_string())?;

    if timer.status != TimerStatus::Idle {
        return Err(TimerError::InvalidTransition {
            action: "start".to_string(),
            current_status: timer.status.as_str().to_string(),
        }
        .to_string());
    }

    timer.start_focus();
    let current_state = timer.clone();
    drop(timer);

    if !state.is_running() {
        state.set_running(true);
        spawn_timer_thread(state.state.clone(), state.running.clone(), app);
    }

    Ok(current_state)
}

#[tauri::command]
pub fn pause_timer(state: State<'_, TimerStateWrapper>) -> Result<TimerState, String> {
    let mut timer = state
        .state
        .lock()
        .map_err(|_| TimerError::LockPoisoned.to_string())?;

    if !timer.pause() {
        return Err(TimerError::InvalidTransition {
            action: "pause".to_string(),
            current_status: timer.status.as_str().to_string(),
        }
        .to_string());
    }

    Ok(timer.clone())
}

#[tauri::command]
pub fn resume_timer(state: State<'_, TimerStateWrapper>) -> Result<TimerState, String> {
    let mut timer = state
        .state
        .lock()
        .map_err(|_| TimerError::LockPoisoned.to_string())?;

    if !timer.resume() {
        return Err(TimerError::InvalidTransition {
            action: "resume".to_string(),
            current_status: timer.status.as_str().to_string(),
        }
        .to_string());
    }

    Ok(timer.clone())
}

#[tauri::command]
pub fn stop_timer(state: State<'_, TimerStateWrapper>) -> Result<TimerState, String> {
    state.set_running(false);

    let mut timer = state
        .state
        .lock()
        .map_err(|_| TimerError::LockPoisoned.to_string())?;

    timer.stop();

    Ok(timer.clone())
}

#[tauri::command]
pub fn get_timer_state(state: State<'_, TimerStateWrapper>) -> Result<TimerState, String> {
    let timer = state
        .state
        .lock()
        .map_err(|_| TimerError::LockPoisoned.to_string())?;

    Ok(timer.clone())
}

fn spawn_timer_thread(
    state: Arc<std::sync::Mutex<TimerState>>,
    running: Arc<std::sync::atomic::AtomicBool>,
    app: AppHandle,
) {
    thread::spawn(move || {
        let tick_interval = Duration::from_secs(1);
        let mut next_tick = Instant::now() + tick_interval;

        while running.load(std::sync::atomic::Ordering::SeqCst) {
            let now = Instant::now();
            if now < next_tick {
                thread::sleep(next_tick - now);
            }
            next_tick += tick_interval;

            let mut timer = match state.lock() {
                Ok(guard) => guard,
                Err(_) => break,
            };

            if timer.status == TimerStatus::Paused {
                continue;
            }

            if timer.tick() {
                let payload = TimerTickPayload {
                    remaining_seconds: timer.remaining_seconds,
                    status: timer.status.as_str().to_string(),
                };
                let _ = app.emit("TimerTick", payload);
            }

            if timer.is_complete() {
                let session_type = timer.status.as_str().to_string();
                let duration = match timer.status {
                    TimerStatus::Focus => FOCUS_DURATION_SECONDS,
                    TimerStatus::Break => BREAK_DURATION_SECONDS,
                    _ => 0,
                };

                let complete_payload = SessionCompletePayload {
                    session_type: session_type.clone(),
                    duration_seconds: duration,
                    completed_at: Utc::now().to_rfc3339(),
                };
                let _ = app.emit("SessionComplete", complete_payload);

                if timer.status == TimerStatus::Focus {
                    timer.start_break();
                    let tick_payload = TimerTickPayload {
                        remaining_seconds: timer.remaining_seconds,
                        status: timer.status.as_str().to_string(),
                    };
                    let _ = app.emit("TimerTick", tick_payload);
                } else {
                    timer.stop();
                    running.store(false, std::sync::atomic::Ordering::SeqCst);
                    let tick_payload = TimerTickPayload {
                        remaining_seconds: 0,
                        status: "idle".to_string(),
                    };
                    let _ = app.emit("TimerTick", tick_payload);
                    break;
                }
            }
        }
    });
}
