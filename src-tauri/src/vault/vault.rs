use crate::vault::entry::{EntryPublic, UpdateEntry};
use crate::vault::{Entry, VaultCryptoManager};
use argon2::password_hash::rand_core::RngCore;
use base64::{engine::general_purpose::STANDARD, Engine as _};
use chacha20poly1305::aead::{Aead, OsRng};
use chacha20poly1305::{AeadCore, Key, KeyInit, XChaCha20Poly1305, XNonce};
use core::fmt;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use time::OffsetDateTime;
use uuid::Uuid;
use zeroize::Zeroize;

const VERSION: &str = "0.6.0";

fn b64_to_bytes(x: &str) -> Result<Vec<u8>, String> {
    STANDARD.decode(x).map_err(|e| e.to_string())
}

fn bytes_to_b64<T: AsRef<[u8]>>(x: T) -> String {
    STANDARD.encode(x.as_ref())
}

/* -------------------------------------------------------------------------- */
/*                                 Vault error                                */
/* -------------------------------------------------------------------------- */
#[derive(Serialize, Clone, Debug)]
pub enum VaultErrorKind {
    IO,
    Parse,
    Version,
    Access,
    Auth,
    Crypto,
    NotFound,
    Internal,
}

#[derive(Serialize, Clone, Debug)]
pub enum VaultErrorSeverity {
    Soft,
    Blocking,
    Fatal,
}

#[derive(Serialize, Clone, Debug)]
pub struct VaultError {
    pub kind: VaultErrorKind,
    pub severity: VaultErrorSeverity,
    pub message: String,
    pub code: &'static str,
}

impl std::error::Error for VaultError {}

impl fmt::Display for VaultError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "[{}][{:?}][{:?}] {}",
            self.code, self.severity, self.kind, self.message
        )
    }
}

pub type VaultResult<T> = Result<T, VaultError>;

/* -------------------------------------------------------------------------- */
/*                                 Vault data                                 */
/* -------------------------------------------------------------------------- */
#[derive(Serialize, Clone)]
pub enum VaultState {
    Uninitialized,
    Locked,
    Unlocked,
}

#[derive(Serialize, Clone)]
pub struct VaultStatus {
    pub state: VaultState,
    pub ready: bool,
    pub last_error: Option<VaultError>,
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct VaultCrypto {
    pub salt: String,
    pub wrapped_dek: String,
    pub dek_nonce: String,
    pub vault_nonce: String,
    pub vault_ciphertext: String,
}

#[derive(Clone)]
pub struct RuntimeKeys {
    pub dek: [u8; 32],
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SaveFileLayout {
    pub version: String,
    pub crypto: VaultCrypto,
}

pub struct Vault {
    path: PathBuf,
    version: String,
    ready: bool,
    state: VaultState,
    last_error: Option<VaultError>,

    entries: Vec<Entry>,

    crypto: VaultCrypto,
    runtime: Option<RuntimeKeys>,
}

impl Drop for Vault {
    fn drop(&mut self) {
        self.lock();
    }
}

impl Vault {
    pub fn new() -> Self {
        Vault {
            version: String::from(VERSION),
            entries: Vec::new(),
            path: PathBuf::new(),
            state: VaultState::Uninitialized,
            crypto: VaultCrypto::default(),
            runtime: None,
            ready: false,
            last_error: None,
        }
    }

