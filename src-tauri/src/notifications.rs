use tauri_plugin_notification::NotificationExt;

pub fn send_focus_complete_notification(app: &tauri::AppHandle) {
    if let Err(e) = app
        .notification()
        .builder()
        .title("Focus Session Complete")
        .body("Great work! Time for a 5-minute break.")
        .show()
    {
        eprintln!("Failed to send focus complete notification: {}", e);
    }
}

pub fn send_break_complete_notification(app: &tauri::AppHandle) {
    if let Err(e) = app
        .notification()
        .builder()
        .title("Break Complete")
        .body("Ready for another focus session?")
        .show()
    {
        eprintln!("Failed to send break complete notification: {}", e);
    }
}
