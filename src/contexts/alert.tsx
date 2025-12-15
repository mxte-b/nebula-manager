import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Alert, AlertContextType } from "../types/general";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const idRef = useRef<number>(0); 

    const addAlert = (alert: Omit<Alert, "id">) => {
        setAlerts(p => [...p, { ...alert, id: String(++idRef.current) }]);
    }

    const removeAlert = (id: string) => {
        setAlerts(p => p.filter(a => a.id != id));
    }

    return <AlertContext.Provider value={{ alerts: alerts, addAlert: addAlert, removeAlert: removeAlert }}>
        {children}
    </AlertContext.Provider>
}

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error("useAlert must be used inside an AlertProvider.");
    return context;
}