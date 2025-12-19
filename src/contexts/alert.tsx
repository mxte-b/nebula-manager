import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Alert, AlertContextType } from "../types/general";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const idRef = useRef<number>(0); 

    const addAlert = (alert: Omit<Alert, "id">) => {
        setAlerts(p => {
            // If we find an already present alert of the same type,
            // we just update the current ones to prevent large quantities
            // of alerts.
            const existingIndex = p.findIndex(a => a.type == alert.type)

            // If there is an identical alert with the same message,
            // increment the duplicate counter
            if (existingIndex > -1 && p[existingIndex].message == alert.message) {
                return p.map(a => a.id == p[existingIndex].id ? {...a, count: (a.count ?? 1) + 1} : a);
            }
            
            // If the message isn't the same, just mark the old one for swapping and remove it with a delay
            if (existingIndex > -1 && p[existingIndex].message != alert.message) {
                
                return p.flatMap((a, i) => {
                    return i == existingIndex ? [{...a, _isSwap: true}, { ...alert, id: String(++idRef.current) }]: [a];
                });
            }

            // Else, add the alert
            return [...p, {...alert, id: String((idRef.current++ % 100) + 1)}]
        });

        // Call close on alerts to be swapped
        setTimeout(() => {
            setAlerts(prev => prev.filter(a => !a._isSwap));
        }, 100);
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