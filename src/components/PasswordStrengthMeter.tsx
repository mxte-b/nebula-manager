import { useMemo } from "react";
import usePassword from "../hooks/usePassword";
import { PasswordStrength } from "../types/general";

const strengthIndexMap: PasswordStrength[] = ["Weak", "Okay", "Strong", "Very strong"];

const PasswordStrengthMeter = ({ password }: { password: string }) => {
    
    const { evaluatePassword } = usePassword();
    
    const evaluation = useMemo(() => evaluatePassword(password), [password]);
    
    const strengthIndex = password.length > 0 ? strengthIndexMap.indexOf(evaluation.strength) : -1;

    return (
        <div className={"password-meter " + (password.length > 0 ? evaluation.strength.toLowerCase().replace(" ", "-") : "")}>
            <div className="password-meter-header">
                <div className="password-meter-title">Password strength</div>
                <div className="password-meter-strength">{password.length > 0 ? evaluation.strength : "Empty" }</div>
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