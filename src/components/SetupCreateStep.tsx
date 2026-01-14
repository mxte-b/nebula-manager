import { useState } from "react";
import { PhaseProps } from "../types/general";
import useVault from "../hooks/useVault";
import { useError } from "../contexts/error";
import Icons from "./Icons";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { motion } from "motion/react"

const SetupCreateStep = ({ next, back }: PhaseProps) => {
    const [password, setPassword] = useState<string>("");

    const { setupVault } = useVault();
    const { addError } = useError();

    const handlePasswordCreate = () => {
        if (!password) return;

        setupVault(password, {
            ok: next,
            err: addError
        });
    }

    return (
        <motion.div 
            initial={{ x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="step-wrapper" 
            key={"create"}
        >
            <main className="setup-main">
                <header className="main-header">
                    <h1>Create master password</h1>
                    <p>To secure your vault, please enter a strong password that you will remember. If you lose your password, you lose your data.</p>
                </header>

                <form className="password-form form" autoComplete="off" onSubmit={(e) => {
                    e.preventDefault();
                    handlePasswordCreate();
                }}>
                    <div className="form-group">
                        <div className="form-input">
                            <label htmlFor="password">Password</label>
                            <input
                                autoComplete="off" 
                                placeholder="Enter a strong password" 
                                type="password" 
                                name="password" 
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <PasswordStrengthMeter password={password} />
                        </div>
                    </div>
                    <button type="submit" className="button-continue">
                        Continue
                    </button>
                </form>

            </main>

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </motion.div>
    );
};

export default SetupCreateStep;