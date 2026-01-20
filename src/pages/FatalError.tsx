import { VaultError } from "../types/general";
import "../styles/FatalError.scss";
import { motion } from "motion/react";

const FatalError = ({ error }: { error: VaultError }) => {
    return (

        <motion.div 
            key={"fatal"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fatal-error"
        >
            <div className="fatal-error-bg-overlay">
                <div className="fatal-error-bg"></div>
            </div>
            <div className="fatal-error-header">
                <h1 className="fatal-error-title">FATAL ERROR!</h1>
                <div className="fatal-error-code">{error.code}</div>
            </div>
        
            <div className="fatal-error-body">
                <div className="fatal-error-notice">A fatal error has occured. Please restart the application.</div>
                <div className="fatal-error-details">
                    <div className="fatal-error-label">Error details</div>
                    <div className="fatal-error-kind">
                        <span className="title">Type: </span>{error.kind}
                    </div>
                    <div className="fatal-error-message">
                        <span className="title">Message: </span>{error.message}
                    </div>
                </div>
            </div>
            <div className="fatal-error-note">Note: If this happens repeatedly, please open an issue on GitHub.</div>
        </motion.div>
    )
}

export default FatalError;