    pub fn new_with_path(path: PathBuf) -> Self {
        Vault {
            version: String::from(VERSION),
            entries: Vec::new(),
            path: path,
            state: VaultState::Uninitialized,
            crypto: VaultCrypto::default(),
            runtime: None,
            ready: false,
            last_error: None,
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                     IO                                     */
    /* -------------------------------------------------------------------------- */
    pub fn set_path(&mut self, path: PathBuf) {
        self.path = path.clone();
    }

    pub fn get_path(&self) -> String {
        self.path.to_string_lossy().to_string()
    }

    pub fn is_initialized(&self) -> bool {
        self.path.exists()
    }

    pub fn load(&mut self) {
        self.ready = false;

        match self.try_load() {
            Ok(_) => {
                self.last_error = None;
                self.ready = true;
            }
            Err(e) => {
                self.last_error = Some(e);
            }
        }
    }

    pub fn try_load(&mut self) -> VaultResult<()> {
        if self.is_initialized() {
            let file_content =
                std::fs::read_to_string(self.path.clone()).map_err(|e| VaultError {
                    kind: VaultErrorKind::IO,
                    severity: VaultErrorSeverity::Fatal,
                    code: "E_VAULT_LOAD",
                    message: format!("Couldn't read vault file: {}", e),
                })?;

            let save =
                serde_json::from_str::<SaveFileLayout>(&file_content).map_err(|e| VaultError {
                    kind: VaultErrorKind::Parse,
                    severity: VaultErrorSeverity::Fatal,
                    code: "E_VAULT_LOAD",
                    message: format!("Couldn't parse vault: {}", e),
                })?;

            if save.version != self.version {
                return Err(VaultError {
                    kind: VaultErrorKind::Version,
                    severity: VaultErrorSeverity::Fatal,
                    code: "E_VAULT_LOAD",
                    message: format!(
                        "Vault version ({}) doesn't match the application version. ({})",
                        save.version, self.version
                    ),
                });
            }

            // Load from vault file
            self.crypto = save.crypto;
            self.state = VaultState::Locked;
        }

        Ok(())
    }

    fn convert_to_savefile(&self) -> SaveFileLayout {
        SaveFileLayout {
            version: self.version.clone(),
            crypto: self.crypto.clone(),
        }
    }

    pub fn save(&mut self) -> VaultResult<()> {
        if !matches!(self.state, VaultState::Unlocked) {
            return Err(VaultError {
                kind: VaultErrorKind::Access,
                severity: VaultErrorSeverity::Blocking,
                message: "Attempted to save while vault was not unlocked".into(),
                code: "E_VAULT_SAVE_ACCESS",
            });
        }

        self.encrypt_vault()?;
        let content =
            serde_json::to_string_pretty(&self.convert_to_savefile()).map_err(|e| VaultError {
                kind: VaultErrorKind::Parse,
                severity: VaultErrorSeverity::Blocking,
                message: format!("Serialization failed: {e}"),
                code: "E_VAULT_SAVE_SERIALIZE",
            })?;

        std::fs::write(self.path.clone(), content).map_err(|e| VaultError {
            kind: VaultErrorKind::IO,
            severity: VaultErrorSeverity::Blocking,
            message: format!("Filesystem write failed: {e}"),
            code: "E_VAULT_SAVE_OUT",
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                                AUTH / CRYPTO                               */
    /* -------------------------------------------------------------------------- */
    pub fn set_master_pw(&mut self, master_password: &str) -> VaultResult<()> {
        let mut password_bytes = master_password.as_bytes().to_vec();

        // Generating DEK
        let mut dek = [0u8; 32];
        OsRng.fill_bytes(&mut dek);

        // Salt for KEK
        let mut salt = [0u8; 32];
        OsRng.fill_bytes(&mut salt);

        // Generating KEK
        let mut kek =
            VaultCryptoManager::derive_kek(&password_bytes, &salt).map_err(|e| VaultError {
                kind: VaultErrorKind::Crypto,
                severity: VaultErrorSeverity::Blocking,
                message: format!("Failed to derive KEK: {e}"),
                code: "E_VAULT_SET_PW_KEK",
            })?;
        password_bytes.zeroize();

        // Wrap DEK with KEK
        let (wrapped_dek, dek_nonce) =
            VaultCryptoManager::wrap_dek(&dek, &kek).map_err(|e| VaultError {
                kind: VaultErrorKind::Crypto,
                severity: VaultErrorSeverity::Blocking,
                message: format!("Failed to wrap DEK: {e}"),
                code: "E_VAULT_SET_PW_DEK",
            })?;
        kek.zeroize();

        // Store DEK
        self.runtime = Some(RuntimeKeys { dek });

        // Convert to base64 and store it in memory
        self.crypto.wrapped_dek = bytes_to_b64(wrapped_dek);
        self.crypto.salt = bytes_to_b64(salt);
        self.crypto.dek_nonce = bytes_to_b64(dek_nonce);

        // Set vault to unlocked
        self.state = VaultState::Unlocked;

        Ok(())
    }

    pub fn unlock(&mut self, password: &str) -> VaultResult<()> {
        if !matches!(self.state, VaultState::Locked) {
            return Err(VaultError {
                kind: VaultErrorKind::Access,
                severity: VaultErrorSeverity::Fatal,
                message: "Vault not locked, cannot unlock.".into(),
                code: "E_VAULT_UNLOCK",
            });
        }

        let mut password_bytes = password.as_bytes().to_vec();

        // Derive KEK
        let salt = b64_to_bytes(&self.crypto.salt).map_err(|e| VaultError {
            kind: VaultErrorKind::Parse,
            severity: VaultErrorSeverity::Blocking,
            message: format!("Failed to decode from base64: {e}"),
            code: "E_VAULT_UNLOCK",
        })?;

        let mut kek =
            VaultCryptoManager::derive_kek(&password_bytes, &salt).map_err(|e| VaultError {
                kind: VaultErrorKind::Crypto,
                severity: VaultErrorSeverity::Blocking,
                message: format!("Failed to derive KEK: {e}"),
                code: "E_VAULT_UNLOCK",
            })?;

        password_bytes.zeroize();

        // Unwrap DEK
        let dek_nonce_bytes = b64_to_bytes(&self.crypto.dek_nonce).map_err(|e| VaultError {
            kind: VaultErrorKind::Parse,
            severity: VaultErrorSeverity::Blocking,
            message: format!("Failed to decode from base64: {e}"),
            code: "E_VAULT_UNLOCK",
        })?;

        let wrapped_dek_bytes = b64_to_bytes(&self.crypto.wrapped_dek).map_err(|e| VaultError {
            kind: VaultErrorKind::Parse,
            severity: VaultErrorSeverity::Blocking,
            message: format!("Failed to decode from base64: {e}"),
            code: "E_VAULT_UNLOCK",
        })?;

        let dek_nonce = XNonce::from_slice(&dek_nonce_bytes);

        let dek =
            VaultCryptoManager::unwrap_dek(&wrapped_dek_bytes, &kek, dek_nonce).map_err(|_| {
                VaultError {
                    kind: VaultErrorKind::Auth,
                    severity: VaultErrorSeverity::Soft,
                    message: format!("Incorrect password."),
                    code: "E_VAULT_UNLOCK",
                }
            })?;

        kek.zeroize();

        // Store DEK in runtime variables
        self.runtime = Some(RuntimeKeys { dek });

        // Decrypt vault data
        let cipher = XChaCha20Poly1305::new(Key::from_slice(&dek));

        let vault_nonce_bytes = b64_to_bytes(&self.crypto.vault_nonce).map_err(|e| VaultError {
            kind: VaultErrorKind::Parse,
            severity: VaultErrorSeverity::Blocking,
            message: format!("Failed to decode from base64: {e}"),
            code: "E_VAULT_UNLOCK",
        })?;

        let vault_ciphertext_bytes =
            b64_to_bytes(&self.crypto.vault_ciphertext).map_err(|e| VaultError {
                kind: VaultErrorKind::Parse,
                severity: VaultErrorSeverity::Blocking,
                message: format!("Failed to decode from base64: {e}"),
                code: "E_VAULT_UNLOCK",
            })?;

        let vault_nonce = XNonce::from_slice(&vault_nonce_bytes);

        let mut vault_plaintext_bytes = cipher
            .decrypt(vault_nonce, vault_ciphertext_bytes.as_ref())
            .map_err(|_| VaultError {
                kind: VaultErrorKind::Crypto,
                severity: VaultErrorSeverity::Blocking,
                message: format!("Failed to decrypt vault."),
                code: "E_VAULT_UNLOCK",
            })?;

        self.entries =
            serde_json::from_slice::<Vec<Entry>>(&vault_plaintext_bytes).map_err(|_| {
                VaultError {
                    kind: VaultErrorKind::Parse,
                    severity: VaultErrorSeverity::Blocking,
                    message: format!("Failed to parse vault."),
                    code: "E_VAULT_UNLOCK",
                }
            })?;

        vault_plaintext_bytes.zeroize();

        self.state = VaultState::Unlocked;

        Ok(())
    }

    pub fn lock(&mut self) {
        if let Some(mut runtime) = self.runtime.take() {
            runtime.dek.zeroize();
        }
        self.entries.clear();
        self.state = VaultState::Locked;
    }

    pub fn encrypt_vault(&mut self) -> VaultResult<()> {
        if let Some(runtime) = &self.runtime {
            let vault_nonce = XChaCha20Poly1305::generate_nonce(&mut OsRng);
            let cipher = XChaCha20Poly1305::new(Key::from_slice(&runtime.dek));

            let vault_plaintext =
                serde_json::to_vec_pretty::<Vec<Entry>>(&self.entries).map_err(|_| VaultError {
                    kind: VaultErrorKind::Parse,
                    severity: VaultErrorSeverity::Blocking,
                    message: format!("Failed to parse vault."),
                    code: "E_VAULT_ENCRYPT_PARSE",
                })?;

            let ciphertext = cipher
                .encrypt(&vault_nonce, vault_plaintext.as_slice())
                .map_err(|_| VaultError {
                    kind: VaultErrorKind::Crypto,
                    severity: VaultErrorSeverity::Blocking,
                    message: format!("Failed to encrypt vault."),
                    code: "E_VAULT_ENCRYPT_UNLOCK",
                })?;

            self.crypto.vault_ciphertext = bytes_to_b64(ciphertext);
            self.crypto.vault_nonce = bytes_to_b64(vault_nonce);
        } else {
            return Err(VaultError {
                kind: VaultErrorKind::Access,
                severity: VaultErrorSeverity::Blocking,
                message: format!("Vault not initialized."),
                code: "E_VAULT_ENCRYPT_NEX_RUNTIME",
            });
        }

        Ok(())
    }

    /* -------------------------------------------------------------------------- */
    /*                                   CREATE                                   */
    /* -------------------------------------------------------------------------- */
    pub fn new_entry(&mut self, entry: &Entry) {
        self.entries.push(entry.clone());
    }

    /* -------------------------------------------------------------------------- */
    /*                                    READ                                    */
    /* -------------------------------------------------------------------------- */
    pub fn get_status(&mut self) -> VaultStatus {
        VaultStatus {
            state: self.state.clone(),
            ready: self.ready.clone(),
            last_error: self.last_error.take(),
        }
    }

    pub fn get_entries(&self) -> Vec<EntryPublic> {
        self.entries.iter().map(EntryPublic::from).collect()
    }

    pub fn get_entry_name(&mut self, id: &Uuid) -> VaultResult<String> {
        if let Some(entry) = self.entries.iter_mut().find(|e| e.id == *id) {
            entry.last_used = OffsetDateTime::now_utc();
            Ok(entry.name.clone())
        } else {
            Err(VaultError {
                kind: VaultErrorKind::NotFound,
                severity: VaultErrorSeverity::Soft,
                message: format!("Entry '{}' not found", id),
                code: "E_VAULT_GET_NAME",
            })
        }
    }

    pub fn get_entry_password(&mut self, id: &Uuid) -> VaultResult<String> {
        if let Some(entry) = self.entries.iter_mut().find(|e| e.id == *id) {
            entry.last_used = OffsetDateTime::now_utc();
            Ok(entry.password.clone())
        } else {
            Err(VaultError {
                kind: VaultErrorKind::NotFound,
                severity: VaultErrorSeverity::Soft,
                message: format!("Entry '{}' not found", id),
                code: "E_VAULT_GET_PASS",
            })
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                   UPDATE                                   */
    /* -------------------------------------------------------------------------- */
    pub fn update_entry(&mut self, id: &Uuid, updated: &UpdateEntry) -> VaultResult<EntryPublic> {
        if let Some(entry) = self.entries.iter_mut().find(|e| e.id == *id) {
            if let Some(label) = &updated.label {
                entry.label = label.clone();
            }

            if let Some(name) = &updated.name {
                entry.name = name.clone();
            }

            if let Some(pass) = &updated.password {
                entry.password = pass.clone();
            }

            if let Some(url) = &updated.url {
                entry.url = url.clone();
            }

            entry.modified_at = OffsetDateTime::now_utc();

            Ok(EntryPublic::from(&*entry))
        } else {
            Err(VaultError {
                kind: VaultErrorKind::NotFound,
                severity: VaultErrorSeverity::Soft,
                message: format!("Entry '{}' not found", id),
                code: "E_VAULT_ENTRY_UPDATE",
            })
        }
    }

    pub fn toggle_favorite(&mut self, id: &Uuid) -> VaultResult<EntryPublic> {
        if let Some(entry) = self.entries.iter_mut().find(|e| e.id == *id) {
            entry.favorite = !entry.favorite;
            Ok(EntryPublic::from(&*entry))
        } else {
            Err(VaultError {
                kind: VaultErrorKind::NotFound,
                severity: VaultErrorSeverity::Soft,
                message: format!("Entry '{}' not found", id),
                code: "E_VAULT_ENTRY_FAVORITE",
            })
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                   DELETE                                   */
    /* -------------------------------------------------------------------------- */
    pub fn delete_entry(&mut self, id: &Uuid) -> VaultResult<()> {
        if let Some(entry_pos) = self.entries.iter().position(|e| e.id == *id) {
            self.entries.remove(entry_pos);
            Ok(())
        } else {
            Err(VaultError {
                kind: VaultErrorKind::NotFound,
                severity: VaultErrorSeverity::Soft,
                message: format!("Entry '{}' not found", id),
                code: "E_VAULT_ENTRY_DELETE",
            })
        }
    }
}
