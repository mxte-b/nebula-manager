import { invoke } from "@tauri-apps/api/core"
import { Entry, EntryDTO, Err, Ok, Result, toEntry, toEntryDTO, UpdateEntry, VaultStatus } from "../types/general";

/**
 * Custom hook for interacting with the Vault backend.
 * 
 * Provides methods to fetch, create, and manage vault entries.
 * Supports both callback-based handling and Result-based async/await handling.
 */
const useVault = () => {

    const setupVault = async (
        masterPassword: string,
        callbacks ?: {
            ok ?: () => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<null, string>> => {
        try {
            await invoke("vault_setup", { masterPassword: masterPassword });

            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const unlockVault = async (
        password: string,
        callbacks ?: {
            ok ?: () => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<null, string>> => {
        try {
            await invoke("vault_unlock", { password: password })

            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }
    
    const getVaultStatus = async (
        callbacks ?: {
            ok ?: (r: VaultStatus) => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<VaultStatus, string>> => {
        try {
            const result = await invoke("vault_get_status") as VaultStatus;

            callbacks?.ok?.(result);
            return Ok(result);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    /**
     * Fetch all vault entries from the backend.
     * 
     * @param callbacks Optional callbacks for immediate handling of results.
     *  - ok: Called with the array of entries if the fetch is successful.
     *  - err: Called with an error message if the fetch fails.
     * 
     * @returns A Promise resolving to a Result containing either:
     *  - Ok<Entry[]>: array of all entries
     *  - Err<string>: error message
     */
    const getVaultEntries = async (
        callbacks ?: {
            ok ?: (r: Entry[]) => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<Entry[], string>> => {
        try {
            const result = await invoke("vault_get_entries") as EntryDTO[];
            const parsed = result.map(e => toEntry(e));

            callbacks?.ok?.(parsed);
            return Ok(parsed);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    /**
     * Fetch the password for a single vault entry.
     * 
     * This is an explicit, sensitive operation — the backend returns the password string
     * for the requested entry id. Only call this when the user intentionally requests the secret.
     * 
     * @param id The UUID string of the entry whose password should be fetched.
     * @param callbacks Optional callbacks for immediate handling of results.
     *  - ok: Called with the password string when successful.
     *  - err: Called with an error message when the operation fails.
     * 
     * @returns A Promise resolving to a Result containing either:
     *  - Ok<string>: the password for the entry
     *  - Err<string>: error message
     */
    const getVaultEntryPassword = async (
        id: string,
        callbacks ?: {
            ok ?: (r: string) => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<string, string>> => {
        try {
            const result = await invoke("vault_get_entry_password", { id: id }) as string;

            callbacks?.ok?.(result);
            return Ok(result);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    /**
     * Create a new vault entry and return the updated list of entries.
     * 
     * @param entry The Entry object to create.
     * @param callbacks Optional callbacks for immediate handling of results.
     *  - ok: Called with the updated array of entries if creation succeeds.
     *  - err: Called with an error message if creation or fetching entries fails.
     * 
     * @returns A Promise resolving to a Result containing either:
     *  - Ok<Entry[]>: updated array of entries
     *  - Err<string>: error message
     */
    const createVaultEntry = async (
        entry: Entry,
        callbacks ?: {
            ok ?: (r: Entry[]) => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<Entry[], string>> => {
        try {
            await invoke("vault_create_entry", { entry: toEntryDTO(entry) });

            const result = await getVaultEntries();
            if (!result.ok) {
                callbacks?.err?.(result.error);
                return Err(result.error);
            }
            
            callbacks?.ok?.(result.value);
            return Ok(result.value);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }

     /**
     * Update an existing vault entry identified by its id.
     * 
     * Send the updated entry data to the backend, then re-fetch the current entries
     * and return the new list. Use this when you want the frontend to reflect the
     * authoritative state from the backend after a successful update.
     * 
     * @param id The id of the entry to update.
     * @param updated The updated Entry object (full representation expected).
     * @param callbacks Optional callbacks for immediate handling of results.
     *  - ok: Called with the updated array of entries if update succeeds.
     *  - err: Called with an error message if update or fetching entries fails.
     * 
     * @returns A Promise resolving to a Result containing either:
     *  - Ok<Entry[]>: updated array of entries
     *  - Err<string>: error message
     */
    const updateVaultEntry = async (
        id: string,
        updated: UpdateEntry,
        callbacks ?: {
            ok ?: (r: Entry) => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<Entry, string>> => {
        try {
            const result = await invoke("vault_update_entry", { id: id, new: updated }) as EntryDTO; 
            const parsed = toEntry(result);

            callbacks?.ok?.(parsed);
            return Ok(parsed);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    /**
     * Toggle the "favorite" state of an entry.
     * 
     * This sends a command to the backend to flip the `favorite` boolean for the entry
     * identified by `id`. The function does not return the updated entries — it returns
     * a Result indicating success or failure. The caller can choose to re-fetch entries
     * (via getVaultEntries) or update local state optimistically.
     * 
     * @param id The id of the entry to toggle favorite.
     * @param callbacks Optional callbacks for immediate handling of results.
     *  - ok: Called when the toggle finishes successfully.
     *  - err: Called with an error message when the operation fails.
     * 
     * @returns A Promise resolving to a Result containing either:
     *  - Ok<null>: indicates successful toggle
     *  - Err<string>: error message
     */
    const toggleFavorite = async (
        id: string,
        callbacks ?: {
            ok ?: () => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<null, string>> => {
        try {
            await invoke("vault_toggle_favorite", { id: id });

            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    /**
     * Delete a vault entry identified by its id.
     * 
     * Sends a delete command to the backend and then re-fetches the entries to return the
     * authoritative, up-to-date list to the caller via callbacks or the returned Result.
     * 
     * @param id The id of the entry to delete.
     * @param callbacks Optional callbacks for immediate handling of results.
     *  - ok: Called when deletion succeeds.
     *  - err: Called with an error message if deletion or fetching entries fails.
     * 
     * @returns A Promise resolving to a Result containing either:
     *  - Ok<null>: indicates successful deletion
     *  - Err<string>: error message
     */
    const deleteVaultEntry = async (
        id: string,
        callbacks ?: {
            ok ?: () => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<null, string>> => {
        try {
            await invoke("vault_delete_entry", { id: id });

            const result = await getVaultEntries();
            if (!result.ok) {
                callbacks?.err?.(result.error);
                return Err(result.error);
            }
            
            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e instanceof Error ? e.message : String(e);

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    return {
        setupVault,
        unlockVault,
        getVaultStatus,
        getVaultEntries,
        getVaultEntryPassword,
        createVaultEntry,
        updateVaultEntry,
        toggleFavorite,
        deleteVaultEntry
    }
}

export default useVault;
