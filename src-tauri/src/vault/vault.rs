use std::path::{PathBuf};
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;
use crate::vault::Entry;
use crate::vault::entry::{EntryPublic, UpdateEntry};

const VERSION: &str = "0.6.0";

pub struct Vault {
    version: String,
    entries: Vec<Entry>,
    path: PathBuf,
    loaded: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SaveFileLayout {
    pub version: String,
    pub vault: Vec<Entry>
}

impl Vault {
    pub fn new(path: PathBuf) -> Self {
        Vault { 
            version: String::from(VERSION),
            entries: Vec::new(), 
            path: path,
            loaded: false,
        }
    }

    pub fn is_initialized(&self) -> bool {
        self.path
        .try_exists()
        .unwrap_or(false)
    }

    pub fn load(&mut self) -> Result<(), String> {
        if self.is_initialized() {
            // Trigger unlock screen

            let file_content = std::fs::read_to_string(self.path.clone())
                .map_err(|e| format!("Couldn't read vault file: {}", e))?;

            let save = serde_json::from_str::<SaveFileLayout>(&file_content)
                .map_err(|e| format!("Couldn't parse vault: {}", e))?;

            if save.version != self.version {
                return Err(format!("Incompatible vault version: {}", save.version));
            }

            // Load from vault file
            self.entries = save.vault;
            self.loaded = true;
        }
        else {
            // Trigger setup screen

            self.loaded = true;
        }

        Ok(())
    }

    fn convert_to_savefile(&self) -> SaveFileLayout {
        SaveFileLayout { version: self.version.clone(), vault: self.entries.clone() }
    }

    pub fn save(&self) -> Result<(), String> {
        if !self.loaded {
            return Err("Vault not loaded or incompatible version, cannot save.".into());
        }
        let content = serde_json::to_string_pretty(&self.convert_to_savefile()).map_err(|e| e.to_string())?;

        std::fs::write(self.path.clone(), content).map_err(|e| e.to_string())
    }
    
    pub fn set_master_pw(&self, password: String) {
        println!("Setting master password to: {}", password);
    }
    // pub fn unlock(&mut self) {
    //     println!("Nothing to unlock yet. :)")
    // }


    // // C(reate)
    pub fn new_entry(&mut self, entry: &Entry) {
        self.entries.push(entry.clone())
    }

    // // R(read)
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
    pub fn update_entry(&mut self, id: &Uuid, updated: &UpdateEntry) -> Result<EntryPublic, String> {
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
        }
        else {
            Err(format!("Entry '{}' not found", id))
        }
    }

    pub fn toggle_favorite(&mut self, id: &Uuid) -> Result<EntryPublic, String> {
        if let Some(entry) = self.entries.iter_mut().find(|e| e.id == *id) {
            entry.favorite = !entry.favorite;
            println!("Favoriting {}", id);
            Ok(EntryPublic::from(&*entry))
        } else {
            Err(format!("Entry '{}' not found", id))
        }
    }

    // // D(delete)
    pub fn delete_entry(&mut self, id: &Uuid) -> Result<(), String> {
        if let Some(entry_pos) = self.entries.iter().position(|e| e.id == *id) {
            self.entries.remove(entry_pos);
            println!("Deleting {}", id);
            Ok(())
        } else {
            Err(format!("Entry '{}' not found", id))
        }
    }
}