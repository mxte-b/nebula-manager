import { useRouter } from "../contexts/router";
import Icons from "./Icons";

const SideBar = () => {
    const { currentPage, navigate } = useRouter();

    return (
        <div className="side-bar">
            <div className="title">
                NEBULA
            </div>
            <div className="separator" />
            <div className={"link" + (currentPage == "vault" ? " active" : "")} onClick={() => navigate("vault")}>
                <Icons.ShieldLock />
                My Vault
            </div>
            <div className={"link" + (currentPage == "export" ? " active" : "")} onClick={() => navigate("export")}>
                <Icons.Upload />
                Export
            </div>
            <div className={"link" + (currentPage == "settings" ? " active" : "")} onClick={() => navigate("settings")}>
                <Icons.Gear />
                Settings
            </div>
            <div className={"link" + (currentPage == "about" ? " active" : "")} onClick={() => navigate("about")}>
                <Icons.InfoCircle />
                About
            </div>
        </div>
    )
}

export default SideBar;