import { JSX, useEffect, useRef, useState } from "react";
import HoverableIcon from "./HoverableIcon";

const ToggleableIcon = (
    {
        defaultElement,
        toggledElement,
        hoverBg,
        hoverFg,
        toggled,
        enabled = true,
        onToggle
    }: {
        defaultElement: JSX.Element,
        toggledElement: JSX.Element
        hoverBg: string,
        hoverFg: string,
        toggled?: boolean
        enabled?: boolean
        onToggle?: (v: boolean) => void
    }
) => {
    const [isToggled, setIsToggled] = useState<boolean>(toggled || false);
    const isFirstRender = useRef<boolean>(true);

    useEffect(() => {
        if (isFirstRender.current) {
            // Skip the first render
            isFirstRender.current = false;
            return;
        }
        onToggle?.(isToggled);
    }, [isToggled]);

    return <span 
                className={"icon-toggleable" + (isToggled ? " toggled" : "")}
                onClick={() => {
                    if (enabled) setIsToggled(p => !p);
                }}
            >
        <HoverableIcon hoverFg={hoverFg} hoverBg={hoverBg}>
            { defaultElement }
        </HoverableIcon>
        <HoverableIcon hoverFg={hoverFg} hoverBg={hoverBg}>
            { toggledElement }
        </HoverableIcon>
    </span>
}

export default ToggleableIcon;