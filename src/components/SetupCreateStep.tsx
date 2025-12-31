import { useRef } from "react";
import { PhaseProps } from "../types/general";
import useVault from "../hooks/useVault";
import { useError } from "../contexts/error";

const SetupCreateStep = ({ next, back }: PhaseProps) => {

    const passwordInpuRef = useRef<HTMLInputElement>(null);

    const { setupVault } = useVault();
    const { addError } = useError();

    const handlePasswordCreate = () => {
        const password = passwordInpuRef.current?.value;

        if (!password) return;

        setupVault(password, {
            ok: next,
            err: addError
        });
    }

    return (
        <>
            <button className="secondary" onClick={back}>
                Back
            </button>
            <header className="setup-header">
                <h1>Create master password</h1>
                <p>To secure your vault, please enter a strong password.</p>
            </header>

            <form className="password-form form">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" ref={passwordInpuRef} />
                <button type="button" className="secondary" onClick={handlePasswordCreate}>
                    Secure vault
                </button>
            </form>

            <footer className="setup-footer">
                Your data is encrypted locally and never leaves your device.
            </footer>
        </>
    );
};

export default SetupCreateStep;