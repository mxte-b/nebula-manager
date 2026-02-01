import { useEffect } from "react";

const TABBABLE_SELECTOR = `
    a[href],
    button:not([disabled]),
    input:not([disabled]):not([type="hidden"]),
    select:not([disabled]),
    textarea:not([disabled]),
    iframe,
    object,
    embed,
    [contenteditable],
    [tabindex]:not([tabindex="-1"])
`;

// Workaround for https://github.com/tauri-apps/tauri/issues/11806
const useTauriFocusFix = () => {

    const isVisible = (el: HTMLElement) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;

    const getTabbableElements = () => {
        const nodes = Array.from(document.body.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR));

        return nodes
            .filter(el => !el.hasAttribute("disabled"))
            .filter(el => el.tabIndex >= 0)
            .filter(el => isVisible(el))
            .sort((a, b) => {
                if (a.tabIndex === b.tabIndex) return 0;
                if (a.tabIndex === 0) return 1;
                if (b.tabIndex === 0) return -1;
                return a.tabIndex - b.tabIndex;
            });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        e.preventDefault();

        const tabbables = getTabbableElements();
        if (!tabbables.length) return;

        const active = document.activeElement as HTMLElement;

        const currentIdx = active ? tabbables.indexOf(active) : -1;
        
        // Calculate next index
        let next = e.shiftKey ? (currentIdx <= 0 ? tabbables.length - 1 : currentIdx - 1) : (currentIdx + 1) % tabbables.length;

        tabbables[next].focus();
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return;
};

export default useTauriFocusFix;