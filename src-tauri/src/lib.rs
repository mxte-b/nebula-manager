// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::Manager;

#[tauri::command]
async fn toggle_overlay(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("overlay") {
        let is_visible = window.is_visible().unwrap_or(false);

        if is_visible {
            window.hide().unwrap();
        } else {
            window.show().unwrap();
            window.set_focus().unwrap();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![toggle_overlay])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
