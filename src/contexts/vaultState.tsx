import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { VaultStatus, VaultStatusContextType } from "../types/general";
import useVault from "../hooks/useVault";
import { useError } from "./error";

const VaultStatusContext = createContext<VaultStatusContextType | undefined>(undefined);

export const VaultStatusProvider = ({ children }: { children: ReactNode }) => {
    const { getVaultStatus } = useVault();
    const { fatalError, addError, clearFatalError } = useError();

    const [status, setStatus] = useState<VaultStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshState = async () => {
        await getVaultStatus({
            ok: (s) => {
                setStatus(s);
                if (fatalError) clearFatalError();
            },
            err: addError,
        });
    };

    useEffect(() => {
        setLoading(true);
        refreshState();
        setLoading(false);
    }, []);

    return <VaultStatusContext.Provider value={{ status, loading, refreshState }}>
        {children}
    </VaultStatusContext.Provider>
}

export const useVaultStatus = () => {
    const context = useContext(VaultStatusContext);
    if (!context) throw new Error("useVaultStatus must be used inside an VaultStatusProvider.");
    return context;
}