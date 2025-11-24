import { invoke } from "@tauri-apps/api/core"
import { Entry, Err, Ok, Result } from "../types/general";

/**
 * Custom hook for interacting with the Vault backend.
 * 
 * Provides methods to fetch, create, and manage vault entries.
 * Supports both callback-based handling and Result-based async/await handling.
 */
const useVault = () => {
    
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
            const result = await invoke("vault_get_entries") as Entry[];

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
            await invoke("vault_create_entry", { entry: entry });

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
     * Update an existing vault entry identified by its label.
     * 
     * @param label The label of the entry to update.
     * @param updated The updated Entry object.
     * @param callbacks Optional callbacks for immediate handling of results.
     *  - ok: Called with the updated array of entries if update succeeds.
     *  - err: Called with an error message if update or fetching entries fails.
     * 
     * @returns A Promise resolving to a Result containing either:
     *  - Ok<Entry[]>: updated array of entries
     *  - Err<string>: error message
     */
    const updateVaultEntry = async (
        label: string,
        updated: Entry,
        callbacks ?: {
            ok ?: (r: Entry[]) => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<Entry[], string>> => {
        try {
            await invoke("vault_update_entry", { label: label, new: updated });

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
     * Delete a vault entry identified by its label.
     * 
     * @param label The label of the entry to delete.
     * @param callbacks Optional callbacks for immediate handling of results.
     *  - ok: Called when deletion succeeds.
     *  - err: Called with an error message if deletion or fetching entries fails.
     * 
     * @returns A Promise resolving to a Result containing either:
     *  - Ok<null>: indicates successful deletion
     *  - Err<string>: error message
     */
    const deleteVaultEntry = async (
        label: string,
        callbacks ?: {
            ok ?: () => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<null, string>> => {
        try {
            await invoke("vault_delete_entry", { label: label });

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
        getVaultEntries,
        createVaultEntry,
        updateVaultEntry,
        deleteVaultEntry
    }
}

export default useVault;