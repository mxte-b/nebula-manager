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
import Icons from "../components/Icons";

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
                
                <section className="content">
                    <Router>
                        <Route path="vault" element={<Vault />} />
                        <Route path="export" element={<Export />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="about" element={<About />} />
                    </Router>
                </section>

                <button type="button" className="add-button">
                    <Icons.Plus />
                    <div className="button-text">Add</div>
                </button>
            </main>
        </RouterProvider>
    );
}

export default App;
