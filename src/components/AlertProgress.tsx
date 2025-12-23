import { useEffect } from "react";
import { Alert } from "../types/general";
import { motion, useAnimationControls } from "motion/react";

const AlertProgress = ({ alert }: { alert: Alert }) => {

    const controls = useAnimationControls();

    useEffect(() => {
        controls.start({ scaleX: 1, transition: { duration: 0.1, ease: "easeOut" }})
            .then(() => {
                controls.start({ scaleX: 0, transition: { duration: alert.duration / 1000, ease: "linear" }});
            });
    }, [alert.count]);

    return (
        <div className="alert-progress-track">
            <motion.div className="alert-progress" animate={controls}></motion.div>
        </div>
    )
}

export default AlertProgress;