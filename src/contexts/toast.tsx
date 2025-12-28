import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Toast, ToastContextType } from "../types/general";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const idRef = useRef<number>(0); 

    const addToast = (toast: Omit<Toast, "id">) => {
        setToasts(p => {
            // If we find an already present toast of the same type,
            // we just update the current ones to prevent large quantities
            // of toasts.
            const existingIndex = p.findIndex(a => a.type == toast.type)

            // If there is an identical toast with the same message,
            // increment the duplicate counter
            if (existingIndex > -1 && p[existingIndex].message == toast.message) {
                return p.map(a => a.id == p[existingIndex].id ? {...a, count: (a.count ?? 1) + 1} : a);
            }
            
            // If the message isn't the same, just mark the old one for swapping and remove it with a delay
            if (existingIndex > -1 && p[existingIndex].message != toast.message) {
                
                return p.flatMap((a, i) => {
                    return i == existingIndex ? [{...a, _isSwap: true}, { ...toast, id: String(++idRef.current) }]: [a];
                });
            }

            // Else, add the toast
            return [...p, {...toast, id: String((idRef.current++ % 100) + 1)}]
        });

        // Call close on toasts to be swapped
        setTimeout(() => {
            setToasts(prev => prev.filter(a => !a._isSwap));
        }, 100);
    }

    const removeToast = (id: string) => {
        setToasts(p => p.filter(a => a.id != id));
    }

    return <ToastContext.Provider value={{ toasts: toasts, addToast: addToast, removeToast: removeToast }}>
        {children}
    </ToastContext.Provider>
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used inside an ToastProvider.");
    return context;
}