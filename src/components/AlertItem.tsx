import { FunctionComponent, JSX, useEffect, useMemo } from "react";
import { Alert, AlertType } from "../types/general";
import { motion } from "motion/react"
import Icons from "./Icons";

const AlertItem = (
{
    alert,
    onClose
}
:{
    alert: Alert,
    onClose: (id: string) => void
}
) => {

    const alertIconMap: Map<AlertType, JSX.Element> = new Map<AlertType, JSX.Element>([
        ["success", <Icons.CheckCircleFill />],
        ["warning", <Icons.ExclamationCircleFill />],
        ["error", <Icons.XCircleFill />],
    ]);

    const alertIcon = useMemo(() => alertIconMap.get(alert.type ?? "success"), [alert]);

    useEffect(() => {
        console.log(alert.count)
        const t = setTimeout(() => onClose(alert.id), alert.duration);
        return () => clearTimeout(t);
    }, [alert.count]);

    return (
        <motion.div
            className="alert-wrapper"
            style={{
                zIndex: Number(alert.id)
            }}
            layout
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.1 }}
        >
            <motion.div
                className={`alert alert-${alert.type}`} 
                id={alert.id}
                initial={{ 
                    opacity: 0,
                    y: -50, 
                }}
                animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1
                }}
                exit={{ 
                    opacity: 0,
                    y: [0, 5, -50],
                    scale: 0.95,
                    transition: {
                        duration: 0.3,
                        ease: "easeInOut"
                    }
                }}
                transition={{ delay: 0.1 }}
                            
            >
                <div className="alert-icon">
                    {
                        alertIcon
                    }
                </div>
                <div className="alert-message">{alert.message}</div>
                {
                    alert.count && 
                    <div className="alert-count">{alert.count}x</div>
                }
            </motion.div>
        </motion.div>
    )
}

export default AlertItem;