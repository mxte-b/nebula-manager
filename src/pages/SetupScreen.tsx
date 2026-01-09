import { JSX, useMemo, useState } from "react";
import SetupWelcomeStep from "../components/SetupWelcomeStep";
import SetupCreateStep from "../components/SetupCreateStep";
import SetupImportStep from "../components/SetupImportStep";
import { SetupPhase } from "../types/general";
import { AnimatePresence } from "motion/react";
import SetupDoneStep from "../components/SetupDoneStep";
import "../styles/SetupScreen.scss";
import Stepper from "../components/Stepper";

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
        <div className="setup-screen">
            <Stepper steps={stepperSteps} activeStepId={activeStepId} />
            <AnimatePresence mode="wait">
                { steps[phase] }
            </AnimatePresence>
        </div>
    )
}

export default SetupScreen;