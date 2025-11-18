import { useEffect } from "react";
import "../styles/App.css";
import SideBar from "./SideBar";
import { invoke } from "@tauri-apps/api/core";
import { register } from "@tauri-apps/plugin-global-shortcut";

await register("CommandOrControl+K", (e) => {
    // Ignore key release
    if (e.state == "Released") return;

    invoke("toggle_overlay");
});

function App() {
    useEffect(() => {
    }, []);

    return (
        <main className="dashboard">
            <SideBar />
            <section className="content">
                <header className="greeting">Welcome back!</header>
            </section>
        </main>
    );
}

export default App;
