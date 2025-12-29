import { FormEvent, useRef } from "react";
import useVault from "../hooks/useVault";
import { useToast } from "../contexts/toast";

const UnlockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
    const passwordRef = useRef<HTMLInputElement>(null);

    const { unlockVault } = useVault();
    const { addToast } = useToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const password = passwordRef.current?.value;
        if (!password) return;

        unlockVault(password, {
            ok: onUnlock,
            err: (e) => {
                addToast({
                    type: "error",
                    message: `Couldn't unlock vault: ${e}`,
                    duration: 5000
                })
            },
        });
    }

    return (
        <form className="unlock-screen" onSubmit={handleSubmit}>
            <input type="password" ref={passwordRef} required />
            <input type="submit" value="Unlock vault" />
        </form>
    );
};

export default UnlockScreen;