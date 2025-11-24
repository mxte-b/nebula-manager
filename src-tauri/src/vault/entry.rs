use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Entry {
    pub label: String,
    pub url: String,
    pub name: String,
    pub password: String
}