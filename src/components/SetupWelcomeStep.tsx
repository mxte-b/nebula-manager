import { useState } from "react";
import { RootPhaseProps } from "../types/general";
import Icons from "./Icons";
import { motion } from "motion/react"

const SetupWelcomeStep = ({ next }: RootPhaseProps) => {
    const [option, setOption] = useState<"create" | "import">("create");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="step-wrapper" 
            key={"welcome"}
        >
            <main className="setup-main">
                <div className="main-header">
                    <h1>Let's get you started!</h1>
                    <p>Your passwords deserve privacy too. Choose an option to begin.</p>
                </div>

                <div className="setup-options">
                    <div className={"card" + (option == "create" ? " active" : "")} onClick={() => setOption("create")}>
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <Icons.FilePlus />
                            </div>
                        </div>
                        <div className="card-bottom">
                            <div className="card-title">Create new</div>
                            <div className="card-description">Protect your passwords with a brand new, encrypted vault.</div>
                        </div>
                    </div>
                    <div className={"card" + (option == "import" ? " active" : "")} onClick={() => setOption("import")}>
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <Icons.FileUpload />
                            </div>
                        </div>
                        <div className="card-bottom">
                            <div className="card-title">Import</div>
                            <div className="card-description">Already have a vault set up? Import it here to securely access it.</div>
                        </div>
                    </div>
                </div>

                <button className="button-continue" onClick={() => next(option)}>
                    Continue
                </button>
            </main>
        </motion.div>
    );
};

export default SetupWelcomeStep;