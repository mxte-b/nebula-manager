use time::{OffsetDateTime};
use serde::{Deserialize, Serialize};
use uuid::{Uuid};


#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub id: Uuid,
    #[serde(with = "time::serde::rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    pub modified_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    pub last_used: OffsetDateTime,
    pub label: String,
    pub url: String,
    pub name: String,
    pub password: String,
    pub favorite: bool
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct EntryPublic {
    pub id: Uuid,
    #[serde(with = "time::serde::rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    pub modified_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    pub last_used: OffsetDateTime,
    pub label: String,
    pub url: String,
    pub name: String,
    pub favorite: bool
}

impl From<&Entry> for EntryPublic {
    fn from(entry: &Entry) -> Self {
        EntryPublic {
            id: entry.id,
            created_at: entry.created_at,
            modified_at: entry.modified_at,
            last_used: entry.last_used,
            label: entry.label.clone(),
            url: entry.url.clone(),
            name: entry.name.clone(),
            favorite: entry.favorite,
        }
    }
}