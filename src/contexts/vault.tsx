import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Entry, EntryDTO, EntryUseResult, Err, Ok, toEntry, toEntryDTO, UpdateEntry, VaultCallbacks, VaultContextType, VaultError, VaultResult, VaultStatus } from "../types/general";
import { useError } from "./error";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider = ({ children }: { children: ReactNode }) => {
    const { fatalError, addError, clearFatalError } = useError();
    
    const [entries, setEntries] = useState<Entry[] | null>(null);
    const [status, setStatus] = useState<VaultStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const lastClearTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const setupVault = async (
        masterPassword: string,
        callbacks ?: VaultCallbacks
    ): Promise<VaultResult<null>> => {
        try {
            await invoke("vault_setup", { masterPassword: masterPassword });

            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const unlockVault = async (
        password: string,
        callbacks ?: VaultCallbacks
    ): Promise<VaultResult<null>> => {
        try {
            await invoke("vault_unlock", { password: password })

            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }
    
    const getVaultStatus = async (
        callbacks ?: VaultCallbacks<VaultStatus>
    ): Promise<VaultResult<VaultStatus>> => {
        try {
            const result = await invoke("vault_get_status") as VaultStatus;

            if (result.last_error) {
                callbacks?.err?.(result.last_error);
                return Err(result.last_error);
            }

            callbacks?.ok?.(result);
            return Ok(result);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const refreshStatus = async () => {
        console.log("REFRESHING STATUS")
        await getVaultStatus({
            ok: (s) => {
                setStatus(s);
                if (fatalError) clearFatalError();
            },
            err: addError,
        });
    };

    const getVaultEntries = async (
        callbacks ?: VaultCallbacks<Entry[]>
    ): Promise<VaultResult<Entry[]>> => {
        try {
            const result = await invoke("vault_get_entries") as EntryDTO[];
            const parsed = result.map(e => toEntry(e));

            callbacks?.ok?.(parsed);
            return Ok(parsed);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const getEntryPassword = async (
        id: string,
        callbacks ?: VaultCallbacks<string>
    ): Promise<VaultResult<string>> => {
        try {
            const result = await invoke("vault_get_entry_password", { id: id }) as string;

            callbacks?.ok?.(result);
            return Ok(result);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const createEntry = async (
        entry: Entry,
        callbacks?: VaultCallbacks<Entry[]>
    ): Promise<VaultResult<Entry[]>> => {
        try {
            await invoke("vault_create_entry", { entry: toEntryDTO(entry) });

            const result = await getVaultEntries();
            if (!result.ok) {
                callbacks?.err?.(result.error);
                return Err(result.error);
            }

            setEntries(result.value);
            
            callbacks?.ok?.(result.value);
            return Ok(result.value);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const updateEntry = async (
        id: string,
        updated: UpdateEntry,
        callbacks ?: VaultCallbacks<Entry>
    ): Promise<VaultResult<Entry>> => {
        try {
            const result = await invoke("vault_update_entry", { id: id, new: updated }) as EntryDTO; 
            const parsed = toEntry(result);

            setEntries(p => p?.map(e => e.id === id ? parsed : e) || null);

            callbacks?.ok?.(parsed);
            return Ok(parsed);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const toggleFavorite = async (
        id: string,
        callbacks ?: VaultCallbacks
    ): Promise<VaultResult<null>> => {
        try {
            await invoke("vault_toggle_favorite", { id: id });

            setEntries(p => p?.map(e => e.id === id ? {...e, favorite: !e.favorite} as Entry : e) || null)

            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const deleteEntry = async (
        id: string,
        callbacks ?: VaultCallbacks
    ): Promise<VaultResult<null>> => {
        try {
            await invoke("vault_delete_entry", { id: id });

            setEntries(p => p?.filter(e => e.id != id) || null);
            
            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const copyEntryDetail = async (
        id: string,
        detail: "name" | "password",
        autoClearTime ?: number,
        callbacks ?: VaultCallbacks
    ): Promise<VaultResult<null>> => {
        try {
            const entryUseResult = await invoke(detail == "password" ? "vault_copy_entry_password" : "vault_copy_entry_name", { id: id }) as EntryUseResult;

            setEntries(p => p?.map(e => e.id === id ? {...e, lastUsed: new Date(entryUseResult.lastUse), uses: entryUseResult.uses} as Entry : e) || null)

            if (lastClearTimeoutRef.current) {
                clearTimeout(lastClearTimeoutRef.current);
            }

            lastClearTimeoutRef.current = setTimeout(async () => {
                invoke("vault_clear_clipboard_safe")
                    .catch(e => {
                        const error = e as VaultError;
                        callbacks?.err?.(error);
                    });
                lastClearTimeoutRef.current = undefined;
            }, autoClearTime || 30000);

            callbacks?.ok?.();
            return Ok(null);
        }
        catch (e) {
            const error = e as VaultError;

            callbacks?.err?.(error);
            return Err(error);
        }
    }

    const searchEntries = (query: string) => {
        if (!entries || !query) return [];

        return entries.filter(e => e.label.toLowerCase().startsWith(query.toLowerCase())).sort((a, b) => b.uses - a.uses);
    }

    useEffect(() => {
        setLoading(true);
        refreshStatus().finally(() => setLoading(false));

        let unlistenStatusChanged: UnlistenFn | undefined = undefined;

        (async () => {
            unlistenStatusChanged = await listen("vault_status_changed", refreshStatus);
        })();

        return () => {
            unlistenStatusChanged?.();
        }
    }, []);

    useEffect(() => {
        if (status && status.ready && status.state == "Unlocked") {
            getVaultEntries({
                ok: setEntries,
                err: addError
            });
        }
    }, [status]);

    return <VaultContext.Provider value={{ 
        status, 
        loading, 
        refreshStatus, 
        setupVault,
        unlockVault, 
        entries, 
        createEntry, 
        updateEntry, 
        toggleFavorite, 
        deleteEntry, 
        getEntryPassword,
        copyEntryDetail,
        searchEntries
    }}>
        {children}
    </VaultContext.Provider>
}

export const useVault = () => {
    const context = useContext(VaultContext);
    if (!context) throw new Error("useVault must be used inside an VaultProvider.");
    return context;
}