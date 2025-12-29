import { createContext, ReactNode, useContext, useState } from "react";
import { ConfirmModal, ConfirmModalContextType } from "../types/general";

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined);

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
    const [modal, setModal] = useState<ConfirmModal | null>(null);

    return <ConfirmModalContext.Provider value={{ modal: modal, openModal: setModal, closeModal: () => setModal(null) }}>
        {children}
    </ConfirmModalContext.Provider>
}

export const useConfirmModal = () => {
    const context = useContext(ConfirmModalContext);
    if (!context) throw new Error("useConfirmModal must be used inside an ConfirmModalProvider.");
    return context;
}