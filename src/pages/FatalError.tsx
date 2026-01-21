import { VaultError } from "../types/general";
import "../styles/FatalError.scss";
import { motion } from "motion/react";
import Icons from "../components/Icons";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import HoverableIcon from "../components/HoverableIcon";
import Tooltip from "../components/Tooltip";
import { useEffect, useState } from "react";

const FatalError = ({ error }: { error: VaultError }) => {
    const [copiedRecently, setCopiedRecently] = useState<boolean>(false);

    useEffect(() => {
        let t = undefined;

        if (copiedRecently) {
            t = setTimeout(() => setCopiedRecently(false), 5000);
        }

        return () => clearTimeout(t);
    }, [copiedRecently]);

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
                        <div className="title">Message: </div>
                        <div>{error.message}</div>
                        
                        <Tooltip 
                            text={copiedRecently ? "Copied!" : "Copy"}
                            onExitComplete={() => setCopiedRecently(false)}
                        >
                            <HoverableIcon
                                hoverFg="#ff8686"
                                hoverBg="#c0666650"
                                onClick={() => {
                                    writeText(error.message);
                                    setCopiedRecently(true);
                                }}
                            >
                                <Icons.Copy />
                            </HoverableIcon>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="fatal-error-note">Note: If this happens repeatedly, please open an issue on GitHub.</div>
        </motion.div>
    )
}

export default FatalError;