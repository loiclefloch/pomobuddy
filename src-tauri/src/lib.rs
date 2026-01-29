mod commands;
mod error;
mod events;
mod notifications;
mod state;
mod storage;
mod tray;

use commands::app;
use commands::session;
use commands::stats;
use commands::timer;
use state::TimerStateWrapper;
use storage::recovery::check_and_recover_session;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to test-bmad!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    if let Ok(Some(recovered)) = check_and_recover_session() {
        eprintln!(
            "Recovered interrupted session: {} minutes of {}",
            recovered.duration_seconds / 60,
            recovered.session_type.as_str()
        );
    }
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .manage(TimerStateWrapper::new())
        .setup(|app| {
            if let Err(e) = tray::setup_tray(app.handle()) {
                eprintln!("Failed to setup tray: {}", e);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            timer::start_timer,
            timer::pause_timer,
            timer::resume_timer,
            timer::stop_timer,
            timer::get_timer_state,
            stats::get_quick_stats,
            stats::get_today_stats,
            stats::get_session_history,
            session::save_session_cmd,
            session::get_sessions_for_date,
            session::get_today_sessions,
            session::save_completed_session,
            session::save_interrupted_session,
            app::quit_app,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
