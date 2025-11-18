import { useEffect } from "react";
import "../styles/App.css";
import SideBar from "./SideBar";
import { invoke } from "@tauri-apps/api/core";

function App() {
    useEffect(() => {
        invoke("open_overlay");
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
