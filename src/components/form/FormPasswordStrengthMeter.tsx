import { useFormFieldValue } from "../../contexts/form";
import PasswordStrengthMeter from "../PasswordStrengthMeter";

const FormPasswordStrengthMeter = () => {
    const password = useFormFieldValue("password");

    return (
        <PasswordStrengthMeter password={password} />
    );
};

export default FormPasswordStrengthMeter;