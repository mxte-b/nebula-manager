use std::path::{PathBuf};
use serde::{Deserialize, Serialize};
use crate::vault::Entry;

const VERSION: &str = "Nebula Manager - v0.2";

pub struct Vault {
    version: String,
    entries: Vec<Entry>,
    path: PathBuf,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SaveFileLayout {
    version: String,
    vault: Vec<Entry>
}

impl Vault {
    pub fn new(path: PathBuf) -> Self {
        Vault { 
            version: String::from(VERSION),
            entries: Vec::new(), 
            path: path
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

            // Load from vault file
            self.entries = save.vault;
        }

        Ok(())
    }

    fn convert_to_savefile(&self) -> SaveFileLayout {
        SaveFileLayout { version: VERSION.to_string(), vault: self.entries.clone() }
    }

    pub fn save(&self) {
        let content = serde_json::to_string_pretty(&self.convert_to_savefile());

        match std::fs::write(self.path.clone(), content.unwrap()) {
            Ok(()) => println!("Vault saved to file."),
            Err(e) => println!("Error while saving vault {}", e),
        }
        // println!("{}", content.unwrap());
    }
    
    // pub fn set_master_pw() {}
    // pub fn unlock(&mut self) {
    //     println!("Nothing to unlock yet. :)")
    // }


    // // C(reate)
    // pub fn new_entry(entry: &Entry) {

    // }

    // // R(read)
    // pub fn get_entries() {}

    // // U(update)
    // pub fn update_entry(label: String, updated: &Entry) {}

    // // D(delete)
    // pub fn delete_entry() {}
}