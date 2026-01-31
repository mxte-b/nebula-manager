import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import OverlaySearchBar from "./OverlaySearchBar";
import { AnimatePresence, motion } from "motion/react";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import "../styles/Overlay.scss";
import { Entry } from "../types/general";
import { useVault } from "../contexts/vault";

const Overlay = () => {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Entry[]>([]);

    const { searchEntries } = useVault();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == "Escape") {
            invoke("toggle_overlay");
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        let unlistenHide: UnlistenFn | undefined = undefined;
        let unlistenShow: UnlistenFn | undefined = undefined;

        (async() => {
            unlistenHide = await listen("overlay_before_hide", () => {
                setIsVisible(false);
                setSearchResults([]);
            });
            unlistenShow = await listen("overlay_show", () => setIsVisible(true));
        })();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            unlistenHide?.();
            unlistenShow?.();
        }
    });

    return (
        <AnimatePresence>    
            {
                isVisible &&
                <motion.div 
                    className="overlay"
                    initial={{filter: "blur(10px)", opacity: 0, scale: 0.95 }}
                    animate={{filter: "blur(0px)", opacity: 1, scale: 1 }}
                    exit={{filter: "blur(10px)", opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    <OverlaySearchBar onSearch={(query: string) => {
                        setSearchResults(searchEntries(query));
                    }} />

                    {
                        searchResults.map(r => <div>{r.label}</div>)
                    }
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default Overlay;