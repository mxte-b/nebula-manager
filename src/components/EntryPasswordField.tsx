import { useEffect, useRef, useState } from "react";
import Icons from "./Icons";
import ToggleableIcon from "./ToggleableIcon";
import vaultUtils from "../utils/vaultUtils";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Tooltip from "./Tooltip";
import HoverableIcon from "./HoverableIcon";
import { useToast } from "../contexts/toast";
import { useError } from "../contexts/error";

gsap.registerPlugin(SplitText);

const EntryPasswordField = (
    { 
        id,
    }: { 
        id: string,
    }
) => {
    const [password, setPassword] = useState<string | null>(null);
    const [passwordShown, setPasswordShown] = useState<boolean>(false);
    const [toggleEnabled, setToggleEnabled] = useState<boolean>(true);
    
    const isFirstRender = useRef<boolean>(true);
    const isAnimating = useRef<boolean>(false);
    const passwordDomRef = useRef<HTMLDivElement>(null);
    const placeholderSplitRef = useRef<SplitText | null>(null);
    const passwordSplitRef = useRef<SplitText | null>(null);

    const { getVaultEntryPassword } = vaultUtils();
    const { addToast } = useToast();
    const { addError } = useError();

    const handlePasswordCopy = (id: string) => {
        addToast({
            type: "success",
            message: "Password copied!" + id,
            duration: 5000
        })
    }

    const handlePasswordShow = (next: boolean) => {
        if (isAnimating.current) return;

        if (next) {
            getVaultEntryPassword(id, {
                ok: setPassword,
                err: addError
            });

            setPasswordShown(true);
        }
        else {
            setPasswordShown(false);
        }
    }

    const handleEntryAnimation = () => {
        if (!passwordSplitRef.current || !placeholderSplitRef.current) return;
        
        if (isAnimating.current) {
            gsap.killTweensOf(placeholderSplitRef.current.chars)
            gsap.killTweensOf(passwordSplitRef.current.chars)
        }
        
        gsap.set(passwordSplitRef.current.chars, {
            opacity: 0,
            yPercent: -50
        });

        gsap.set(passwordSplitRef.current.elements[0], {
            opacity: 1
        });
        
        gsap.to(placeholderSplitRef.current.chars, {
            opacity: 0,
            yPercent: 50,
            duration: 0.1,
            pointerEvents: "none",
            stagger:  0.005,
            ease: "power2.inOut"
        });
        
        gsap.to(passwordSplitRef.current.chars, {
            opacity: 1,
            delay: 0.1,
            yPercent: 0,
            duration: 0.1,
            pointerEvents: "auto",
            stagger: 0.01,
            ease: "power2.inOut",
            onComplete: () => {
                isAnimating.current = false;
                setToggleEnabled(true);
            }
        });
    }

    const handleExitAnimation = () => {
        if (!passwordSplitRef.current || !placeholderSplitRef.current) return;
        
        if (isAnimating.current) {
            gsap.killTweensOf(placeholderSplitRef.current.chars)
            gsap.killTweensOf(passwordSplitRef.current.chars)
        }
        
        gsap.set(placeholderSplitRef.current.chars, {
            opacity: 0,
            yPercent: -50
        });

        gsap.to(passwordSplitRef.current.chars, {
            opacity: 0,
            yPercent: 50,
            duration: 0.1,
            stagger: 0.01,
            pointerEvents: "none",
            ease: "power2.inOut"
        });

        gsap.to(placeholderSplitRef.current.chars, {
            opacity: 1,
            delay: 0.1,
            yPercent: 0,
            duration: 0.1,
            pointerEvents: "auto",
            stagger: 0.005,
            ease: "power2.inOut",
            onComplete: () => {

                if (passwordSplitRef.current) {
                    gsap.set(passwordSplitRef.current.elements[0], {
                        opacity: 0
                    });
                }

                isAnimating.current = false;

                setToggleEnabled(true);
                setPassword(null);
            }
        });
    }

    useEffect(() => {
        if (isFirstRender.current) {
            // Skip the first render
            isFirstRender.current = false;
            return;
        }

        // If there is no target element, return
        if (!passwordDomRef.current || !password || isAnimating.current) return;
        
        isAnimating.current = true;
        setToggleEnabled(false);

        // Split the placeholder text once
        if (!placeholderSplitRef.current) {
            placeholderSplitRef.current = new SplitText(passwordDomRef.current.querySelector(".placeholder"), { type: "chars", aria: "none" });
        }

        // Split the password every time it updates
        if (password) {
            passwordSplitRef.current?.revert();
            passwordSplitRef.current = new SplitText(passwordDomRef.current.querySelector(".password"), { type: "chars", aria: "none" });
        }

        // Entry animation
        if (passwordShown && password && passwordSplitRef.current) {
            handleEntryAnimation();
        }
        // Exit animation
        else if (!passwordShown && passwordSplitRef.current && password) {
            handleExitAnimation();
        }
    }, [passwordShown, password]);

    return (
        <div className="entry-password">
            <div className="password-split" ref={passwordDomRef}>
                <div className="placeholder">
                    ••••••••••••••••••••••••
                </div>
                <div className="password" title={password || ""}>
                    {password}
                </div>
            </div>

            <div className="password-actions">
                <Tooltip text="Copy">
                    <HoverableIcon
                        hoverFg="#699dd8ff"
                        hoverBg="#699dd818"
                        onClick={() => handlePasswordCopy(id)}
                    >
                        <Icons.Copy/>
                    </HoverableIcon>
                </Tooltip>
                <Tooltip text={passwordShown ? "Hide" : "Show"}>
                    <ToggleableIcon
                        defaultElement={<Icons.EyeFill />}
                        toggledElement={<Icons.EyeSlashFill />}
                        hoverFg="#ffa2eb"
                        hoverBg="#ffa2eb25"
                        enabled={toggleEnabled}
                        onToggle={handlePasswordShow}
                    />
                </Tooltip>
            </div>
        </div>
    )
}

export default EntryPasswordField;