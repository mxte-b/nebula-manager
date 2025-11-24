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
        createVaultEntry
    } = useVault();

    const handleNewEntrySubmit = (entry: Entry) => {
        createVaultEntry(entry, {
            ok: (e) => {
                setIsEntryFormVisible(false);
                setVaultEntries(e);
            },
            err: (e) => alert(`Couldn't create entry: ${e}`)
        });
    }

    const handleEntryUpdateSubmit = (entry: Entry) => {
        
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
                
                <section className="content no-scrollbar">
                    <Router>
                        <Route path="vault" element={<Vault entries={vaultEntries}/>} />
                        <Route path="export" element={<Export />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="about" element={<About />} />
                    </Router>
                </section>

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
