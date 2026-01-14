import { FormEvent, useRef } from "react";
import useVault from "../hooks/useVault";
import { useError } from "../contexts/error";
import { motion } from "motion/react";

const UnlockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
    const passwordRef = useRef<HTMLInputElement>(null);

    const { unlockVault } = useVault();
    const { addError} = useError();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const password = passwordRef.current?.value;
        if (!password) return;

        unlockVault(password, {
            ok: onUnlock,
            err: addError
        });
    }

    return (
        <motion.form 
            key={"unlock"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="unlock-screen" onSubmit={handleSubmit}
        >
            <input type="password" ref={passwordRef} required />
            <input type="submit" value="Unlock vault" />
        </motion.form>
    );
};

export default UnlockScreen;