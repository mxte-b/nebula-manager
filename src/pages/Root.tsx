import { ToastProvider } from "../contexts/toast";
import { ConfirmModalProvider } from "../contexts/confirmModal";
import { RouterProvider } from "../contexts/router";
import { VaultStatusProvider } from "../contexts/vaultState";
import AppWrapper from "./AppWrapper";
import ToastManager from "../components/ToastManager";
import ModalManager from "../components/ConfirmModalManager";

const Root = () => {
    return (
        <VaultStatusProvider>
            <RouterProvider>
                <ToastProvider>
                    <ConfirmModalProvider>
                        <AppWrapper />
                        <ToastManager />
                        <ModalManager />
                    </ConfirmModalProvider>
                </ToastProvider>
            </RouterProvider>
        </VaultStatusProvider>
    )
}

export default Root;