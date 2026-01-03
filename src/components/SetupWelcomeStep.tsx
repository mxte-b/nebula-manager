import { useState } from "react";
import { RootPhaseProps } from "../types/general";
import Icons from "./Icons";

const SetupWelcomeStep = ({ next }: RootPhaseProps) => {
    const [option, setOption] = useState<"create" | "import">("create");

    return (
        <>
            <header className="setup-header">
                <img src="/icon.png" alt="Nebula Manager Icon" />
                <div className="brand">
                    <div className="brand-name">Nebula Manager</div>
                    <div className="brand-tagline">A private, hassle-free password manager</div>
                </div>
            </header>

            <main className="setup-main">
                <div className="get-started">
                    <h1>Let's get you started!</h1>
                    <p>Your passwords deserve privacy too. Choose an option to begin.</p>
                </div>

                <div className="setup-options">
                    <div className={"card" + (option == "create" ? " active" : "")} onClick={() => setOption("create")}>
                        <div className="card-icon">
                            <Icons.FilePlus />
                        </div>
                        <div className="card-bottom">
                            <div className="card-title">Create new</div>
                            <div className="card-description">Protect your passwords with a new, encrypted vault.</div>
                        </div>
                    </div>
                    <div className={"card" + (option == "import" ? " active" : "")} onClick={() => setOption("import")}>
                        <div className="card-icon">
                            <Icons.FileUpload />
                        </div>
                        <div className="card-bottom">
                            <div className="card-title">Import</div>
                            <div className="card-description">Already have a vault? Import it here to securely access it.</div>
                        </div>
                    </div>
                </div>

                <button className="button-continue" onClick={() => next(option)}>
                    Continue
                </button>
            </main>

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </>
    );
};

export default SetupWelcomeStep;