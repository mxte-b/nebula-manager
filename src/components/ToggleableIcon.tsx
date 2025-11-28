import { JSX, useState } from "react";

const ToggleableIcon = (
    {
        defaultElement,
        toggledElement,
        onToggle
    }: {
        defaultElement: JSX.Element,
        toggledElement: JSX.Element
        onToggle?: (v: boolean) => void
    }
) => {
    const [toggled, setToggled] = useState<boolean>(false);

    return <span 
                className={"icon-toggleable" + (toggled ? " toggled" : "")}
                onClick={() => {
                    setToggled(p => {
                        const next = !p;
                        onToggle?.(next);
                        return next;
                    });
                }}
            >
        <div className="icon-hoverable">{ defaultElement }</div>
        <div className="icon-hoverable">{ toggledElement }</div>
    </span>
}

export default ToggleableIcon;