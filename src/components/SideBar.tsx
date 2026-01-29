import { CSSProperties } from "react";
import { useRouter } from "../contexts/router";
import { Page } from "../types/general";
import Icons from "./Icons";
import { motion } from "motion/react";

const PAGES: {
    id: Page, label: string, icon: keyof typeof Icons
}[] = [
    { id: "vault", label: "Dashboard", icon: "Home" },
    { id: "export", label: "Export", icon: "Upload" },
    { id: "settings", label: "Settings", icon: "Gear" },
    { id: "about", label: "About", icon: "InfoCircle"  },
];

const SideBar = () => {
    const { currentPage, navigate } = useRouter();

    const pageIdx = PAGES.findIndex(p => p.id == currentPage);

    return (
        <div className="side-bar">
            <div className="title">
                <img src="/icon.png" alt="Nebula Manager Icon" />
                EBULA
            </div>

            <div className="side-bar-links">
                {
                    PAGES.map(p => {
                        const Icon = Icons[p.icon];

                        return <div className={"side-bar-link" + (currentPage == p.id ? " active" : "")} onClick={() => navigate(p.id)}>
                            <Icon />
                            { p.label }
                        </div>
                    })
                }
                <motion.div layout className="side-bar-pill" style={{"--idx" : pageIdx} as CSSProperties}/>
            </div>
        </div>
    )
}

export default SideBar;