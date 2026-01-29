mod commands;
mod error;
mod events;
mod state;

use commands::timer;
use state::TimerStateWrapper;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to test-bmad!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(TimerStateWrapper::new())
        .invoke_handler(tauri::generate_handler![
            greet,
            timer::start_timer,
            timer::pause_timer,
            timer::resume_timer,
            timer::stop_timer,
            timer::get_timer_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
