import { PhaseProps } from "../types/general";
import { motion } from "motion/react"

const SetupImportStep = ({ next, back }: PhaseProps) => {
    return (
        <motion.div className="step-wrapper" key={"import"}>
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

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </motion.div>
    );
};

export default SetupImportStep;