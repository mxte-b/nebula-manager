// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::{path::PathBuf, sync::Arc, sync::Mutex};
use tauri::{Manager, RunEvent};

pub mod vault;
pub use vault::Vault;

// Toggle search overlay
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

// Set master pw


// Copy entry to clipboard (username / password)

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let app = tauri::Builder::default()
        .setup(|app| {
            // Get app data folder and create (if it's missing)
            let app_data_dir = app.path().app_data_dir().expect("Failed to determine data directory");
            std::fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");

            // Create vault
            let vault = Arc::new(Mutex::new(
                Vault::new(app_data_dir.join("vault.json"))
            ));

            println!("Save location: {}", app_data_dir.to_str().unwrap());

            {
                let mut v = vault.lock().unwrap();
                match v.load() {
                    Ok(()) => println!("Loaded ok"),
                    Err(e) => println!("{}", e)
                }
            }

            app.manage(vault);

            Ok(())
        })
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![toggle_overlay])
        .build(tauri::generate_context!())
        .expect("failed to build app");
    app.run_return(move |app_handle, event| {
        match event {
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit(); // prevents Tauri from shutting down immediately

                // Your cleanup code here
                println!("Doing cleanup...");

                let vault = app_handle.state::<Arc<Mutex<Vault>>>();
                if let Ok(v) = vault.lock() {
                    v.save();
                }

                // Run Tauri's cleanup
                app_handle.cleanup_before_exit();

                // Finally exit the process manually
                std::process::exit(0);
            }
            _ => {}
        }
    });
}
