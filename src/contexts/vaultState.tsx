import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { VaultError, VaultStatus, VaultStatusContextType } from "../types/general";
import useVault from "../hooks/useVault";

const VaultStatusContext = createContext<VaultStatusContextType | undefined>(undefined);

export const VaultStatusProvider = ({ children }: { children: ReactNode }) => {
    const { getVaultStatus } = useVault();

    const [status, setStatus] = useState<VaultStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<VaultError | undefined>(undefined);

    const refreshState = async () => {
        await getVaultStatus({
            ok: (s) => {
                setStatus(s);
                setError(undefined);
            },
            err: setError,
        });
    };

    useEffect(() => {
        setLoading(true);
        refreshState();
        setLoading(false);
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