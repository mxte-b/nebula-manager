import { JSX, useEffect, useMemo, useRef } from "react";
import { Toast, ToastType } from "../types/general";
import { AnimatePresence, motion } from "motion/react"
import Icons from "./Icons";
import NumberTicker from "./NumberTicker";
import ToastProgress from "./ToastProgress";
import CloseButton from "./CloseButton";

const ToastItem = (
{
    toast,
    onClose
}
:{
    toast: Toast,
    onClose: (id: string) => void
}
) => {

    const toastIconMap: Map<ToastType, JSX.Element> = new Map<ToastType, JSX.Element>([
        ["success", <Icons.CheckCircleFill />],
        ["warning", <Icons.ExclamationCircleFill />],
        ["error", <Icons.XCircleFill />],
    ]);

    const toastIcon = useMemo(() => toastIconMap.get(toast.type ?? "success"), [toast]);

    const timeoutRef = useRef<NodeJS.Timeout>(undefined);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => onClose(toast.id), toast.duration);

        return () => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
    }, [toast.count]);

    return (
        <motion.div
            className="toast-wrapper"
            style={{
                zIndex: 100000 - Number(toast.id)
            }}
            layout
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ zIndex: 1, height: 0 }}
            transition={{ duration: toast._isSwap ? 0 : 0.4 }}
        >
            <motion.div
                className={`toast toast-${toast.type}`} 
                id={toast.id}
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
                <div className="toast-icon">
                    {
                        toastIcon
                    }
                </div>
                <div className="toast-message">{toast.message}</div>
                <CloseButton onClick={() => {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = undefined;
                    onClose(toast.id);
                }}/>

                <ToastProgress toast={toast} />
                <AnimatePresence>
                    {
                        toast.count && 
                        <motion.div 
                            className="toast-count"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <NumberTicker number={toast.count} mode="auto" postfix="x" size={16}/>
                        </motion.div>
                    }
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}

export default ToastItem;