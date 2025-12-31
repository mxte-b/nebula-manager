import { ToastProvider } from "../contexts/toast";
import { ConfirmModalProvider } from "../contexts/confirmModal";
import { RouterProvider } from "../contexts/router";
import { VaultStatusProvider } from "../contexts/vaultState";
import { ErrorProvider } from "../contexts/error";
import AppWrapper from "./AppWrapper";
import ToastManager from "../components/ToastManager";
import ModalManager from "../components/ConfirmModalManager";

const Root = () => {
    return (
        <ConfirmModalProvider>
            <ToastProvider>
                <ErrorProvider>
                    <VaultStatusProvider>
                        <RouterProvider>
                            <AppWrapper />
                            <ToastManager />
                            <ModalManager />
                        </RouterProvider>
                    </VaultStatusProvider>
                </ErrorProvider>
            </ToastProvider>
        </ConfirmModalProvider>
    )
}

export default Root;