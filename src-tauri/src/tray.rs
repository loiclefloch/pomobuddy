use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, PhysicalPosition,
};

const TRAY_ID: &str = "main";

pub fn setup_tray(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let show = MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?;
    let hide = MenuItem::with_id(app, "hide", "Hide Window", true, None::<&str>)?;
    let show_timer = MenuItem::with_id(app, "show_timer", "Show Timer", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&show_timer, &show, &hide, &quit])?;

    let icon = load_icon("idle")?;

    let _tray = TrayIconBuilder::with_id(TRAY_ID)
        .icon(icon)
        .icon_as_template(true)
        .tooltip("test-bmad - Focus Timer")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.show();
                    let _ = w.set_focus();
                }
            }
            "hide" => {
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.hide();
                }
            }
            "show_timer" => {
                toggle_tray_window(app);
            }
            "quit" => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                position,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("tray") {
                    if window.is_visible().unwrap_or(false) {
                        let _ = window.hide();
                    } else {
                        let x = position.x as i32 - 140;
                        let y = position.y as i32 + 5;
                        let _ = window.set_position(PhysicalPosition::new(x, y));
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
        })
        .build(app)?;

    Ok(())
}

fn toggle_tray_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("tray") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            let _ = window.show();
            let _ = window.set_focus();
        }
    }
}

pub fn update_tray_icon(app: &AppHandle, status: &str) {
    let icon = match load_icon(status) {
        Ok(i) => i,
        Err(e) => {
            eprintln!("Failed to load tray icon for status '{}': {}", status, e);
            return;
        }
    };

    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        if let Err(e) = tray.set_icon(Some(icon)) {
            eprintln!("Failed to set tray icon: {}", e);
        }
    }
}

fn load_icon(status: &str) -> Result<Image<'static>, Box<dyn std::error::Error>> {
    let icon_name = match status {
        "focus" => "tray-focus.png",
        "break" => "tray-break.png",
        _ => "tray-idle.png",
    };

    let icon_bytes = match icon_name {
        "tray-focus.png" => include_bytes!("../../public/assets/icons/tray/tray-focus.png").as_slice(),
        "tray-break.png" => include_bytes!("../../public/assets/icons/tray/tray-break.png").as_slice(),
        _ => include_bytes!("../../public/assets/icons/tray/tray-idle.png").as_slice(),
    };

    Ok(Image::from_bytes(icon_bytes)?)
}
