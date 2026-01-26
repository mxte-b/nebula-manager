import { useState } from "react";
import { PhaseProps } from "../../types/general";
import { useError } from "../../contexts/error";
import Icons from "../Icons";
import { motion } from "motion/react"
import ToggleableIcon from "../ToggleableIcon";
import passwordUtils from "../../utils/passwordUtils";
import HoverableIcon from "../HoverableIcon";
import Tooltip from "../Tooltip";
import { useVault } from "../../contexts/vault";
import Form from "../form/Form";
import FormGroup from "../form/FormGroup";
import TextInput from "../form/TextInput";
import FormPasswordStrengthMeter from "../form/FormPasswordStrengthMeter";

type PasswordFormData = {
    password: string
}

const SetupCreateStep = ({ next }: PhaseProps) => {
    const [passwordShown, setPasswordShown] = useState<boolean>(false);

    const { setupVault } = useVault();
    const { addError } = useError();
    const { generatePassword } = passwordUtils();

    const handlePasswordCreate = (data: PasswordFormData) => {
        if (!data.password) return;

        setupVault(data.password, {
            ok: next,
            err: addError
        });
    }

    return (
        <motion.div 
            initial={{ x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="step-wrapper" 
            key={"create"}
        >
            <main className="setup-main">
                <header className="main-header">
                    <h1>Create master password</h1>
                    <p>To secure your vault, please enter a strong password that you will remember. If you lose your password, you lose your data.</p>
                </header>

                <Form<PasswordFormData>
                    onSubmit={handlePasswordCreate}
                >
                    <FormGroup> 
                        <TextInput 
                            required
                            label="Password"
                            name="password"
                            type={ passwordShown ? "text" : "password" }
                            placeholder="Enter a strong password"
                            actions={(field) =>
                                <>
                                    <Tooltip text="Generate">
                                        <HoverableIcon
                                            onClick={() => {
                                                field.setValue(generatePassword());
                                                setPasswordShown(true);
                                            }}
                                            hoverFg="#d3a747ff"
                                            hoverBg="#d3a74718"
                                        >
                                            <Icons.Stars />
                                        </HoverableIcon>
                                    </Tooltip>

                                    <Tooltip text={passwordShown ? "Hide" : "Show"}>
                                        <ToggleableIcon
                                            defaultElement={<Icons.EyeFill />}
                                            toggledElement={<Icons.EyeSlashFill />}
                                            hoverFg="#ffa2eb"
                                            hoverBg="#ffa2eb25"
                                            onToggle={() => setPasswordShown(p => !p)}
                                        />
                                    </Tooltip>
                                </>
                            }
                        />

                        <FormPasswordStrengthMeter />
                    </FormGroup>

                    <button className="button-continue" type="submit">
                        Continue
                    </button>
                </Form>

            </main>
        </motion.div>
    );
};

export default SetupCreateStep;