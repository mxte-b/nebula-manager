import { motion, useSpring } from "framer-motion"; 
import { useEffect } from "react";

const NumberTickerColumn = ({ digit, gap }: { digit: number, gap: number }) => {
    const animatedOffset = useSpring(digit, { stiffness: 200, damping: 25 });

    useEffect(() => {
        animatedOffset.set(digit * gap);
    }, [animatedOffset, digit, gap]);

    return (
        <motion.div
            layout 
            className="ticker-column"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "var(--ticker-colwidth)" }}
            exit={{ opacity:0, width: 0 }}
            style={{ y: animatedOffset }}
        >
            {
                [...Array(10).keys()].map(i => 
                    <motion.span 
                        key={i}
                        className="ticker-digit" 
                        style={{ y: -gap * i }}
                    >
                        {i}
                    </motion.span>
                )
            }
        </motion.div>
    )
}

export default NumberTickerColumn;