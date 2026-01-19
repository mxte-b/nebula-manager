import "../styles/App.scss";
import "../styles/NumberTicker.scss";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { invoke } from "@tauri-apps/api/core";
import { isRegistered, register } from "@tauri-apps/plugin-global-shortcut";
import { Route, Router } from "../components/Router";
import Vault from "./Vault";
import Export from "./Export";
import Settings from "./Settings";
import About from "./About";
import Icons from "../components/Icons";
import EntryForm from "../components/EntryForm";
import { Entry, UpdateEntry } from "../types/general";
import UpdateForm from "../components/UpdateForm";
import { useToast } from "../contexts/toast";
import { motion } from "motion/react";
import { useVault } from "../contexts/vault";
import { useModal } from "../contexts/modal";

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

    const { createEntry, updateEntry, toggleFavorite, deleteEntry } = useVault();
    const { addToast } = useToast();
    const { openModal } = useModal();

    const handleNewEntrySubmit = async (entry: Entry) => createEntry(entry).then(() => setIsEntryFormVisible(false));

    const handleEntryUpdateSubmit = (id: string, entry: UpdateEntry) => {
        updateEntry(id, entry).then(() => {
            setIsUpdateFormVisible(false);
            addToast({
                type: "success",
                message: "Update successful!",
                duration: 5000,
            })
        });
    }

    const handleEntryFavorite = (id: string) => toggleFavorite(id);

    const handleEntryDelete = (id: string) => {
        deleteEntry(id).then(() => addToast({
            type: "success",
            message: "Deletion successful!",
            duration: 5000,
        }))
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
            <SideBar />
            
            <div className="content-wrapper">
                <Router>
                    <Route path="vault" element={
                        <Vault 
                            entries={entries}
                            onEntryDelete={handleEntryDelete}
                            onEntryUpdate={(e) => {
                                setEntryToUpdate(e);
                                setIsUpdateFormVisible(true);
                            }}
                            onEntryFavorite={handleEntryFavorite}
                        />
                    } />
                    <Route path="export" element={<Export />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="about" element={<About />} />
                </Router>
            </div>

            <button 
                type="button" 
                className="add-button" 
                onClick={() => setIsEntryFormVisible(true)}
            >
                <Icons.Plus />
                <div className="button-text">Add</div>
            </button>

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
