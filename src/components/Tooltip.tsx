import { ReactNode, useEffect, useRef, useState } from "react"
import cooldown from "../types/cooldown";

const TOOLTIP_MIN_EDGE_DIST = 4;
const TOOLTIP_DEFAULT_Y_OFFSET = -40;

const Tooltip = ({
    text,
    onExitComplete,
    children
}:
{
    text: string,
    onExitComplete?: () => void,
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
        const tooltipRelativeLeft = Math.round(tooltipRect.left - sectionRectRef.current.left);
        const tooltipRelativeRight = Math.round(sectionRectRef.current.right - tooltipRect.right);

        let offset = 0;
        if (tooltipRelativeLeft < TOOLTIP_MIN_EDGE_DIST) {
            offset = TOOLTIP_MIN_EDGE_DIST - tooltipRelativeLeft;
        }
        else if (tooltipRelativeRight < TOOLTIP_MIN_EDGE_DIST) {
            offset = tooltipRelativeRight - TOOLTIP_MIN_EDGE_DIST;
        }
        
        if (offset != 0) {
            tooltipRef.current.style.setProperty("--offset-x", `${offset}px`);
        }
    }

    const updateSectionRect = () => {
        if (!sectionRef.current) return;

        sectionRectRef.current = sectionRef.current.getBoundingClientRect();
    }

    const debouncedObserve = useRef(cooldown(observe, 10));

    const handleResize = () => {
        updateSectionRect();
        debouncedObserve.current();
    }

    
    useEffect(() => {
        const tooltip = tooltipRef.current;
        const wrapper = tooltipWrapperRef.current;

        console.log(tooltip)
        
        if (!tooltip || !wrapper) return;
        
        if (!sectionRef.current) {
            sectionRef.current = wrapper.closest("section.content");
            
            if (!sectionRef.current) {
                sectionRef.current = document.body;
            }
        }
        
        setTimeout(handleResize, 100);
        
        const handleTransitionEnd = (e: TransitionEvent) => {
            console.log(e.propertyName)
            if (e.propertyName != "opacity") return;
            if (!wrapper.matches(":hover")) onExitComplete?.();
        }

        tooltip.addEventListener("transitionend", handleTransitionEnd);
        sectionRef.current.addEventListener("scroll", debouncedObserve.current);
        window.addEventListener("resize", handleResize);

        return () => {
            tooltip.removeEventListener("transitionend", handleTransitionEnd)
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
                <div className="tooltip-arrow"/>
            </div>
            {children}
        </div>
    )
}

export default Tooltip;