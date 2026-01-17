import { ToastProvider } from "../contexts/toast";
import { ModalProvider } from "../contexts/modal";
import { RouterProvider } from "../contexts/router";
import { ErrorProvider } from "../contexts/error";
import AppWrapper from "./AppWrapper";
import ToastManager from "../components/ToastManager";
import ModalManager from "../components/ModalManager";
import { VaultProvider } from "../contexts/vault";

const Root = () => {
    return (
        <ModalProvider>
            <ToastProvider>
                <ErrorProvider>
                    <VaultProvider>
                        <RouterProvider>
                            <AppWrapper />
                            <ToastManager />
                            <ModalManager />
                        </RouterProvider>
                    </VaultProvider>
                </ErrorProvider>
            </ToastProvider>
        </ModalProvider>
    )
}

export default Root;