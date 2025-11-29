import { useEffect, useState } from "react";
import "../styles/App.css";
import SideBar from "../components/SideBar";
import { invoke } from "@tauri-apps/api/core";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { Route, Router } from "../components/Router";
import Vault from "./Vault";
import { RouterProvider } from "../contexts/router";
import Export from "./Export";
import Settings from "./Settings";
import About from "./About";
import Icons from "../components/Icons";
import EntryForm from "../components/EntryForm";
import { Entry } from "../types/general";
import useVault from "../hooks/useVault";

await register("CommandOrControl+K", (e) => {
    // Ignore key release
    if (e.state == "Released") return;

    invoke("toggle_overlay");
});

function App() {
    const [isEntryFormVisible, setIsEntryFormVisible] = useState<boolean>(false);
    const [vaultEntries, setVaultEntries] = useState<Entry[] | null>(null);

    const { 
        getVaultEntries,
        createVaultEntry,
        toggleFavorite,
        deleteVaultEntry,
    } = useVault();

    const handleNewEntrySubmit = async (entry: Entry) => {
        createVaultEntry(entry, {
            ok: (e) => {
                setIsEntryFormVisible(false);
                setVaultEntries(e);
            },
            err: (e) => alert(`Couldn't create entry: ${e}`)
        });
    }

    // const handleEntryUpdateSubmit = (entry: Entry) => {
        
    // }

    const handleEntryFavorite = (id: string) => {
        toggleFavorite(id, {
            ok: () => {
                setVaultEntries(p => p?.map(e => e.id === id ? {...e, favorite: !e.favorite} as Entry : e) || null)
            },
            err: (e) => alert(`Couldn't favorite entry: ${e}`)
        });
    }

    const handleEntryDelete = (id: string) => {
        deleteVaultEntry(id, {
            ok: () => {
                setVaultEntries(p => p?.filter(e => e.id != id) || null)
            },
            err: (e) => alert(`Couldn't delete entry: ${e}`)
        });
    }

    useEffect(() => {
        getVaultEntries({
            ok: setVaultEntries,
            err: (e) => alert(`Failed to get vault entries: ${e}`)
        });
    }, []);

    return (
        <RouterProvider>
            <main className="dashboard">
                <SideBar />
                
                
                <div className="content-wrapper">
                    <Router>
                        <Route path="vault" element={
                            <Vault 
                                entries={vaultEntries}
                                onEntryDelete={handleEntryDelete}
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
            </main>
        </RouterProvider>
    );
}

export default App;
