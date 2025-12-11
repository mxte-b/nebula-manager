import { ReactNode, useEffect, useRef, useState } from "react"
import cooldown from "../types/cooldown";

const TOOLTIP_MIN_EDGE_DIST = 8;

const Tooltip = ({
    text,
    children
}:
{
    text: string,
    children: ReactNode
}) => {

    const tooltipRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    const [tooltipPosition, setTooltipPosition] = useState<"top" | "right" | "bottom" | "left" >("top");
    
    const observe = () => {
        if (!tooltipRef.current || !sectionRef.current) return;

        const rect = tooltipRef.current.getBoundingClientRect();
        const bodyRect = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Overflow detection - Y axis 
        // (only top overflow is possible since the tooltip appears ABOVE the elements)
        if (rect.top < TOOLTIP_MIN_EDGE_DIST) {
            setTooltipPosition("bottom");
        }
        // Overflow detection - X axis
        else if (bodyRect.width - rect.right < TOOLTIP_MIN_EDGE_DIST) {
            setTooltipPosition("left");
        }
        else if (rect.left < TOOLTIP_MIN_EDGE_DIST) {
            setTooltipPosition("right");
        }
        else {
            setTooltipPosition("top");
        }
        
    }

    const debouncedObserve = useRef(cooldown(observe, 100));

    useEffect(() => {
        if (!tooltipRef.current) return;

        if (!sectionRef.current) {
            sectionRef.current = tooltipRef.current.closest("section.content");

            if (!sectionRef.current) {
                alert("No section element found");
                return;
            }
        }

        debouncedObserve.current();

        // Observe the window for changes
        sectionRef.current.addEventListener("scroll", debouncedObserve.current);
        window.addEventListener("resize", debouncedObserve.current);

        return () => {
            sectionRef.current?.removeEventListener("scroll", debouncedObserve.current);
            window.removeEventListener("resize", debouncedObserve.current);
        }
    }, []);


    return (
        <div className="tooltip-wrapper">
            <div className="tooltip-aligner">
                <div className={`tooltip tooltip-${tooltipPosition}`} ref={tooltipRef}>
                    {text}
                </div>
            </div>
            {children}
        </div>
    )
}

export default Tooltip;