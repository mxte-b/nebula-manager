import { motion, useSpring } from "framer-motion"; 
import { useEffect } from "react";

const NumberTickerColumn = ({ digit }: { digit: number }) => {
    const animatedOffset = useSpring(digit, { stiffness: 200, damping: 20 });

    useEffect(() => {
        animatedOffset.set(digit * 24);
    }, [animatedOffset, digit]);

    return (
        <motion.div
            layout 
            className="ticker-column"
            initial={{ opacity: 0, width: 0,}}
            animate={{ opacity: 1, width: "var(--ticker-colsize)" }}
            exit={{ opacity:0, width: 0 }}
            style={{ y: animatedOffset }}
        >
            {
                [...Array(10).keys()].map(i => 
                    <motion.span 
                        key={i}
                        className="ticker-digit" 
                        style={{ y: -24 * i }}
                    >
                        {i}
                    </motion.span>
                )
            }
        </motion.div>
    )
}

export default NumberTickerColumn;