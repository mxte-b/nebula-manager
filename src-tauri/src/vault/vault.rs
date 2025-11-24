use std::path::{PathBuf};
use serde::{Deserialize, Serialize};
use crate::vault::Entry;

const VERSION: &str = "0.3.0";

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
    
    // pub fn set_master_pw() {}
    // pub fn unlock(&mut self) {
    //     println!("Nothing to unlock yet. :)")
    // }


    // // C(reate)
    pub fn new_entry(&mut self, entry: &Entry) {
        self.entries.push(entry.clone());
    }

    // // R(read)
    pub fn get_entries(&self) -> Vec<Entry> {
        self.entries.clone()
    }

    // // U(update)
    pub fn update_entry(&mut self, label: &str, updated: &Entry) {
        if let Some(entry_pos) = self.entries.iter().position(|e| e.label == label) {
            self.entries[entry_pos] = updated.clone();
        }
    }

    // // D(delete)
    pub fn delete_entry(&mut self, label: &str) {
        if let Some(entry_pos) = self.entries.iter().position(|e| e.label == label) {
            self.entries.remove(entry_pos);
        }
    }
}