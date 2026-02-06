// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::{sync::{Arc, Mutex}, time::Duration};
use regex::Regex;
use tauri::{Emitter, Manager, RunEvent, State, WindowEvent};

pub mod vault;
use tauri_plugin_clipboard_manager::ClipboardExt;
use uuid::Uuid;
pub use vault::Vault;

use crate::vault::{
    entry::{EntryPublic, UpdateEntry},
    vault::{EntryUseResult, VaultChangeEvent, VaultError, VaultErrorKind, VaultErrorSeverity, VaultResult, VaultStatus},
};

use sha2::{Sha256, Digest};
use hex::encode;

fn sha256_hash(text: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(text.as_bytes());
    let result = hasher.finalize();
    encode(result)
}


// Helper function to access vault
#[derive(PartialEq)]
enum WithVaultOptions {
    RequireUnlocked
}

fn with_vault<T, F>(vault: &State<Arc<Mutex<Vault>>>, code: &'static str, option: Option<WithVaultOptions>, f: F) -> VaultResult<T> 
where 
    F: FnOnce(&mut Vault) -> VaultResult<T>
{
    let mut v = vault
        .lock()
        .map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Blocking, 
            message: "Vault not accessible".into(),
            code: code
        })?;

    if option == Some(WithVaultOptions::RequireUnlocked) && !v.is_unlocked() {
        return Err(VaultError {
            kind: VaultErrorKind::Auth, 
            severity: VaultErrorSeverity::Blocking, 
            message: "Vault must be unlocked for this operation".into(),
            code: code
        })
    }

    f(&mut v)
}

// Validation helper function

enum ValidationRule {
    Required,
    RegEx(String),
}

struct ValidationField<'lt, T> {
    name: &'static str,
    value: &'lt T,
    rules: Vec<ValidationRule>
}

fn validate<T: AsRef<str>>(fields: Vec<ValidationField<T>>) -> VaultResult<()> {
    for field in fields {
        let value = field.value.as_ref();

        for rule in &field.rules {
            match rule {
                ValidationRule::Required => {
                    if value.trim().is_empty() {
                        return Err(VaultError {
                            kind: VaultErrorKind::Validation,
                            severity: VaultErrorSeverity::Blocking,
                            message: format!("{} is required", field.name),
                            code: "E_VALIDATION_REQUIRED",
                        })
                    }
                }
                ValidationRule::RegEx(pattern) => {
                    let regex = Regex::new(pattern).map_err(|_| VaultError {
                            kind: VaultErrorKind::Internal,
                            severity: VaultErrorSeverity::Blocking,
                            message: format!("Invalid regex pattern encountered: {}", pattern),
                            code: "E_VALIDATION_INVALID_PATTERN",
                    })?;

                    if !regex.is_match(value) {
                        return Err(VaultError {
                            kind: VaultErrorKind::Validation,
                            severity: VaultErrorSeverity::Blocking,
                            message: format!("{} is invalid", field.name),
                            code: "E_VALIDATION_REGEX",
                        });
                    }
                }
            }
        }
    }

    Ok(())
}

// Toggle search overlay
#[tauri::command]
fn toggle_overlay(app: tauri::AppHandle, vault: State<Arc<Mutex<Vault>>>) -> VaultResult<()> {
    let unlocked = with_vault(&vault, "E_VAULT_OVERLAY", None, |v| Ok(v.is_unlocked()))?;

    if !unlocked {
        return Ok(());
    }

    if let Some(window) = app.get_webview_window("overlay") {
        let is_visible = window.is_visible().unwrap_or(false);

        if is_visible {
            let _ = window.emit("overlay_before_hide", ());

            tauri::async_runtime::spawn(async move {
                tokio::time::sleep(Duration::from_millis(100)).await;

                window.hide().unwrap();
            });
        } else {
            window.show().unwrap();
            let _ = window.emit("overlay_show", ());
            window.set_focus().unwrap();
        }
    }

    Ok(())
}

// Vault commands
#[tauri::command]
fn vault_setup(vault: State<Arc<Mutex<Vault>>>, master_password: String) -> VaultResult<()> {
    with_vault(&vault, "E_VAULT_SETUP", None, |v| v.set_master_pw(&master_password))
}

#[tauri::command]
fn vault_unlock(app_handle: tauri::AppHandle, vault: State<Arc<Mutex<Vault>>>, password: String) -> VaultResult<()> {
    let unlock_result = with_vault(&vault, "E_VAULT_UNLOCK", None, |v| v.unlock(&password))?;
    let _ = app_handle.emit("vault_changed", VaultChangeEvent::Status);
    Ok(unlock_result)
}

