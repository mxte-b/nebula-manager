// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
async fn open_overlay(app: tauri::AppHandle) {
    tauri::WebviewWindowBuilder::new(
        &app,
        "overlay",
        tauri::WebviewUrl::App("overlay/index.html".into()),
    )
    .title("Nebula Manager Overlay")
    .decorations(false)
    .always_on_top(true)
    .center()
    .build()
    .unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_overlay])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
