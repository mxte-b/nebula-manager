import { JSX, useEffect, useRef, useState } from "react";

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
                    console.log(enabled)
                    if (enabled) setIsToggled(p => !p);
                }}
            >
        <div className="icon-hoverable" style={{
            "--hover-fg": hoverFg,
            "--hover-bg": hoverBg
        } as React.CSSProperties}>{ defaultElement }</div>
        <div className="icon-hoverable" style={{
            "--hover-fg": hoverFg,
            "--hover-bg": hoverBg
        } as React.CSSProperties}>{ toggledElement }</div>
    </span>
}

export default ToggleableIcon;