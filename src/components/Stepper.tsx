import { CSSProperties, useEffect, useRef } from "react";

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
                            <div className={
                                "stepper-line"
                                + (i <= activeStepId ? " completed" : "")
                                + (i == activeStepId + 1 ? " in-progress": "")
                            } style={{ "--i": direction == "forwards" ? i - 1 : steps.length - i - 1 } as CSSProperties}></div>
                        }

                        {/* Stepper step */}
                        <div className={
                            "stepper-step"
                            + (i < activeStepId ? " completed" : "")
                            + (i == activeStepId ? " in-progress": "")
                        } style={{ "--i": direction == "forwards" ? i : steps.length - i  } as CSSProperties}>
                            <div className="step-circle"></div>
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