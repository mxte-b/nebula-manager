import { ReactNode, useEffect, useReducer, useRef, useState } from "react"
import cooldown from "../types/cooldown";

const TOOLTIP_MIN_EDGE_DIST = 8;
const TOOLTIP_DEFAULT_Y_OFFSET = -40;

const Tooltip = ({
    text,
    children
}:
{
    text: string,
    children: ReactNode
}) => {

    const tooltipWrapperRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const sectionRectRef = useRef<DOMRect>(null);

    const [tooltipPosition, setTooltipPosition] = useState<"top" | "right" | "bottom" | "left" >("top");
    
    const observe = () => {
        if (
            !tooltipWrapperRef.current || 
            !sectionRectRef.current || 
            !tooltipRef.current
        ) return;

        // DOM Rects
        const rect = tooltipWrapperRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        // Overflow detection - Y axis 
        // (only top overflow is possible since the tooltip appears ABOVE the elements)
        if (rect.top + TOOLTIP_DEFAULT_Y_OFFSET < TOOLTIP_MIN_EDGE_DIST) {
            setTooltipPosition("bottom");
        }
        else {
            setTooltipPosition("top");
        }
        
        // Overflow detection - X axis
        console.log(tooltipRect.left, sectionRectRef.current.left)
        let offset = 0;
        if (Math.floor(tooltipRect.left - sectionRectRef.current.left) < TOOLTIP_MIN_EDGE_DIST) {
            console.log(`Section left: ${sectionRectRef.current.left}, tooltip left: ${tooltipRect.left}, diff: ${tooltipRect.left - sectionRectRef.current.left}`)
            offset = Math.floor(sectionRectRef.current.left + TOOLTIP_MIN_EDGE_DIST - tooltipRect.left);
        }
        else if (Math.floor(tooltipRect.right - sectionRectRef.current.right) > TOOLTIP_MIN_EDGE_DIST) {
            console.log(`Section left: ${sectionRectRef.current.right}, tooltip left: ${tooltipRect.right}`)
            offset = Math.floor(sectionRectRef.current.right - TOOLTIP_MIN_EDGE_DIST - tooltipRect.right);
        }
        
        if (offset != 0) {
            console.log(offset);
            tooltipRef.current.style.setProperty("--offsetX", `${offset}px`);
        }
    }

    const updateSectionRect = () => {
        if (!sectionRef.current) return;

        sectionRectRef.current = sectionRef.current.getBoundingClientRect();
    }

    const debouncedObserve = useRef(cooldown(observe, 100));

    const handleResize = () => {
        updateSectionRect();
        debouncedObserve.current();
    }

    useEffect(() => {
        if (!tooltipWrapperRef.current) return;

        if (!sectionRef.current) {
            sectionRef.current = tooltipWrapperRef.current.closest("section.content");

            if (!sectionRef.current) {
                alert("No section element found");
                return;
            }
        }

        setTimeout(handleResize, 100);

        // Observe the window for changes
        sectionRef.current.addEventListener("scroll", debouncedObserve.current);
        window.addEventListener("resize", handleResize);

        return () => {
            sectionRef.current?.removeEventListener("scroll", debouncedObserve.current);
            window.removeEventListener("resize", handleResize);
        }
    }, []);


    return (
        <div className="tooltip-wrapper" ref={tooltipWrapperRef}>
            <div className={`tooltip-aligner align-${tooltipPosition}`}>
                <div className="tooltip" ref={tooltipRef}>
                    {text}
                </div>
            </div>
            {children}
        </div>
    )
}

export default Tooltip;