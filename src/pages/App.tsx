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
import { Entry, UpdateEntry } from "../types/general";
import useVault from "../hooks/useVault";
import UpdateForm from "../components/UpdateForm";
import { useAlert } from "../contexts/alert";
import AlertManager from "../components/AlertManager";
import PopupManager from "../components/ConfirmPopupManager";

await register("CommandOrControl+K", (e) => {
    // Ignore key release
    if (e.state == "Released") return;

    invoke("toggle_overlay");
});

function App() {
    const [isEntryFormVisible, setIsEntryFormVisible] = useState<boolean>(false);
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState<boolean>(false);

    const [vaultEntries, setVaultEntries] = useState<Entry[] | null>(null);
    const [entryToUpdate, setEntryToUpdate] = useState<string>("");

    const { 
        getVaultEntries,
        createVaultEntry,
        updateVaultEntry,
        toggleFavorite,
        deleteVaultEntry,
    } = useVault();

    const {
        addAlert
    } = useAlert();

    const handleNewEntrySubmit = async (entry: Entry) => {
        createVaultEntry(entry, {
            ok: (e) => {
                setIsEntryFormVisible(false);
                setVaultEntries(e);
            },
            err: (e) => addAlert({
                type: "error",
                message: `Couldn't create entry: ${e}`,
                duration: 5000,
            })
        });
    }

    const handleEntryUpdateSubmit = (id: string, entry: UpdateEntry) => {
        updateVaultEntry(id, entry, {
            ok: (newEntry) => {
                setIsUpdateFormVisible(false);
                setVaultEntries(p => p?.map(e => e.id === id ? newEntry : e) || null)
                addAlert({
                    type: "success",
                    message: "Update successful!",
                    duration: 5000,
                })
            },
            err: (e) => addAlert({
                type: "error",
                message: `Couldn't update entry: ${e}`,
                duration: 5000,
            })
        });
    }

    const handleEntryFavorite = (id: string) => {
        toggleFavorite(id, {
            ok: () => {
                setVaultEntries(p => p?.map(e => e.id === id ? {...e, favorite: !e.favorite} as Entry : e) || null)
            },
            err: (e) => addAlert({
                type: "error",
                message: `Couldn't favourite entry: ${e}`,
                duration: 5000,
            })
        });
    }

    const handleEntryDelete = (id: string) => {
        deleteVaultEntry(id, {
            ok: () => {
                setVaultEntries(p => p?.filter(e => e.id != id) || null)
                addAlert({
                    type: "success",
                    message: "Deletion successful!",
                    duration: 5000,
                })
            },
            err: (e) => addAlert({
                type: "error",
                message: `Couldn't delete entry: ${e}`,
                duration: 5000,
            })
        });
    }

    useEffect(() => {
        // Disable context menu
        const prevent = (e: Event) => e.preventDefault()
        window.addEventListener("contextmenu", prevent);

        getVaultEntries({
            ok: setVaultEntries,
            err: (e) => alert(`Failed to get vault entries: ${e}`)
        });

        return () => window.removeEventListener("contextmenu", prevent);
    }, []);

    return (
        <main className="dashboard">
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

            <AlertManager />
            <PopupManager />
        </main>
    );
}

export default App;
