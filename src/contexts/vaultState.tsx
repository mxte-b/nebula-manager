import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { VaultState, VaultStateContextType } from "../types/general";
import useVault from "../hooks/useVault";

const VaultStateContext = createContext<VaultStateContextType | undefined>(undefined);

export const VaultStateProvider = ({ children }: { children: ReactNode }) => {
    const { getVaultState } = useVault();

    const [state, setState] = useState<VaultState | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refreshState = () => {
        setLoading(true);

        getVaultState({
            ok: (r) => {
                setState(r);
                setError(null);
            },
            err: setError
        }).then(() => setLoading(false));
    }

    useEffect(() => {
        refreshState();
    }, []);

    return <VaultStateContext.Provider value={{ state, loading, error, refreshState }}>
        {children}
    </VaultStateContext.Provider>
}

export const useVaultState = () => {
    const context = useContext(VaultStateContext);
    if (!context) throw new Error("useVaultState must be used inside an VaultStateProvider.");
    return context;
}