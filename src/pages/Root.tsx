import { ToastProvider } from "../contexts/toast";
import { ModalProvider } from "../contexts/modal";
import { RouterProvider } from "../contexts/router";
import { VaultStatusProvider } from "../contexts/vaultState";
import { ErrorProvider } from "../contexts/error";
import AppWrapper from "./AppWrapper";
import ToastManager from "../components/ToastManager";
import ModalManager from "../components/ModalManager";

const Root = () => {
    return (
        <ModalProvider>
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
        </ModalProvider>
    )
}

export default Root;