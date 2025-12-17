import { useEffect } from "react";
import { Alert } from "../types/general";
import { AnimatePresence, motion } from "motion/react"

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
    useEffect(() => {
        console.log("Adding close to alert " + alert.id)
        setTimeout(() => onClose(alert.id), alert.duration);
    }, []);

    return (
        <motion.div layout
            className={`alert alert-${alert.type}`} 
            id={alert.id}
            initial={{ 
                opacity: 0,
                y: -100, 
            }}
            animate={{ 
                opacity: 1, 
                y: 16, 
                scale: 1
            }}
            exit={{ 
                opacity: 0,
                y: [16, 26, -50],
                scale: 0.95,
                transition: {
                    duration: 0.4,
                    ease: "easeInOut"
                }
            }}
                        
        >
            {alert.message}
        </motion.div>
    )
}

export default AlertItem;