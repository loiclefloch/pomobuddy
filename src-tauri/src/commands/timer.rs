use crate::error::TimerError;
use crate::events::{SessionCompletePayload, SessionSavedPayload, StreakUpdatedPayload, TimerTickPayload};
use crate::notifications::{send_break_complete_notification, send_focus_complete_notification};
use crate::state::{TimerState, TimerStateWrapper, TimerStatus, BREAK_DURATION_SECONDS, FOCUS_DURATION_SECONDS};
use crate::storage::recovery::{create_recovery_file, delete_recovery_file, update_recovery_tick};
use crate::storage::sessions::{save_session, Session, SessionStatus, SessionType, get_today_summary};
use crate::storage::achievements::update_streak_on_completion;
use crate::tray::update_tray_icon;
use chrono::{Local, Utc};
use std::sync::Arc;
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter, State};

fn emit_session_saved(app: &AppHandle, session_type: SessionType, status: SessionStatus, duration_seconds: u32) {
    if let Ok(summary) = get_today_summary() {
        let payload = SessionSavedPayload {
            session_type: session_type.as_str().to_string(),
            status: status.as_str().to_string(),
            duration_seconds,
            complete_count: summary.complete_count,
            partial_count: summary.partial_count,
            total_focus_minutes: summary.total_focus_minutes,
        };
        let _ = app.emit("SessionSaved", payload);
    }
    
    if status == SessionStatus::Complete && session_type == SessionType::Focus {
        if let Ok(achievements) = update_streak_on_completion(status) {
            let streak_payload = StreakUpdatedPayload {
                current_streak: achievements.current_streak,
                longest_streak: achievements.longest_streak,
            };
            let _ = app.emit("StreakUpdated", streak_payload);
        }
    }
}

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
    update_tray_icon(&app, "focus");
    
    if let Err(e) = create_recovery_file(SessionType::Focus) {
        eprintln!("Failed to create recovery file: {}", e);
    }
    
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
pub fn stop_timer(state: State<'_, TimerStateWrapper>, app: AppHandle) -> Result<TimerState, String> {
    state.set_running(false);

    let mut timer = state
        .state
        .lock()
        .map_err(|_| TimerError::LockPoisoned.to_string())?;

    // Save interrupted session if timer was active (focus or paused focus)
    let is_active_focus_session = matches!(timer.status, TimerStatus::Focus | TimerStatus::Paused) 
        && timer.paused_status != Some(TimerStatus::Break);
    
    if let (Some(start_time), true) = (timer.session_start_time, is_active_focus_session) {
        let session_type = if timer.status == TimerStatus::Paused {
            match timer.paused_status {
                Some(TimerStatus::Focus) => SessionType::Focus,
                Some(TimerStatus::Break) => SessionType::Break,
                _ => SessionType::Focus,
            }
        } else {
            match timer.status {
                TimerStatus::Focus => SessionType::Focus,
                TimerStatus::Break => SessionType::Break,
                _ => SessionType::Focus,
            }
        };

        let start_local = start_time.with_timezone(&Local);
        let end_local = Local::now();
        let duration_seconds = (end_local - start_local).num_seconds().max(0) as u32;
        let session = Session::new(start_local, end_local, SessionStatus::Interrupted, session_type);
        
        if let Err(e) = save_session(session) {
            eprintln!("Failed to save interrupted session: {}", e);
        } else {
            emit_session_saved(&app, session_type, SessionStatus::Interrupted, duration_seconds);
        }
    }

    timer.stop();
    update_tray_icon(&app, "idle");
    
    if let Err(e) = delete_recovery_file() {
        eprintln!("Failed to delete recovery file: {}", e);
    }

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
        let mut tick_count: u32 = 0;
        const RECOVERY_UPDATE_INTERVAL: u32 = 30;

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
                tick_count += 1;
                
                let payload = TimerTickPayload {
                    remaining_seconds: timer.remaining_seconds,
                    status: timer.status.as_str().to_string(),
                };
                let _ = app.emit("TimerTick", payload);
                
                if tick_count % RECOVERY_UPDATE_INTERVAL == 0 && timer.status == TimerStatus::Focus {
                    let _ = update_recovery_tick();
                }
            }

            if timer.is_complete() {
                let session_type = timer.status.as_str().to_string();
                let duration = match timer.status {
                    TimerStatus::Focus => FOCUS_DURATION_SECONDS,
                    TimerStatus::Break => BREAK_DURATION_SECONDS,
                    _ => 0,
                };

                if let Some(start_time) = timer.session_start_time {
                    let storage_session_type = match timer.status {
                        TimerStatus::Focus => SessionType::Focus,
                        TimerStatus::Break => SessionType::Break,
                        _ => SessionType::Focus,
                    };
                    let start_local = start_time.with_timezone(&Local);
                    let end_local = Local::now();
                    let session = Session::new(start_local, end_local, SessionStatus::Complete, storage_session_type);
                    
                    if let Err(e) = save_session(session) {
                        eprintln!("Failed to save completed session: {}", e);
                    } else {
                        emit_session_saved(&app, storage_session_type, SessionStatus::Complete, duration);
                    }
                }
                
                if timer.status == TimerStatus::Focus {
                    let _ = delete_recovery_file();
                }

                let complete_payload = SessionCompletePayload {
                    session_type: session_type.clone(),
                    duration_seconds: duration,
                    completed_at: Utc::now().to_rfc3339(),
                };
                let _ = app.emit("SessionComplete", complete_payload);

                if timer.status == TimerStatus::Focus {
                    send_focus_complete_notification(&app);
                    timer.start_break();
                    update_tray_icon(&app, "break");
                    let tick_payload = TimerTickPayload {
                        remaining_seconds: timer.remaining_seconds,
                        status: timer.status.as_str().to_string(),
                    };
                    let _ = app.emit("TimerTick", tick_payload);
                } else {
                    send_break_complete_notification(&app);
                    timer.stop();
                    update_tray_icon(&app, "idle");
                    running.store(false, std::sync::atomic::Ordering::SeqCst);
                    let _ = delete_recovery_file();
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
