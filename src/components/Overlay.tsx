import { register } from "@tauri-apps/plugin-global-shortcut";
import { useEffect } from "react";

await register("CommandOrControl+K", (e) => {
    // Ignore key release
    if (e.state == "Released") return;

    console.log("Opening overlay");
});

const Overlay = () => {

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == "Escape") {
            console.log("Leaving overlay");
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
    });

    return (
        <div className="overlay">Overlay</div>
    )
}

export default Overlay;