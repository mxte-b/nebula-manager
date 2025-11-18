import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";

const Overlay = () => {

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == "Escape") {
            console.log("Leaving overlay");
            invoke("toggle_overlay");
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
    });

    return (
        <div className="overlay">
            <div className="search">
                <input type="text" name="search-value" id="searchValue" placeholder="Enter the name of the password..."/>
            </div>
        </div>
    )
}

export default Overlay;