import {motion} from "motion/react";

const LoadingScreen = () => {
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}} className="loading-screen">
            <span className="loader"></span>
        </motion.div>
    )
}

export default LoadingScreen;