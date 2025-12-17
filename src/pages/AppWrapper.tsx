import { AlertProvider } from "../contexts/alert"
import { RouterProvider } from "../contexts/router"
import App from "./App"

const AppWrapper = () => {
    return (
        <RouterProvider>
            <AlertProvider>
                <App />
            </AlertProvider>
        </RouterProvider>
    )
}

export default AppWrapper;