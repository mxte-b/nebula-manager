import { ReactNode } from "react"

const HoverableIcon = (
    {
        children,
        hoverFg,
        hoverBg,
        onClick
    }:
    {
        children: ReactNode,
        hoverFg: string,
        hoverBg: string,
        onClick?: () => void
    }
) => {
    return (
        <div 
            className="icon-hoverable" 
            onClick={onClick}
            style={{
                "--hover-fg": hoverFg,
                "--hover-bg": hoverBg
            } as React.CSSProperties}
        >
           {children}
        </div>
    )
}

export default HoverableIcon;