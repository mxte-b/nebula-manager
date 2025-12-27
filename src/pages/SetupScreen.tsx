const SetupScreen = () => {
    return (
        <div className="setup-screen">
            <header className="setup-header">
                <h1>Set up your vault</h1>
                <p>Create a new vault or import an existing one to get started.</p>
            </header>

            <main className="setup-actions">
                <button className="primary">
                    Create new vault
                </button>

                <button className="secondary">
                    Import an existing vault
                </button>
            </main>

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </div>
    )
}

export default SetupScreen;