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
    pub label: String,
    pub url: String,
    pub name: String,
    pub password: String
}