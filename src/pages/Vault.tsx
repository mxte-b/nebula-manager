import Favicon from "../components/Favicon";
import { Entry } from "../types/general";

const Vault = ({ entries }: { entries: Entry[] | null }) => {

    return (
        <>
            <header>My passwords</header>
            <div className="entries">
                {
                    entries &&
                    entries.map((e, i) => 
                        <div className="entry" key={"favicon-"+i}>
                            <Favicon
                                label={e.label} 
                                url={e.url} 
                            />
                            <div className="group">
                                <div className="entry-label">{e.label}</div>
                                <div className="entry-name">{e.name}</div>
                            </div>
                            <div className="entry-password">••••••••••</div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Vault