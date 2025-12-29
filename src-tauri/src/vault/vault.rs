use crate::vault::entry::{EntryPublic, UpdateEntry};
use crate::vault::{Entry, VaultCryptoManager};
use argon2::password_hash::rand_core::RngCore;
use base64::{engine::general_purpose::STANDARD, Engine as _};
use chacha20poly1305::aead::{Aead, OsRng};
use chacha20poly1305::{AeadCore, Key, KeyInit, XChaCha20Poly1305, XNonce};
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

#[derive(Serialize, Clone)]
pub enum VaultState {
    Uninitialized,
    Locked,
    Unlocked,
    Error(String),
}

#[derive(Serialize, Clone)]
pub struct VaultStatus {
    pub state: VaultState,
    pub ready: bool,
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
    state: VaultState,

    entries: Vec<Entry>,

    crypto: VaultCrypto,

    runtime: Option<RuntimeKeys>,
    ready: bool,
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
        }
    }

    pub fn set_path(&mut self, path: PathBuf) {
        self.path = path.clone();
    }

    pub fn get_path(&self) -> String {
        self.path.to_string_lossy().to_string()
    }

    pub fn is_initialized(&self) -> bool {
        self.path.exists()
    }

    pub fn load(&mut self) -> Result<(), String> {
        if self.is_initialized() {
            let file_content = std::fs::read_to_string(self.path.clone())
                .map_err(|e| format!("Couldn't read vault file: {}", e))?;

            let save = serde_json::from_str::<SaveFileLayout>(&file_content)
                .map_err(|e| format!("Couldn't parse vault: {}", e))?;

            if save.version != self.version {
                return Err(format!("Incompatible vault version: {}", save.version));
            }

            // Load from vault file
            self.crypto = save.crypto;
            self.state = VaultState::Locked;
        }

        self.ready = true;
        Ok(())
    }

    fn convert_to_savefile(&self) -> SaveFileLayout {
        SaveFileLayout {
            version: self.version.clone(),
            crypto: self.crypto.clone(),
        }
    }

    pub fn save(&mut self) -> Result<(), String> {
        if !matches!(self.state, VaultState::Unlocked) {
            return Err("Vault not accessible, cannot save.".into());
        }

        self.encrypt_vault()?;
        let content =
            serde_json::to_string_pretty(&self.convert_to_savefile()).map_err(|e| e.to_string())?;

        std::fs::write(self.path.clone(), content).map_err(|e| e.to_string())
    }

    pub fn set_master_pw(&mut self, master_password: &str) -> Result<(), String> {
        let mut password_bytes = master_password.as_bytes().to_vec();

        // Generating DEK
        let mut dek = [0u8; 32];
        OsRng.fill_bytes(&mut dek);

        // Salt for KEK
        let mut salt = [0u8; 32];
        OsRng.fill_bytes(&mut salt);

        // Generating KEK
        let mut kek = VaultCryptoManager::derive_kek(&password_bytes, &salt)?;
        password_bytes.zeroize();

        // Wrap DEK with KEK
        let (wrapped_dek, dek_nonce) = VaultCryptoManager::wrap_dek(&dek, &kek)?;
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

    pub fn unlock(&mut self, password: &str) -> Result<(), String> {
        if !matches!(self.state, VaultState::Locked) {
            return Err(format!("Cannot unlock vault since it is not loaded."));
        }

        let mut password_bytes = password.as_bytes().to_vec();

        // Derive KEK
        let salt = b64_to_bytes(&self.crypto.salt)?;

        let mut kek = VaultCryptoManager::derive_kek(&password_bytes, &salt)?;
        password_bytes.zeroize();

        // Unwrap DEK
        let dek_nonce_bytes = b64_to_bytes(&self.crypto.dek_nonce)?;
        let wrapped_dek_bytes = b64_to_bytes(&self.crypto.wrapped_dek)?;
        let dek_nonce = XNonce::from_slice(&dek_nonce_bytes);

        let dek = VaultCryptoManager::unwrap_dek(&wrapped_dek_bytes, &kek, dek_nonce)
            .map_err(|_| "Password incorrect")?;
        kek.zeroize();

        // Store DEK in runtime variables
        self.runtime = Some(RuntimeKeys { dek });

        // Decrypt vault data
        let cipher = XChaCha20Poly1305::new(Key::from_slice(&dek));

        let vault_nonce_bytes = b64_to_bytes(&self.crypto.vault_nonce)?;
        let vault_ciphertext_bytes = b64_to_bytes(&self.crypto.vault_ciphertext)?;
        let vault_nonce = XNonce::from_slice(&vault_nonce_bytes);

        let mut vault_plaintext_bytes = cipher
            .decrypt(vault_nonce, vault_ciphertext_bytes.as_ref())
            .map_err(|e| e.to_string())?;

        self.entries = serde_json::from_slice::<Vec<Entry>>(&vault_plaintext_bytes)
            .map_err(|e| format!("Failed to parse vault JSON: {}", e))?;

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

    pub fn encrypt_vault(&mut self) -> Result<(), String> {
        if let Some(runtime) = &self.runtime {
            let vault_nonce = XChaCha20Poly1305::generate_nonce(&mut OsRng);
            let cipher = XChaCha20Poly1305::new(Key::from_slice(&runtime.dek));

            let vault_plaintext = serde_json::to_vec_pretty::<Vec<Entry>>(&self.entries)
                .map_err(|e| e.to_string())?;

            let ciphertext = cipher
                .encrypt(&vault_nonce, vault_plaintext.as_slice())
                .map_err(|e| e.to_string())?;

            self.crypto.vault_ciphertext = bytes_to_b64(ciphertext);
            self.crypto.vault_nonce = bytes_to_b64(vault_nonce);
        } else {
            return Err("Vault locked, cannot encrypt.".into());
        }

        Ok(())
    }

    // // C(reate)
    pub fn new_entry(&mut self, entry: &Entry) {
        self.entries.push(entry.clone());
    }

    // // R(read)
    pub fn get_status(&self) -> VaultStatus {
        VaultStatus {
            state: self.state.clone(),
            ready: self.ready.clone(),
        }
    }

    pub fn get_entries(&self) -> Vec<EntryPublic> {
        self.entries.iter().map(EntryPublic::from).collect()
    }

    pub fn get_entry_password(&self, id: &Uuid) -> Result<String, String> {
        if let Some(entry) = self.entries.iter().find(|e| e.id == *id) {
            Ok(entry.password.clone())
        } else {
            Err(format!("Entry '{}' not found", id))
        }
    }

    // // U(update)
    pub fn update_entry(
        &mut self,
        id: &Uuid,
        updated: &UpdateEntry,
    ) -> Result<EntryPublic, String> {
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
            Err(format!("Entry '{}' not found", id))
        }
    }

    pub fn toggle_favorite(&mut self, id: &Uuid) -> Result<EntryPublic, String> {
        if let Some(entry) = self.entries.iter_mut().find(|e| e.id == *id) {
            entry.favorite = !entry.favorite;
            Ok(EntryPublic::from(&*entry))
        } else {
            Err(format!("Entry '{}' not found", id))
        }
    }

    // // D(delete)
    pub fn delete_entry(&mut self, id: &Uuid) -> Result<(), String> {
        if let Some(entry_pos) = self.entries.iter().position(|e| e.id == *id) {
            self.entries.remove(entry_pos);
            Ok(())
        } else {
            Err(format!("Entry '{}' not found", id))
        }
    }
}
