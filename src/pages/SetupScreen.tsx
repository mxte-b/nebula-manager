import { JSX, useMemo, useState } from "react";
import SetupWelcomeStep from "../components/setup/SetupWelcomeStep";
import SetupCreateStep from "../components/setup/SetupCreateStep";
import SetupImportStep from "../components/setup/SetupImportStep";
import { SetupPhase } from "../types/general";
import { AnimatePresence, motion } from "motion/react";
import SetupDoneStep from "../components/setup/SetupDoneStep";
import "../styles/SetupScreen.scss";
import Stepper from "../components/Stepper";
import Icons from "../components/Icons";

const SetupScreen = ({ onSetupCompleted }: { onSetupCompleted: () => void }) => {

    const [phase, setPhase] = useState<SetupPhase>("welcome");

    
    const home = () => setPhase("welcome");
    const done = () => setPhase("done");
    
    const steps: Record<SetupPhase, JSX.Element> = {
        welcome: <SetupWelcomeStep key={"welcome"} next={setPhase} />,
        create: <SetupCreateStep key={"create"} next={done} back={home} />,
        import: <SetupImportStep key={"import"} next={done} back={home} />,
        done: <SetupDoneStep key={"done"} onDone={onSetupCompleted} />
    }
    
    const stepperSteps = ["Welcome", "Setup", "Done"];
    const activeStepId = useMemo(() => phase == "welcome" ? 0 : phase == "done" ? 2 : 1, [phase]);

    return (
        <motion.div
            key={"setup"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="setup-screen"
        >
            <Stepper steps={stepperSteps} activeStepId={activeStepId} />

            { activeStepId == 1 && 
                <button className="setup-back" onClick={home}>
                    <Icons.ArrowLeft />
                </button>
            }
            <AnimatePresence mode="wait">
                { steps[phase] }
            </AnimatePresence>

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </motion.div>
    )
}

export default SetupScreen;