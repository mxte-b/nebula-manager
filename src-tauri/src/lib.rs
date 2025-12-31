// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::{sync::Arc, sync::Mutex};
use tauri::{Manager, RunEvent, State, WindowEvent};

pub mod vault;
use uuid::Uuid;
pub use vault::Vault;

use crate::vault::{
    entry::{EntryPublic, UpdateEntry},
    vault::{VaultError, VaultErrorKind, VaultErrorSeverity, VaultResult, VaultStatus},
};

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
fn vault_setup(vault: State<Arc<Mutex<Vault>>>, master_password: String) -> VaultResult<()> {
    let mut v = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_SETUP"
        })?;
    Ok(v.set_master_pw(&master_password)?)
}

#[tauri::command]
fn vault_unlock(vault: State<Arc<Mutex<Vault>>>, password: String) -> VaultResult<()> {
    let mut v = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_UNLOCK"
        })?;
    Ok(v.unlock(&password)?)
}

#[tauri::command]
fn vault_create_entry(vault: State<Arc<Mutex<Vault>>>, entry: vault::Entry) -> VaultResult<()> {
    let mut v = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_ENTRY_CREATE"
        })?;
    v.new_entry(&entry);
    v.save()
}

#[tauri::command]
fn vault_get_status(vault: State<Arc<Mutex<Vault>>>) -> VaultResult<VaultStatus> {
    let mut v = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_GET_STATUS"
        })?;
    Ok(v.get_status())
}

#[tauri::command]
fn vault_get_entries(vault: State<Arc<Mutex<Vault>>>) -> VaultResult<Vec<EntryPublic>> {
    let v = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_ENTRY_GET"
        })?;
    Ok(v.get_entries())
}

#[tauri::command]
fn vault_get_entry_password(vault: State<Arc<Mutex<Vault>>>, id: Uuid) -> VaultResult<String> {
    let v = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_GET_PASS"
        })?;
    v.get_entry_password(&id)
}

#[tauri::command]
fn vault_update_entry(
    vault: State<Arc<Mutex<Vault>>>,
    id: Uuid,
    new: UpdateEntry,
) -> VaultResult<EntryPublic> {
    let mut guard = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_ENTRY_UPDATE"
        })?;
    guard.update_entry(&id, &new)
}

#[tauri::command]
fn vault_toggle_favorite(vault: State<Arc<Mutex<Vault>>>, id: Uuid) -> VaultResult<EntryPublic> {
    let mut guard = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_ENTRY_FAVORITE"
        })?;
    guard.toggle_favorite(&id)
}

#[tauri::command]
fn vault_delete_entry(vault: State<Arc<Mutex<Vault>>>, id: Uuid) -> VaultResult<()> {
    let mut guard = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Warning, 
            message: "Vault not accessible".into(),
            code: "E_VAULT_ENTRY_DELETE"
        })?;
    guard.delete_entry(&id)
}

// Copy entry to clipboard (username / password)

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let vault = Arc::new(Mutex::new(Vault::new()));

    let app = tauri::Builder::default()
        .manage(vault.clone())
        .setup(move |app| {
            // Get app data folder and create (if it's missing)
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to determine data directory");
            std::fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");

            println!("Save location: {}", app_data_dir.to_str().unwrap());

            // Loading the vault from the save file
            {
                let mut v = vault.lock().unwrap();
                v.set_path(app_data_dir.join("vault_encrypted.json"));
                v.load();
            }

            Ok(())
        })
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            toggle_overlay,
            vault_setup,
            vault_unlock,
            vault_create_entry,
            vault_get_status,
            vault_get_entries,
            vault_get_entry_password,
            vault_update_entry,
            vault_toggle_favorite,
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
                api.prevent_exit();

                println!("Doing cleanup...");

                // Save the vault on window close
                let vault = app_handle.state::<Arc<Mutex<Vault>>>();
                if let Ok(mut v) = vault.lock() {
                    match v.save() {
                        Ok(()) => println!("Successful save."),
                        Err(e) => println!("Error while saving: {}", e),
                    }
                }

                app_handle.cleanup_before_exit();

                // Finally exit the process manually
                std::process::exit(0);
            }
            _ => {}
        }
    });
}
