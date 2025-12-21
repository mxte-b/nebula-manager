import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Popup, PopupContextType } from "../types/general";

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
    const [popup, setPopup] = useState<Popup | null>();

    return <PopupContext.Provider value={{ popup: popup, openPopup: setPopup, closePopup: () => setPopup(null) }}>
        {children}
    </PopupContext.Provider>
}

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) throw new Error("usePopup must be used inside an PopupProvider.");
    return context;
}