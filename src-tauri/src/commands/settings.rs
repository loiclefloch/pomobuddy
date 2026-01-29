use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

use crate::storage::settings::{
    get_data_directory, get_effective_sessions_directory, load_settings, migrate_storage,
    save_settings, validate_storage_path, Settings,
};

#[tauri::command]
pub async fn get_settings() -> Result<Settings, String> {
    load_settings().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_settings(settings: Settings) -> Result<(), String> {
    save_settings(&settings).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn pick_storage_folder(app: AppHandle) -> Result<Option<String>, String> {
    let folder = app
        .dialog()
        .file()
        .set_title("Select Storage Location")
        .blocking_pick_folder();

    Ok(folder.map(|p| p.to_string()))
}

#[tauri::command]
pub async fn change_storage_location(new_path: String) -> Result<(), String> {
    validate_storage_path(&new_path).map_err(|e| e.to_string())?;

    let mut settings = load_settings().map_err(|e| e.to_string())?;
    let old_sessions_dir = get_effective_sessions_directory(&settings).map_err(|e| e.to_string())?;

    let new_path_buf = std::path::PathBuf::from(&new_path);

    if settings.storage_path.as_ref().map(|p| p.as_str()) != Some(&new_path) {
        migrate_storage(&old_sessions_dir.parent().unwrap().to_path_buf(), &new_path_buf)
            .map_err(|e| e.to_string())?;
    }

    settings.storage_path = Some(new_path);
    save_settings(&settings).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn reset_storage_location() -> Result<(), String> {
    let mut settings = load_settings().map_err(|e| e.to_string())?;

    if settings.storage_path.is_some() {
        let custom_path = std::path::PathBuf::from(settings.storage_path.as_ref().unwrap());
        let default_dir = get_data_directory().map_err(|e| e.to_string())?;

        migrate_storage(&custom_path, &default_dir).map_err(|e| e.to_string())?;

        settings.storage_path = None;
        save_settings(&settings).map_err(|e| e.to_string())?;
    }

    Ok(())
}
