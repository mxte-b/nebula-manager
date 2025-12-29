import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { VaultStatus, VaultStatusContextType } from "../types/general";
import useVault from "../hooks/useVault";

const VaultStatusContext = createContext<VaultStatusContextType | undefined>(undefined);

export const VaultStatusProvider = ({ children }: { children: ReactNode }) => {
    const { getVaultStatus } = useVault();

    const [status, setStatus] = useState<VaultStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refreshState = () => {
        setLoading(true);

        getVaultStatus({
            ok: (s) => {
                setStatus(s);
                setError(null);
            },
            err: setError
        }).then(() => setLoading(false));
    }

    useEffect(() => {
        refreshState();
    }, []);

    return <VaultStatusContext.Provider value={{ status, loading, error, refreshState }}>
        {children}
    </VaultStatusContext.Provider>
}

export const useVaultStatus = () => {
    const context = useContext(VaultStatusContext);
    if (!context) throw new Error("useVaultStatus must be used inside an VaultStatusProvider.");
    return context;
}