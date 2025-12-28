import { createContext, ReactNode, useContext, useState } from "react";
import { ConfirmModal, ConfirmModalContextType } from "../types/general";

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined);

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
    const [popup, setPopup] = useState<ConfirmModal | null>(null);

    return <ConfirmModalContext.Provider value={{ popup: popup, openPopup: setPopup, closePopup: () => setPopup(null) }}>
        {children}
    </ConfirmModalContext.Provider>
}

export const useConfirmModal = () => {
    const context = useContext(ConfirmModalContext);
    if (!context) throw new Error("useConfirmModal must be used inside an ConfirmModalProvider.");
    return context;
}