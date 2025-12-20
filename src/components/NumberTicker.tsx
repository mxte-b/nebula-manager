import type { CSSProperties } from "react";
import NumberTickerColumn from "./NumberTickerColumn";
import { AnimatePresence, motion } from "framer-motion"; 

type NumberTickerProps = 
    { number: number, mode: "auto", size?: number } | 
    { number: number, mode: "explicit", columns: number, size?: number };

const NumberTicker = (props: NumberTickerProps) => {
    const getDigits = (x: number, maxDigits?: number) => {
        if (x == 0) return maxDigits ? [...Array(maxDigits).fill(0)] : [0];

        const digits: number[] = [];
        while (x > 0 || maxDigits && digits.length !== maxDigits) {
            digits.push(x % 10);
            x = Math.floor(x / 10);
        }

        return digits;
    }

    return (
        <motion.div 
            layout 
            className="ticker"
            style={{
                "--ticker-colsize": `${props.size ?? 24}px`
            } as CSSProperties}
        >
            <AnimatePresence>
                {
                    props.mode == "auto" ? 
                    getDigits(props.number).map((d, i) => <NumberTickerColumn key={i} digit={d}/>)
                    :
                    getDigits(props.number, props.columns).map((d, i) => 
                        <NumberTickerColumn key={i} digit={d}/>
                    )
                }
            </AnimatePresence>
        </motion.div>
    );
}

export default NumberTicker;