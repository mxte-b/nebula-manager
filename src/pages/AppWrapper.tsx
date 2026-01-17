import { AnimatePresence } from "motion/react";
import App from "./App"
import LoadingScreen from "./LoadingScreen";
import FatalError from "./FatalError";
import SetupScreen from "./SetupScreen";
import UnlockScreen from "./UnlockScreen";
import { useError } from "../contexts/error";
import { useVault } from "../contexts/vault";

const AppWrapper = () => {
    const { status, loading, refreshStatus } = useVault();
    const { fatalError, addError } = useError();

    const getActiveComponent = () => {
        if (fatalError) return <FatalError key="error" error={fatalError} />;
        
        if (!status || !status.ready || loading) return <LoadingScreen key="loader" />;

        switch (status.state) {
            case "Uninitialized":
                return <SetupScreen key="setup" onSetupCompleted={refreshStatus} />
            case "Locked":
                return <UnlockScreen key="unlock" onUnlock={refreshStatus} />
            case "Unlocked": 
                return <App key="app" />
            default:
                addError({
                    kind: "NotFound",
                    severity: "Fatal",
                    code: "E_NEX_COMPONENT",
                    message: "Target component not found"
                });
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