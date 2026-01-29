mod commands;
mod error;
mod events;
mod notifications;
mod state;
mod tray;

use commands::app;
use commands::timer;
use commands::stats;
use state::TimerStateWrapper;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to test-bmad!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
            app::quit_app,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
