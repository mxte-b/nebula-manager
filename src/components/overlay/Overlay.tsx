import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OverlaySearchBar from "./OverlaySearchBar";
import { AnimatePresence, motion } from "motion/react";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import "../../styles/Overlay.scss";
import "../../styles/NumberTicker.scss";
import { Entry, SearchResults } from "../../types/general";
import { useVault } from "../../contexts/vault";
import useTauriFocusFix from "../../hooks/useTauriFocusFix";
import NumberTicker from "../NumberTicker";
import { useError } from "../../contexts/error";
import OverlayListItem from "./OverlayListItem";
import Icons from "../Icons";

const Overlay = () => {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const isInteractableRef = useRef<boolean>(false);

    const { searchEntries, entries, copyEntryDetail } = useVault();
    const { addError } = useError();
    
    useTauriFocusFix();

    const quickAccessEntries = useMemo(() => {
        if (!entries) return [];

        const seen = new Set<string>();
        const result: Entry[] = [];

        for (const e of entries.filter(e => e.favorite).sort((a, b) => b.uses - a.uses)) {
            if (result.length >= 3) break;

            seen.add(e.id);
            result.push(e);
        }

        for (const e of [...entries].sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))) {
            if (result.length >= 5) break;
            if (seen.has(e.id)) continue;

            seen.add(e.id);
            result.push(e);
        }

        return result;
    }, [entries]);

    const visibleEntries = useMemo(() => 
        searchResults !== null 
            ? searchResults.results.map(e => ({ key: "search", id: e.id })) 
            : quickAccessEntries.map(e => ({ key: "quick", id: e.id}))
    , [searchResults, quickAccessEntries]);

    const activeId = useMemo(() => selectedIdx !== null ? visibleEntries[selectedIdx]: null, [selectedIdx, visibleEntries]);

    const selectEntry = (id: string) => {
        copyEntryDetail(id, "password", 30000, {
            ok: () => invoke("toggle_overlay"),
            err: addError
        });
    }

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            invoke("toggle_overlay");
            return;
        }

        if (!visibleEntries || visibleEntries.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIdx(i => ((i ?? -1) + 1) % visibleEntries.length);
                break;

            case "Tab":
                e.preventDefault();
                setSelectedIdx(i => ((i ?? -1) + 1) % visibleEntries.length);
                break;

            case "ArrowUp":
                e.preventDefault();
                setSelectedIdx(i => (((i === null) || (i === 0) ? visibleEntries.length : i) - 1) % visibleEntries.length);
                break;

            case "Enter":
                e.preventDefault();
                if (activeId) {
                    selectEntry(activeId.id);
                }
                break;
        }
    }, 
    [activeId, visibleEntries]);

    const getActiveElement = () => {
        if (!searchResults) {

            if (quickAccessEntries.length > 0) return (
                <motion.div key={"quick-access"} className="overlay-list-category">
                    <div className="overlay-list-category-title">
                        QUICK ACCESS
                    </div>
                    <AnimatePresence>
                        {
                            quickAccessEntries.length > 0 && 
                            <motion.div className="overlay-list-items">
                            {
                                quickAccessEntries.map(r => (
                                    <OverlayListItem
                                        key={`quick-${r.id}`}
                                        category="quick"
                                        entry={r}
                                        activeId={activeId}
                                        onClick={() => selectEntry(r.id)}
                                    />
                                ))
                            }
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>
            )
            else return (
                <motion.div 
                    key={"need-data"} 
                    className="overlay-no-results"
                >
                    <Icons.MagnifyingGlass />
                    <div className="title">No quick suggestions yet</div>
                    <div className="subtitle">
                        Your most-used passwords will appear here.
                    </div>
                </motion.div>
            )
        }
        else if (searchResults.numResults == 0) {
            return (
                <motion.div className="overlay-no-results" key={"no-results"}>
                    <Icons.MagnifyingGlass />
                    <div className="title">Nothing found</div>
                    <div className="subtitle">
                        We couldn't find any entries matching that search.
                    </div>
                </motion.div>
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
                    {
                        searchResults.results.map(r => 
                            <OverlayListItem
                                key={`search-${r.id}`} 
                                category="search"
                                entry={r} 
                                activeId={activeId}
                                labelOverride={
                                    <>
                                        <span className="highlight">
                                            { r.label.substring(0, searchResults.query.length) }
                                        </span>

                                        <span>{ r.label.substring(searchResults.query.length) }</span>
                                    </>
                                }
                                onClick={() => selectEntry(r.id)}
                            />
                        )
                    }
                </div>
            </div>
        )
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        let unlistenHide: UnlistenFn | undefined = undefined;
        let unlistenShow: UnlistenFn | undefined = undefined;

        (async() => {
            unlistenHide = await listen("overlay_before_hide", () => {
                setIsVisible(false);
                setSearchResults(null);
                setSelectedIdx(null);

                isInteractableRef.current = false;
            });
            unlistenShow = await listen("overlay_show", () => {
                setSearchResults(null);
                setSelectedIdx(null);
                setIsVisible(true);

                isInteractableRef.current = true;
            });
        })();

        return () => {
            unlistenHide?.();
            unlistenShow?.();
        }
    }, []);
    

    useEffect(() => {
        setSelectedIdx(visibleEntries.length > 0 ? 0 : null);
    }, [visibleEntries]);

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
                        if (!isInteractableRef.current) return;

                        if (!query || query.length < 1) {
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

                    <div className={"overlay-list" + (searchResults && searchResults.numResults > 5 ? " overflow" : "")}>
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