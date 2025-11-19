import { useEffect } from "react";
import "../styles/App.css";
import SideBar from "../components/SideBar";
import { invoke } from "@tauri-apps/api/core";
import { register } from "@tauri-apps/plugin-global-shortcut";
import SearchBar from "../components/SearchBar";
import { Route, Router } from "../components/Router";
import Vault from "./Vault";
import { RouterProvider } from "../contexts/router";
import Export from "./Export";
import Settings from "./Settings";
import About from "./About";

await register("CommandOrControl+K", (e) => {
    // Ignore key release
    if (e.state == "Released") return;

    invoke("toggle_overlay");
});

function App() {
    useEffect(() => {
    }, []);

    return (
        <RouterProvider>
            <main className="dashboard">
                <SideBar />

                
                <Router>
                    <Route path="vault" element={<Vault />} />
                    <Route path="export" element={<Export />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="about" element={<About />} />
                </Router>
            </main>
        </RouterProvider>
    );
}

export default App;
