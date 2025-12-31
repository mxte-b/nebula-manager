import { AnimatePresence } from "motion/react";
import { useVaultStatus } from "../contexts/vaultState";
import App from "./App"
import LoadingScreen from "./LoadingScreen";
import FatalError from "./FatalError";
import SetupScreen from "./SetupScreen";
import UnlockScreen from "./UnlockScreen";

const AppWrapper = () => {
    const { status, loading, error, refreshState } = useVaultStatus();

    const getActiveComponent = () => {
        if (error) return <FatalError key="error" error={error} />;
        
        if (!status || !status.ready || loading) return <LoadingScreen key="loader" />;

        switch (status.state) {
            case "Uninitialized":
                return <SetupScreen key="setup" onSetupCompleted={refreshState} />
            case "Locked":
                return <UnlockScreen key="unlock" onUnlock={refreshState} />
            case "Unlocked": 
                return <App key="app" />
            default:
                break;
        }
    }

    return (
        <AnimatePresence mode="wait">
            { getActiveComponent() }
        </AnimatePresence>
    )
}

export default AppWrapper;