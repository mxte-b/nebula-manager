import { useMemo } from "react";
import usePassword from "../hooks/usePassword";

const PasswordStrengthMeter = ({ password }: { password: string }) => {

    const { evaluatePassword } = usePassword();

    const evaluation = useMemo(() => evaluatePassword(password), [password]);

    return (
        <div>
            Current strength = {evaluation.strength}
            {evaluation.message}
        </div>
    );
};

export default PasswordStrengthMeter;