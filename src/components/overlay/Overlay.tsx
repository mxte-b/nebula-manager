import { invoke } from "@tauri-apps/api/core";
import { Fragment, useEffect, useState } from "react";
import OverlaySearchBar from "./OverlaySearchBar";
import { AnimatePresence, motion } from "motion/react";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import "../../styles/Overlay.scss";
import "../../styles/NumberTicker.scss";
import { Entry, SearchResults } from "../../types/general";
import { useVault } from "../../contexts/vault";
import Favicon from "../Favicon";
import useTauriFocusFix from "../../hooks/useTauriFocusFix";
import TagPill from "../TagPill";
import { Color } from "@tauri-apps/api/webviewWindow";
import Icons from "../Icons";
import NumberTicker from "../NumberTicker";
import { openUrl } from "@tauri-apps/plugin-opener";

type TagData = {
    name: string;
    color: Color;
    icon: keyof typeof Icons;
};

const Overlay = () => {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

    const { searchEntries } = useVault();
    
    useTauriFocusFix();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == "Escape") {
            invoke("toggle_overlay");
        }
    }

    const getEntryTags = (entry: Entry) => {
        const tags: TagData[] = [];

        if (entry.favorite) tags.push({ name: "Favorite", color: "#d3b716", icon: "StarFill" });
        if (entry.uses > 10) tags.push({ name: "Frequent", color: "#d16f13", icon: "Fire" });

        return tags;
    }

    const getActiveElement = () => {
        if (!searchResults) {
            return (
                <Fragment key={"default-view"}>
                    <div className="overlay-list-category">
                        <div className="overlay-list-category-title">
                            FAVORITES
                        </div>
                        <div className="overlay-list-items">
                            
                        </div>
                    </div>
                    <div className="overlay-list-category">
                        <div className="overlay-list-category-title">
                            RECENTLY USED
                        </div>
                        <div className="overlay-list-items">
                            
                        </div>
                    </div>
                </Fragment>
            )
        }
        else if (searchResults.numResults == 0) {
            return (
                <div className="overlay-list-category" key={"no-results"}>
                    <div className="overlay-list-no-results">
                        No Results
                    </div>
                </div>
            )
        }
        else return (
            <div className="overlay-list-category" key={"search-results"}>
                <div className="overlay-list-category-title">
                    <span>SEARCH RESULTS</span>
                    <span className="separator">-</span>
                    {
                        searchResults.numResults > 0 && 
                        <NumberTicker mode="auto" size={16} number={searchResults.numResults} />
                    }
                </div>
                <div className="overlay-list-items">
                    <AnimatePresence> 
                    {
                        searchResults.results.map(r => 
                            <div className="overlay-list-item" key={`search-${r.id}`} tabIndex={0}>
                                <div className="overlay-list-item-icon">
                                    <Icons.ArrowUpRight />
                                    <Favicon label={r.label} url={r.url} size={35} onClick={() => openUrl(r.url)}/>
                                </div>
                                <div className="overlay-list-item-label">
                                    <span className="highlight">
                                        { r.label.substring(0, searchResults.query.length) }
                                    </span>

                                    { r.label.substring(searchResults.query.length) }
                                </div>
                                <div className="overlay-list-item-name">
                                    { r.name }
                                </div>

                                <div className="overlay-list-item-tags">
                                    {
                                        getEntryTags(r).map(t => <TagPill tag={t.name} color={t.color} icon={t.icon} />)
                                    }
                                </div>
                            </div>
                        )
                    }
                    </AnimatePresence>
                </div>
            </div>
        )
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        let unlistenHide: UnlistenFn | undefined = undefined;
        let unlistenShow: UnlistenFn | undefined = undefined;

        (async() => {
            unlistenHide = await listen("overlay_before_hide", () => {
                setIsVisible(false);
                setSearchResults(null);
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
                        if (!query) {
                            setSearchResults(null);
                            return;
                        }

                        const results = searchEntries(query);

                        setSearchResults({
                            query: query,
                            results: results,
                            numResults: results.length 
                        });
                    }} />

                    <div className="overlay-list">
                        <AnimatePresence mode="wait">
                            { getActiveElement() }
                        </AnimatePresence>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default Overlay;