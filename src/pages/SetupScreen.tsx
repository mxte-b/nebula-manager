import { JSX, useState } from "react";
import SetupWelcomeStep from "../components/SetupWelcomeStep";
import SetupCreateStep from "../components/SetupCreateStep";
import SetupImportStep from "../components/SetupImportStep";
import { SetupPhase } from "../types/general";
import { AnimatePresence } from "motion/react";
import SetupDoneStep from "../components/SetupDoneStep";

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

    return (
        <div className="setup-screen">
            <AnimatePresence mode="wait">
                { steps[phase] }
            </AnimatePresence>
        </div>
    )
}

export default SetupScreen;