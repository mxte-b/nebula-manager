import "../styles/App.scss";
import "../styles/NumberTicker.scss";
import { useEffect, useMemo, useState } from "react";
import SideBar from "../components/SideBar";
import { invoke } from "@tauri-apps/api/core";
import { isRegistered, register } from "@tauri-apps/plugin-global-shortcut";
import { Route, Router } from "../components/Router";
import Vault from "./Vault";
import Export from "./Export";
import Settings from "./Settings";
import About from "./About";
import Icons from "../components/Icons";
import { Entry, UpdateEntry } from "../types/general";
import UpdateForm from "../components/UpdateForm";
import { useToast } from "../contexts/toast";
import { AnimatePresence, motion } from "motion/react";
import { useVault } from "../contexts/vault";
import EntryForm from "../components/EntryForm";
import { useError } from "../contexts/error";
import VaultIntro from "../components/VaultIntro";
import FloatingIcon from "../components/FloatingIcon";

// Assign the overlay shortcut
await isRegistered("CommandOrControl+K").then(async (r) => {
    if (!r) {
        await register("CommandOrControl+K", (e) => {
        // Ignore key release
        if (e.state == "Released") return;

        invoke("toggle_overlay");
    });
    }
})

function App() {
    const [isEntryFormVisible, setIsEntryFormVisible] = useState<boolean>(false);
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState<boolean>(false);
    
    const { entries } = useVault();
    const [entryToUpdate, setEntryToUpdate] = useState<string>("");

    const introShown = useMemo<boolean>(() => !entries || entries.length === 0 , [entries]);

    const { createEntry, updateEntry } = useVault();
    const { addToast } = useToast();
    const { addError } = useError();

    const handleNewEntrySubmit = async (entry: Entry) => createEntry(entry, { err: addError }).then((e) => {
        if (e.ok) setIsEntryFormVisible(false);
    });

    const handleEntryUpdateSubmit = (id: string, entry: UpdateEntry) => {
        updateEntry(id, entry, { err: addError }).then((e) => {
            if (e.ok) {
                setIsUpdateFormVisible(false);
                addToast({
                    type: "success",
                    message: "Update successful!",
                    duration: 5000,
                })
            }
        });
    }

    useEffect(() => {
        // Disable context menu
        const prevent = (e: Event) => e.preventDefault()
        window.addEventListener("contextmenu", prevent);

        return () => window.removeEventListener("contextmenu", prevent);
    }, []);

    return (
        <motion.main
            key={"dashboard"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dashboard"
        >
            <SideBar className={introShown ? "intro-shown" : ""} />

            <AnimatePresence>
            {
                introShown && 
                <motion.div
                    initial={{ opacity: 0  }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="vault-intro__fx"
                >
                    <FloatingIcon.ShieldLock 
                        className="vault-intro__icon"
                        x={"65%"} y={"10%"} 
                        rotation={5} size={180} 
                        color={"#915483"} opacity={0.1} 
                        parallaxValue={1}
                    />
                </motion.div>
            }
            </AnimatePresence>
            
            <motion.div layout className="content-wrapper">
                <AnimatePresence mode="wait">
                    {
                        introShown
                        ? <VaultIntro key={"intro"} onAddButtonClicked={() => setIsEntryFormVisible(true)} />
                        : (
                            <Router key={"router"}>
                                <Route path="vault" element={
                                    <Vault onEntryUpdate={(e) => {
                                            setEntryToUpdate(e);
                                            setIsUpdateFormVisible(true);
                                    }}/>
                                } />
                                <Route path="export" element={<Export />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="about" element={<About />} />
                            </Router>
                        )
                    }
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {
                    entries && entries.length > 0 &&
                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        type="button" 
                        className="add-button" 
                        onClick={() => setIsEntryFormVisible(true)}
                    >
                        <Icons.Plus />
                        <div className="button-text">Add</div>
                    </motion.button>
                }
            </AnimatePresence>

            <EntryForm 
                visible={isEntryFormVisible} 
                onSubmit={handleNewEntrySubmit}
                onClose={() => setIsEntryFormVisible(false)}
            />

            <UpdateForm
                entry={entries?.find(x => x.id == entryToUpdate)}
                visible={isUpdateFormVisible}
                onSubmit={handleEntryUpdateSubmit}
                onClose={() => setIsUpdateFormVisible(false)}
            />
        </motion.main>
    );
}

export default App;
