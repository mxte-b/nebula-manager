import { useEffect, useMemo, useRef, useState } from "react";
import Icons from "./Icons";
import ToggleableIcon from "./ToggleableIcon";
import useVault from "../hooks/useVault";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const EntryPasswordField = ({ id }: { id: string }) => {
    const [password, setPassword] = useState<string | null>(null);
    const [passwordShown, setPasswordShown] = useState<boolean>(false);
    const isFirstRender = useRef<boolean>(true);

    const spanRef = useRef<HTMLSpanElement>(null);

    const { getVaultEntryPassword } = useVault();

    const handlePasswordShow = (next: boolean) => {
        if (next) {
            getVaultEntryPassword(id, {
                ok: setPassword,
                err: (e) => alert(`Couldn't get password: ${e}`)
            });

            setPasswordShown(true);
        }
        else {
            setPassword(null);
            setPasswordShown(false);
        }
    }

    useEffect(() => {
        if (isFirstRender.current) {
            // Skip the first render
            isFirstRender.current = false;
            return;
        }

        console.log("TOGGLE")
    }, [passwordShown]);

    return (
        <div className="entry-password">
            <span className="password-split" ref={spanRef}>
                {
                    passwordShown ? password : "••••••••••••••••••••"
                }
            </span>
            <ToggleableIcon 
                defaultElement={<Icons.EyeFill />}
                toggledElement={<Icons.EyeSlashFill />}
                hoverFg="#ffa2eb"
                hoverBg="#ffa2eb25"
                onToggle={handlePasswordShow}
            />
        </div>
    )
}

export default EntryPasswordField;