import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../styles/App.css";
import SideBar from "./SideBar";

function App() {
    // async function greet() {
    //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    //   setGreetMsg(await invoke("greet", { name }));
    // }

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
