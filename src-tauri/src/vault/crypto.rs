use argon2::Argon2;
use chacha20poly1305::{
    aead::{Aead, OsRng},
    AeadCore, Key, KeyInit, XChaCha20Poly1305, XNonce,
};

pub struct VaultCryptoManager;

impl VaultCryptoManager {
    pub fn derive_kek(password: &[u8], salt: &[u8]) -> Result<[u8; 32], String> {
        let mut kek = [0u8; 32];
        Argon2::default()
            .hash_password_into(password, salt, &mut kek)
            .map_err(|e| e.to_string())?;

        Ok(kek)
    }

    pub fn wrap_dek(dek: &[u8], kek: &[u8]) -> Result<(Vec<u8>, XNonce), String> {
        let cipher = XChaCha20Poly1305::new(Key::from_slice(kek));
        let dek_nonce = XChaCha20Poly1305::generate_nonce(&mut OsRng);
        let wrapped_dek = cipher.encrypt(&dek_nonce, dek).map_err(|e| e.to_string())?;

        Ok((wrapped_dek, dek_nonce))
    }

    pub fn unwrap_dek(wrapped_dek: &[u8], kek: &[u8], nonce: &XNonce) -> Result<[u8; 32], String> {
        let cipher = XChaCha20Poly1305::new(Key::from_slice(&kek));

        let dek_vec = cipher
            .decrypt(&nonce, wrapped_dek)
            .map_err(|e| e.to_string())?;

        Ok(dek_vec
            .as_slice()
            .try_into()
            .map_err(|_| "Decrypted DEK is not 32 bytes")?)
    }
}
