import { ToastProvider } from "../contexts/toast";
import { ConfirmModalProvider } from "../contexts/confirmModal";
import { RouterProvider } from "../contexts/router";
import { VaultStateProvider } from "../contexts/vaultState";
import AppWrapper from "./AppWrapper";

const Root = () => {
    return (
        <VaultStateProvider>
            <RouterProvider>
                <ToastProvider>
                    <ConfirmModalProvider>
                        <AppWrapper />
                    </ConfirmModalProvider>
                </ToastProvider>
            </RouterProvider>
        </VaultStateProvider>
    )
}

export default Root;