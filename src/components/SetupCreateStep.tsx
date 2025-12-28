import { PhaseProps } from "../types/general";

const SetupCreateStep = ({ next, back }: PhaseProps) => {
    return (
        <>
            <button className="secondary" onClick={back}>
                Back
            </button>
            <header className="setup-header">
                <h1>Create master password</h1>
                <p>To secure your vault, please enter a strong password.</p>
            </header>

            <main className="setup-actions">
                <button className="secondary" onClick={next}>
                    Secure vault
                </button>
            </main>

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </>
    );
};

export default SetupCreateStep;