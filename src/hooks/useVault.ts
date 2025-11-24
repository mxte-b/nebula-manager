import { invoke } from "@tauri-apps/api/core"
import { Entry, Err, Ok, Result } from "../types/general";

const useVault = () => {
    
    const getVaultEntries = async (
        callbacks ?: {
            ok ?: (r: Entry[]) => void;
            err ?: (e: string) => void;
        }
    ): Promise<Result<Entry[], string>> => {
        try {
            const result = await invoke("vault_get_entries") as Entry[];

            // Invoke callback and return
            callbacks?.ok?.(result);
            return Ok(result);
        }
        catch (e) {
            const error = e as string;
            // Invoke callback and return
            callbacks?.err?.(error);
            return Err(error);
        }
    }

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
            const error = e as string;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    return {
        getVaultEntries,
        createVaultEntry
    }
}

export default useVault;