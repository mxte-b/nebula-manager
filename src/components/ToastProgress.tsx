import { useEffect } from "react";
import { Toast } from "../types/general";
import { motion, useAnimationControls } from "motion/react";

const ToastProgress = ({ toast }: { toast: Toast }) => {

    const controls = useAnimationControls();

    useEffect(() => {
        controls.start({ scaleX: 1, transition: { duration: 0.1, ease: "easeOut" }})
            .then(() => {
                controls.start({ scaleX: 0, transition: { duration: toast.duration / 1000, ease: "linear" }});
            });
    }, [toast.count]);

    return (
        <div className="toast-progress-track">
            <motion.div className="toast-progress" animate={controls}></motion.div>
        </div>
    )
}

export default ToastProgress;