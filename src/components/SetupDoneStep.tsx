const SetupDoneStep = ( { onDone }: { onDone: () => void } ) => {
    return (
        <>
            <header className="setup-header">
                <h1>Setup complete</h1>
                <p>Your password vault is now ready and secured. Click Finish to get started.</p>
            </header>

            <main className="setup-actions">
                <button className="secondary" onClick={onDone}>
                    Finish
                </button>
            </main>

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </>
    );
};

export default SetupDoneStep;