import { AnimatePresence } from "motion/react";
import { useVaultState } from "../contexts/vaultState";
import App from "./App"
import LoadingScreen from "./LoadingScreen";
import FatalError from "./FatalError";
import SetupScreen from "./SetupScreen";

const AppWrapper = () => {
    const { state, loading, error } = useVaultState();

    const getActiveComponent = () => {
        if (loading) return <LoadingScreen key="loader" />;
        if (error) return <FatalError key="error" error={error} />;
        if (state == "Uninitialized") return <SetupScreen key="setup" />

        return <App key="app" />;
    }

    return (
        <AnimatePresence>
            { getActiveComponent() }
        </AnimatePresence>
    )
}

export default AppWrapper;