import { motion } from "motion/react"

const SetupDoneStep = ( { onDone }: { onDone: () => void } ) => {
    return (
        <motion.div 
            initial={{ x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="step-wrapper" 
            key={"done"}
        >
            <header className="setup-header">
                <h1>Setup complete</h1>
                <p>Your password vault is now ready and secured. Click Finish to get started.</p>
            </header>

            <main className="setup-actions">
                <button className="secondary" onClick={onDone}>
                    Finish
                </button>
            </main>
        </motion.div>
    );
};

export default SetupDoneStep;