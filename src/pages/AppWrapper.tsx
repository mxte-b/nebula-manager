import { AlertProvider } from "../contexts/alert"
import { ConfirmPopupProvider } from "../contexts/confirmPopup"
import { RouterProvider } from "../contexts/router"
import App from "./App"

const AppWrapper = () => {
    return (
        <RouterProvider>
            <AlertProvider>
                <ConfirmPopupProvider>
                    <App />
                </ConfirmPopupProvider>
            </AlertProvider>
        </RouterProvider>
    )
}

export default AppWrapper;