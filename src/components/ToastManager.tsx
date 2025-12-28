import { AnimatePresence } from "motion/react";
import { useToast } from "../contexts/toast"
import ToastItem from "./ToastItem";

const ToastManager = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toasts">
            <AnimatePresence>
                {
                    toasts.map(a => <ToastItem toast={a} onClose={removeToast} key={a.id} />)
                }
            </AnimatePresence>
        </div>
    )
}

export default ToastManager;