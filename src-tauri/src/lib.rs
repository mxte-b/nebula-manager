// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::{sync::Arc, sync::Mutex};
use tauri::{Manager, RunEvent, State, WindowEvent};

pub mod vault;
pub use vault::Vault;

use crate::vault::Entry;

// Toggle search overlay
#[tauri::command]
fn toggle_overlay(app: tauri::AppHandle) {
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

// Vault commands
#[tauri::command]
fn vault_create_entry(vault: State<Arc<Mutex<Vault>>>, entry: vault::Entry) -> Result<(), String> {
    println!("Saving entry...");
    println!("{}", serde_json::to_string_pretty(&entry).unwrap());
    let mut v = vault.lock().map_err(|_| "Couldn't access vault".to_string())?;
    v.new_entry(&entry);
    v.save().map_err(|e| format!("Failed to save vault: {}", e))
}

#[tauri::command]
fn vault_get_entries(vault: State<Arc<Mutex<Vault>>>) -> Result<Vec<Entry>, String> {
    let v = vault.lock().map_err(|_| "Couldn't access vault".to_string())?;
    Ok(v.get_entries())
}

#[tauri::command]
fn vault_update_entry(vault: State<Arc<Mutex<Vault>>>, label: String, new: vault::Entry) -> Result<(), String> {
    vault.lock().map(|mut v| v.update_entry(&label, &new)).map_err(|_| "Couldn't access vault".to_string())
}

#[tauri::command]
fn vault_delete_entry(vault: State<Arc<Mutex<Vault>>>, label: String) -> Result<(), String> {
    vault.lock().map(|mut v| v.delete_entry(&label)).map_err(|_| "Couldn't access vault".to_string())
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

            // Loading the vault from the save file
            {
                let mut v = vault.lock().unwrap();
                match v.load() {
                    Ok(()) => println!("Loaded ok"),
                    Err(e) => println!("{}", e)
                }
            }

            // Let tauri manage the vault
            // This allows changing the vault in commands
            app.manage(vault);

            Ok(())
        })
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            toggle_overlay,
            vault_create_entry,
            vault_get_entries,
            vault_update_entry,
            vault_delete_entry
        ])
        .on_window_event(|window, event| {
            if window.label() == "main" {
                match event {
                    WindowEvent::CloseRequested { api: _, .. } => {
                        if let Some(overlay) = window.app_handle().get_webview_window("overlay") {
                            let _ = overlay.close();
                        }
                    }
                    _ => {}
                }
            }
        })
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
                    match v.save() {
                        Ok(()) => println!("Successful save."),
                        Err(e) => println!("Error while saving: {}", e)
                    }
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
