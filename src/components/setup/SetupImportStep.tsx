import { PhaseProps } from "../../types/general";
import { motion } from "motion/react"

const SetupImportStep = ({ next, back }: PhaseProps) => {
    return (
        <motion.div
            initial={{ x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="step-wrapper" 
            key={"import"}
        >
            <button className="secondary" onClick={back}>
                Back
            </button>
            <header className="setup-header">
                <h1>Import existing vault</h1>
                <p>Please select the existing vault file from your device.</p>
            </header>

            <main className="setup-actions">
                <button className="secondary" onClick={next}>
                    Import
                </button>
            </main>
        </motion.div>
    );
};

export default SetupImportStep;