import { JSX, useState } from "react";

const ToggleableIcon = (
    {
        defaultElement,
        toggledElement,
        hoverBg,
        hoverFg,
        toggled,
        onToggle
    }: {
        defaultElement: JSX.Element,
        toggledElement: JSX.Element
        hoverBg: string,
        hoverFg: string,
        toggled?: boolean
        onToggle?: (v: boolean) => void
    }
) => {
    const [isToggled, setIsToggled] = useState<boolean>(toggled || false);

    return <span 
                className={"icon-toggleable" + (isToggled ? " toggled" : "")}
                onClick={() => {
                    setIsToggled(p => {
                        const next = !p;
                        onToggle?.(next);
                        return next;
                    });
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