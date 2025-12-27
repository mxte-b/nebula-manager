import { AlertProvider } from "../contexts/alert";
import { ConfirmPopupProvider } from "../contexts/confirmPopup";
import { RouterProvider } from "../contexts/router";
import { VaultStateProvider } from "../contexts/vaultState";
import AppWrapper from "./AppWrapper";

const Root = () => {
    return (
        <VaultStateProvider>
            <RouterProvider>
                <AlertProvider>
                    <ConfirmPopupProvider>
                        <AppWrapper />
                    </ConfirmPopupProvider>
                </AlertProvider>
            </RouterProvider>
        </VaultStateProvider>
    )
}

export default Root;