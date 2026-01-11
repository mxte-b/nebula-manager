import { CSSProperties, useEffect, useRef } from "react";
import Icons from "./Icons";
import { AnimatePresence, motion } from "motion/react";

const Stepper = (
    { 
        steps,
        activeStepId,
    }: 
    {
        steps: string[],
        activeStepId: number,
    }
) => {
    const prev = useRef(activeStepId);

    const direction = activeStepId > prev.current ? "forwards" : "backwards";

    useEffect(() => {
        prev.current = activeStepId;
    }, [activeStepId]);

    return (
        <div className={"stepper " + direction}>
            {
                steps.map((s, i) => 
                    <>
                        {/* Stepper line */}
                        {
                            i > 0 && 
                            <div key={`line-${i}`} className={
                                "stepper-line"
                                + (i <= activeStepId ? " completed" : "")
                                + (i == activeStepId + 1 ? " in-progress": "")
                            } style={{ "--i": direction == "forwards" ? i - 1 : steps.length - i - 1 } as CSSProperties}></div>
                        }

                        {/* Stepper step */}
                        <div key={`step-${i}`} className={
                            "stepper-step"
                            + (i < activeStepId ? " completed" : "")
                            + (i == activeStepId ? " in-progress": "")
                        } style={{ "--i": direction == "forwards" ? i : steps.length - i  } as CSSProperties}>
                            <div className="step-circle">
                                <AnimatePresence>
                                    { 
                                        i < activeStepId && 
                                        <motion.div key="check" className="step-icon"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                        >
                                            <Icons.Check /> 
                                        </motion.div>
                                    }
                                    { 
                                        i == activeStepId && 
                                        <motion.div key="rectangle" className="step-icon rectangle"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                        />
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="step-details">
                                <div className="step-number">STEP {i + 1}</div>
                                <div className="step-label">{s}</div>
                            </div>
                        </div>
                    </>
                )
            }
        </div> 
    );
};

export default Stepper;