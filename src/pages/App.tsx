import "../styles/App.scss";
import "../styles/NumberTicker.scss";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { invoke } from "@tauri-apps/api/core";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { Route, Router } from "../components/Router";
import Vault from "./Vault";
import Export from "./Export";
import Settings from "./Settings";
import About from "./About";
import Icons from "../components/Icons";
import EntryForm from "../components/EntryForm";
import { Entry, UpdateEntry, VaultStatus } from "../types/general";
import vaultUtils from "../utils/vaultUtils";
import UpdateForm from "../components/UpdateForm";
import { useToast } from "../contexts/toast";
import { useError } from "../contexts/error";
import { motion } from "motion/react";

await register("CommandOrControl+K", (e) => {
    // Ignore key release
    if (e.state == "Released") return;

    invoke("toggle_overlay");
});

function App() {
    const [isEntryFormVisible, setIsEntryFormVisible] = useState<boolean>(false);
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState<boolean>(false);

    const [vaultStatus, setVaultStatus] = useState<VaultStatus | null>(null);
    const [vaultEntries, setVaultEntries] = useState<Entry[] | null>(null);
    const [entryToUpdate, setEntryToUpdate] = useState<string>("");

    const { 
        getVaultStatus,
        getVaultEntries,
        createVaultEntry,
        updateVaultEntry,
        toggleFavorite,
        deleteVaultEntry,
    } = vaultUtils();

    const {
        addToast
    } = useToast();

    const { addError } = useError();

    const handleNewEntrySubmit = async (entry: Entry) => {
        createVaultEntry(entry, {
            ok: (e) => {
                setIsEntryFormVisible(false);
                setVaultEntries(e);
            },
            err: addError
        });
    }

    const handleEntryUpdateSubmit = (id: string, entry: UpdateEntry) => {
        updateVaultEntry(id, entry, {
            ok: (newEntry) => {
                setIsUpdateFormVisible(false);
                setVaultEntries(p => p?.map(e => e.id === id ? newEntry : e) || null)
                addToast({
                    type: "success",
                    message: "Update successful!",
                    duration: 5000,
                })
            },
            err: addError
        });
    }

    const handleEntryFavorite = (id: string) => {
        toggleFavorite(id, {
            ok: () => {
                setVaultEntries(p => p?.map(e => e.id === id ? {...e, favorite: !e.favorite} as Entry : e) || null)
            },
            err: addError
        });
    }

    const handleEntryDelete = (id: string) => {
        deleteVaultEntry(id, {
            ok: () => {
                setVaultEntries(p => p?.filter(e => e.id != id) || null)
                addToast({
                    type: "success",
                    message: "Deletion successful!",
                    duration: 5000,
                })
            },
            err: addError
        });
    }

    useEffect(() => {
        // Disable context menu
        const prevent = (e: Event) => e.preventDefault()
        window.addEventListener("contextmenu", prevent);

        getVaultStatus({
            ok: setVaultStatus,
            err: addError
        })

        getVaultEntries({
            ok: setVaultEntries,
            err: addError
        });

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
                            entries={vaultEntries}
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
                entry={vaultEntries?.find(x => x.id == entryToUpdate)}
                visible={isUpdateFormVisible}
                onSubmit={handleEntryUpdateSubmit}
                onClose={() => setIsUpdateFormVisible(false)}
            />
        </motion.main>
    );
}

export default App;