#[tauri::command]
fn vault_create_entry(
    app_handle: tauri::AppHandle, 
    webview_window: tauri::WebviewWindow, 
    vault: State<Arc<Mutex<Vault>>>, 
    entry: vault::Entry
) -> VaultResult<()> {

    let fields = vec![
        ValidationField {
            value: &entry.label,
            rules: vec![ValidationRule::Required],
            name: "Label",
        },
        ValidationField {
            value: &entry.name,
            rules: vec![ValidationRule::Required],
            name: "Username",
        },
        ValidationField {
            value: &entry.password,
            rules: vec![ValidationRule::Required],
            name: "Password",
        },
    ];

    validate(fields)?;

    with_vault(&vault, "E_VAULT_ENTRY_CREATE", Some(WithVaultOptions::RequireUnlocked), |v| {
        v.new_entry(&entry);
        v.save()
    })?;

    // Notify other windows of change
    let _ = app_handle.emit("vault_changed", VaultChangeEvent::Create { 
        source: webview_window.label().into(), 
        entry: EntryPublic::from(&entry) 
    });

    Ok(())
}

#[tauri::command]
fn vault_get_status(vault: State<Arc<Mutex<Vault>>>) -> VaultResult<VaultStatus> {
    with_vault(&vault, "E_VAULT_GET_STATUS", None, |v| Ok(v.get_status()))
}

#[tauri::command]
fn vault_get_entries(vault: State<Arc<Mutex<Vault>>>) -> VaultResult<Vec<EntryPublic>> {
    with_vault(&vault, "E_VAULT_GET_ENTRIES", Some(WithVaultOptions::RequireUnlocked), |v| Ok(v.get_entries()))
}

#[tauri::command]
fn vault_get_entry_password(vault: State<Arc<Mutex<Vault>>>, id: Uuid) -> VaultResult<String> {
    with_vault(&vault, "E_VAULT_GET_PASS", Some(WithVaultOptions::RequireUnlocked), |v| v.get_entry_password(&id))
}

#[tauri::command]
fn vault_update_entry(
    app_handle: tauri::AppHandle, 
    webview_window: tauri::WebviewWindow, 
    vault: State<Arc<Mutex<Vault>>>,
    id: Uuid,
    new: UpdateEntry,
) -> VaultResult<EntryPublic> {
    let result = with_vault(&vault, "E_VAULT_ENTRY_UPDATE", Some(WithVaultOptions::RequireUnlocked), |v| v.update_entry(&id, &new))?;
    
    // Notify other windows of change
    let _ = app_handle.emit("vault_changed", VaultChangeEvent::Update { 
        source: webview_window.label().into(), 
        id: id,
        new: result.clone()
    });

    Ok(result)
}

#[tauri::command]
fn vault_toggle_favorite(
    app_handle: tauri::AppHandle, 
    webview_window: tauri::WebviewWindow,
    vault: State<Arc<Mutex<Vault>>>, 
    id: Uuid
) -> VaultResult<EntryPublic> {
    let result = with_vault(&vault, "E_VAULT_ENTRY_FAVORITE", Some(WithVaultOptions::RequireUnlocked), |v| v.toggle_favorite(&id))?;

    // Notify other windows of change
    let _ = app_handle.emit("vault_changed", VaultChangeEvent::Update { 
        source: webview_window.label().into(), 
        id: id,
        new: result.clone()
    });

    Ok(result)
}

#[tauri::command]
fn vault_delete_entry(
    app_handle: tauri::AppHandle, 
    webview_window: tauri::WebviewWindow,
    vault: State<Arc<Mutex<Vault>>>, 
    id: Uuid
) -> VaultResult<()> {
    with_vault(&vault, "E_VAULT_ENTRY_DELETE", Some(WithVaultOptions::RequireUnlocked), |v| v.delete_entry(&id))?;

    // Notify other windows of change
    let _ = app_handle.emit("vault_changed", VaultChangeEvent::Delete { 
        source: webview_window.label().into(), 
        id: id
    });    

    Ok(())
}

#[tauri::command]
fn vault_copy_entry_password(
    app_handle: tauri::AppHandle, 
    webview_window: tauri::WebviewWindow,
    vault: State<Arc<Mutex<Vault>>>, 
    last_hash_state: State<Arc<Mutex<Option<String>>>>,
    id: Uuid
) -> VaultResult<EntryUseResult> {
    let (text, use_result) = with_vault(&vault, "E_VAULT_COPY_PASS", Some(WithVaultOptions::RequireUnlocked), |v| {
        Ok((
            v.get_entry_password(&id)?,
            v.use_entry(&id)?
        ))
    })?;
    
    let hash = sha256_hash(&text);

    {
        let mut h = last_hash_state.lock().map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Blocking, 
            message: "Clipboard hash not accessible".into(),
            code: "E_VAULT_COPY_PASS_HASH"
        })?;

        *h = Some(hash.clone());
    }

    app_handle.clipboard().write_text(text).map_err(|_| VaultError {
        kind: VaultErrorKind::Internal, 
        severity: VaultErrorSeverity::Blocking, 
        message: "Couldn't copy to clipboard".into(),
        code: "E_VAULT_COPY_PASS_CLIP"
    })?;

    // Notify other windows of change
    let _ = app_handle.emit("vault_changed", VaultChangeEvent::EntryUse { 
        source: webview_window.label().into(), 
        id: id,
        result: use_result.clone()
    }); 

    Ok(use_result)
}

