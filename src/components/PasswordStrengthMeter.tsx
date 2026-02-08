import { useMemo } from "react";
import passwordUtils from "../utils/passwordUtils";
import { PasswordStrength } from "../types/general";
import { AnimatePresence, motion } from "motion/react";
import Icons from "./Icons";

const strengthIndexMap: PasswordStrength[] = ["Weak", "Okay", "Strong", "Excellent"];

const PasswordStrengthMeter = ({ password }: { password: string }) => {
    
    const { evaluatePassword } = passwordUtils();
    
    const evaluation = useMemo(() => evaluatePassword(password), [password]);
    
    const strengthIndex = password.length > 0 ? strengthIndexMap.indexOf(evaluation.strength) : -1;

    return (
        <div className={"password-meter " + (password.length > 0 ? evaluation.strength.toLowerCase().replace(" ", "-") : "")}>
            <div className="password-meter-head">
                <AnimatePresence>
                    { evaluation.suggestions.length > 0 && 
                        <motion.div
                            key={"suggestions"}
                            layout
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="password-meter-suggestions-wrapper"
                        >
                            <motion.div
                                className="password-meter-suggestions"
                                layout
                            >
                                <div className="suggestions-header">
                                    <Icons.LightbulbFill />
                                    Suggestions
                                </div>
                                <AnimatePresence>
                                    {
                                        evaluation.suggestions.map((s, i) => <motion.div
                                                key={`suggestion-${i}`}
                                                className="password-meter-suggestion"
                                                layout
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                            >
                                                - {s}
                                            </motion.div>
                                        )
                                    }
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    }
                </AnimatePresence>
                <div className="password-meter-header">
                    <div className="password-meter-title">Password strength</div>
                    <div className="password-meter-strength">{password.length > 0 ? evaluation.strength : "Empty" }</div>
                </div>
            </div>
            <div className="password-meter-progress">
                {
                    Array.from({length: 4}).map((_, i) => 
                        <div key={`progress-step-${i}`} className={"progress-step" + (i <= strengthIndex ? " active" : "")} />
                    )
                }
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;