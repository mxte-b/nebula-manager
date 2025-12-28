import { RootPhaseProps } from "../types/general";

const SetupWelcomeStep = ({ next }: RootPhaseProps) => {
    return (
        <>
            <header className="setup-header">
                <h1>Let's get you started</h1>
                <p>Create a new vault or import an existing one to get started.</p>
            </header>

            <main className="setup-actions">
                <button className="primary" onClick={() => next("create")}>
                    Create new vault
                </button>

                <button className="secondary" onClick={() => next("import")}>
                    Import an existing vault
                </button>
            </main>

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </>
    );
};

export default SetupWelcomeStep;