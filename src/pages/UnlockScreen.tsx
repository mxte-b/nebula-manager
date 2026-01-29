import { useState } from "react";
import { useError } from "../contexts/error";
import { motion } from "motion/react";
import { useVault } from "../contexts/vault";
import Form from "../components/form/Form";
import FormGroup from "../components/form/FormGroup";
import TextInput from "../components/form/TextInput";
import Tooltip from "../components/Tooltip";
import ToggleableIcon from "../components/ToggleableIcon";
import Icons from "../components/Icons";
import "../styles/UnlockScreen.scss";
import FloatingIcon from "../components/FloatingIcon";

type PasswordData = {
    password: string
}

const UnlockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
    const [passwordShown, setPasswordShown] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { unlockVault } = useVault();
    const { addError} = useError();

    const handleSubmit = (data: PasswordData) => {
        unlockVault(data.password, {
            ok: onUnlock,
            err: addError
        });
    }

    return (
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="unlock-screen"
        >
            <div className="unlock-screen-bg">
                <FloatingIcon.ShieldLock 
                    x={"5%"} y={"70%"} 
                    rotation={-10} size={160} 
                    color={"#b455a0"} opacity={0.15} 
                    blurPx={5} parallaxValue={2}
                />
                
                <FloatingIcon.ShieldLock 
                    x={"15%"} y={"45%"} 
                    rotation={10} size={100} 
                    color={"#915483"} opacity={0.1} 
                    parallaxValue={1}
                />
                
                <FloatingIcon.ShieldLock 
                    x={"8%"} y={"25%"} 
                    rotation={-5} size={60} 
                    color={"#6b5666"} opacity={0.1} 
                    blurPx={1} parallaxValue={0.5}
                />

                <FloatingIcon.Key 
                    x={"80%"} y={"68%"} 
                    rotation={8} size={200} 
                    color={"#b455a0"} opacity={0.15} 
                    blurPx={5}  parallaxValue={2}
                />

                <FloatingIcon.Key 
                    x={"75%"} y={"45%"} 
                    rotation={5} size={100} 
                    color={"#915483"} opacity={0.1} 
                    parallaxValue={1}
                />

                <FloatingIcon.Key 
                    x={"82%"} y={"22%"} 
                    rotation={-10} size={70} 
                    color={"#6b5666"} opacity={0.1} 
                    blurPx={1} parallaxValue={0.5}
                />
                
            </div>

            <div className="unlock-screen-main">
                <div className="unlock-screen-header">
                    <h1>Unlock your vault</h1>
                    <p>Enter your master password to gain access.</p>
                </div>
                <Form<PasswordData> onSubmit={handleSubmit}>
                    <FormGroup>
                        <TextInput
                            required
                            type={passwordShown ? "text" : "password"}
                            name="password"
                            label="Master password"
                            actions={() =>
                                <Tooltip text={passwordShown ? "Hide" : "Show"}>
                                    <ToggleableIcon
                                        defaultElement={<Icons.EyeFill />}
                                        toggledElement={<Icons.EyeSlashFill />}
                                        hoverFg="#ffa2eb"
                                        hoverBg="#ffa2eb25"
                                        onToggle={() => setPasswordShown(p => !p)}
                                    />
                                </Tooltip>
                            }
                        />
                    </FormGroup>
                    <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} type="submit" className="button-continue">Unlock</button>
                </Form>
            </div>
        </motion.div>
    );
};

export default UnlockScreen;