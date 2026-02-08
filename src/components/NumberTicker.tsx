import type { CSSProperties } from "react";
import NumberTickerColumn from "./NumberTickerColumn";
import { AnimatePresence, motion } from "framer-motion"; 
import CharacterColumn from "./CharacterColumn";

type NumberTickerOptionals = {
    size?: number,
    postfix?: string,
    className?: string,
    style?: ""
}

type NumberTickerProps = 
    { number: number, mode: "auto" } & NumberTickerOptionals | 
    { number: number, mode: "explicit", columns: number } & NumberTickerOptionals;

const NumberTicker = (props: NumberTickerProps) => {
    const getDigits = (x: number, maxDigits?: number) => {
        if (x == 0) return maxDigits ? [...Array(maxDigits).fill(0)] : [0];

        const digits: number[] = [];
        x = Math.abs(x);
        while (x > 0 || maxDigits && digits.length !== maxDigits) {
            digits.push(x % 10);
            x = Math.floor(x / 10);
        }

        return digits;
    }

    return (
        <motion.div 
            layout 
            className={"ticker" + (props.className ? ` ${props.className}` : "")}
            style={{
                "--ticker-colheight": `${props.size ?? 24}px`,
                "--ticker-colwidth": `${((props.size ?? 24) * 0.6).toFixed(2)}px`
            } as CSSProperties}
        >
            {/* IMPORTANT: Elements appear in reverse order! */}
            <AnimatePresence>
                {
                    props.postfix && <CharacterColumn key={"postfix"} character={props.postfix} />
                }
                {
                    props.mode == "auto" ? 
                    getDigits(props.number).map((d, i) => <NumberTickerColumn key={i} digit={d} gap={props.size ?? 24}/>)
                    :
                    getDigits(props.number, props.columns).map((d, i) => 
                        <NumberTickerColumn key={i} digit={d} gap={props.size ?? 24}/>
                    )
                }
                {
                    props.number < 0 && <CharacterColumn key={"sign"} character="-" />
                }
            </AnimatePresence>
        </motion.div>
    );
}

export default NumberTicker;