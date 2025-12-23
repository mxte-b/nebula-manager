import { createContext, ReactNode, useContext, useState } from "react";
import { ConfirmPopup, ConfirmPopupContextType } from "../types/general";

const ConfirmPopupContext = createContext<ConfirmPopupContextType | undefined>(undefined);

export const ConfirmPopupProvider = ({ children }: { children: ReactNode }) => {
    const [popup, setPopup] = useState<ConfirmPopup | null>(null);

    return <ConfirmPopupContext.Provider value={{ popup: popup, openPopup: setPopup, closePopup: () => setPopup(null) }}>
        {children}
    </ConfirmPopupContext.Provider>
}

export const useConfirmPopup = () => {
    const context = useContext(ConfirmPopupContext);
    if (!context) throw new Error("useConfirmPopup must be used inside an ConfirmPopupProvider.");
    return context;
}