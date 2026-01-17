import { createContext, ReactNode, useContext, useState } from "react";
import { VaultError } from "../types/general";
import { useModal } from "./modal";
import { useToast } from "./toast";

interface ErrorContextType {
    fatalError ?: VaultError;
    addError: (error: VaultError) => void;
    clearFatalError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [fatalError, setFatalError] = useState<VaultError | undefined>(undefined);
    const { openModal } = useModal();
    const { addToast } = useToast();

    const addError = (error: VaultError) => {
        console.log(error)
        switch (error.severity) {
            case "Fatal":
                setFatalError(error);
                break;

            case "Blocking":
                openModal({
                    type: "confirm",
                    title: "An error occured",
                    message: error.message,
                    onConfirm: () => {},
                    onCancel: () => {},
                });
                break;

            case "Soft":
                addToast({
                    type: "error",
                    message: error.message,
                    duration: 3000,
                }); 
                break;

            default:
                addToast({
                    type: "warning",
                    message: "Unknown error type.",
                    duration: 3000,
                });
                break;
        }
    };

    const clearFatalError = () => {
        setFatalError(undefined);
    };

    return (
        <ErrorContext.Provider value={{ fatalError, addError, clearFatalError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error("useError must be used inside an ErrorProvider.");
    return context;
};