import { Entry } from "../types/general";

const Vault = ({ entries }: { entries: Entry[] | null }) => {

    return (
        <>
            <div>Vault</div>
            <div className="entries">
            {
                entries &&
                entries.map(e => 
                    <div className="entry">
                        {e.label} - {e.name} - {e.password}
                    </div>
                )
            }
            </div>
        </>
    )
}

export default Vault