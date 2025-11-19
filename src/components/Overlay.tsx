import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import OverlaySearchBar from "./OverlaySearchBar";

const Overlay = () => {

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == "Escape") {
            invoke("toggle_overlay");
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
    });

    return (
        <div className="overlay">
            <OverlaySearchBar />
        </div>
    )
}

export default Overlay;