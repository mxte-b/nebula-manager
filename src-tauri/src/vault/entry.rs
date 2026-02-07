use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
pub enum PasswordStrength {
    Weak,
    Okay,
    Strong,
    Excellent
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub id: Uuid,
    #[serde(with = "time::serde::rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    pub modified_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339::option", default)]
    pub last_used: Option<OffsetDateTime>,
    pub uses: u32,
    pub label: String,
    pub url: String,
    pub name: String,
    pub password: String,
    pub password_strength: PasswordStrength,
    pub favorite: bool,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct EntryPublic {
    pub id: Uuid,
    #[serde(with = "time::serde::rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    pub modified_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339::option", default)]
    pub last_used: Option<OffsetDateTime>,
    pub uses: u32,
    pub label: String,
    pub url: String,
    pub name: String,
    pub password_strength: PasswordStrength,
    pub favorite: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct UpdateEntry {
    pub label: Option<String>,
    pub url: Option<String>,
    pub name: Option<String>,
    pub password: Option<String>,
    pub password_strength: Option<PasswordStrength>
}

impl From<&Entry> for EntryPublic {
    fn from(entry: &Entry) -> Self {
        EntryPublic {
            id: entry.id,
            created_at: entry.created_at,
            modified_at: entry.modified_at,
            last_used: entry.last_used,
            uses: entry.uses,
            label: entry.label.clone(),
            url: entry.url.clone(),
            name: entry.name.clone(),
            favorite: entry.favorite,
            password_strength: entry.password_strength.clone()
        }
    }
}
