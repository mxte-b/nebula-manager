import { createContext, ReactNode, useContext, useState } from "react";
import { Modal, ModalContextType } from "../types/general";

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modal, setModal] = useState<Modal | null>(null);

    return <ModalContext.Provider value={{ modal: modal, openModal: setModal, closeModal: () => setModal(null) }}>
        {children}
    </ModalContext.Provider>
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used inside an ModalProvider.");
    return context;
}