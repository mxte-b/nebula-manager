import { Step } from "../types/general";

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
    return (
        <div className="stepper">
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
                            }></div>
                        }

                        {/* Stepper step */}
                        <div className={
                            "stepper-step"
                            + (i < activeStepId ? " completed" : "")
                            + (i == activeStepId ? " in-progress": "")
                        }>
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