#[tauri::command]
fn vault_copy_entry_name(
    app_handle: tauri::AppHandle, 
    webview_window: tauri::WebviewWindow,
    vault: State<Arc<Mutex<Vault>>>,
    last_hash_state: State<Arc<Mutex<Option<String>>>>,
    id: Uuid
) -> VaultResult<EntryUseResult> {
    let (text, use_result) = with_vault(&vault, "E_VAULT_COPY_PASS", Some(WithVaultOptions::RequireUnlocked), |v| {
        Ok((
            v.get_entry_name(&id)?,
            v.use_entry(&id)?
        ))
    })?;

    let hash = sha256_hash(&text);

    {
        let mut h = last_hash_state.lock().map_err(|_| VaultError {
            kind: VaultErrorKind::Access, 
            severity: VaultErrorSeverity::Blocking, 
            message: "Clipboard hash not accessible".into(),
            code: "E_VAULT_COPY_PASS_HASH"
        })?;

        *h = Some(hash.clone());
    }

    app_handle.clipboard().write_text(text).map_err(|_| VaultError {
        kind: VaultErrorKind::Internal, 
        severity: VaultErrorSeverity::Blocking, 
        message: "Couldn't copy to clipboard".into(),
        code: "E_VAULT_COPY_NAME_CLIP"
    })?;

    // Notify other windows of change
    let _ = app_handle.emit("vault_changed", VaultChangeEvent::EntryUse { 
        source: webview_window.label().into(), 
        id: id,
        result: use_result.clone()
    }); 

    Ok(use_result)
}

#[tauri::command]
fn vault_clear_clipboard_safe(app_handle: tauri::AppHandle, last_hash_state: State<Arc<Mutex<Option<String>>>>) -> VaultResult<()> {
    let mut h = last_hash_state.lock().map_err(|_| VaultError {
        kind: VaultErrorKind::Access, 
        severity: VaultErrorSeverity::Blocking, 
        message: "Clipboard hash not accessible".into(),
        code: "E_VAULT_COPY_PASS_HASH"
    })?;

    if h.is_none() {
        return Ok(())
    }

    let clip = app_handle.clipboard();

    let text = match clip.read_text() {
        Ok(t) => t,
        Err(_) => {
            return Ok(());
        }
    };

    let hash = sha256_hash(&text);

    // Clear clipboard if the hash didnt change (it still contains the password)
    if h.as_ref() == Some(&hash) {
        clip.clear().map_err(|_| VaultError {
            kind: VaultErrorKind::Internal, 
            severity: VaultErrorSeverity::Blocking, 
            message: "Couldn't clear clipboard".into(),
            code: "E_VAULT_CLEAR_CLIP"
        })?;

        *h = None;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let vault = Arc::new(Mutex::new(Vault::new()));
    let last_clipboard_hash = Arc::new(Mutex::new(None::<String>));

    let app = tauri::Builder::default()
        .manage(vault.clone())
        .manage(last_clipboard_hash.clone())
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
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            toggle_overlay,
            vault_setup,
            vault_unlock,
            vault_create_entry,
            vault_copy_entry_password,
            vault_copy_entry_name,
            vault_clear_clipboard_safe,
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

            if window.label() == "overlay" {
                match event {
                    WindowEvent::Focused(false) => {
                        if let Some(overlay) = window.app_handle().get_webview_window("overlay") {
                            let _ = window.emit("overlay_before_hide", ());

                            tauri::async_runtime::spawn(async move {
                                tokio::time::sleep(Duration::from_millis(100)).await;

                                overlay.hide().unwrap();
                            });
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
                let last_hash_state = app_handle.state::<Arc<Mutex<Option<String>>>>();

                if let Ok(mut v) = vault.lock() {
                    match v.save() {
                        Ok(()) => println!("Successful save."),
                        Err(e) => println!("Error while saving: {}", e),
                    }
                }

                match vault_clear_clipboard_safe(app_handle.clone(), last_hash_state.clone()) {
                    Ok(()) => println!("Successful clipboard clear."),
                    Err(e) => println!("Error while clearing clipboard: {}", e),
                }

                app_handle.cleanup_before_exit();

                // Finally exit the process manually
                std::process::exit(0);
            }
            _ => {}
        }
    });
}
