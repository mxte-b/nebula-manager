import Favicon from "../components/Favicon";
import { Entry } from "../types/general";
import Icons from "../components/Icons";
import EntryPasswordField from "../components/EntryPasswordField";
import ToggleableIcon from "../components/ToggleableIcon";
import Footer from "../components/Footer";
import HoverableIcon from "../components/HoverableIcon";
import Tooltip from "../components/Tooltip";

const Vault = (
    { 
        entries,
        onEntryDelete,
        onEntryUpdate,
        onEntryFavorite,
    }: { 
        entries: Entry[] | null,
        onEntryDelete: (id: string) => void,
        onEntryUpdate: (id: string) => void,
        onEntryFavorite: (id: string) => void,
    }
) => {

    return (
        <>
            <h1>My passwords</h1>

            <div className="info-grid">
                <div className="favorites">
                    <div>Favorites</div>
                </div>
                <div className="recents">
                    <div>Recently used</div>
                </div>
            </div>

            <h2>Security overview</h2>
            <div>0 alerts</div>

            <h2>All - {entries?.length} entries</h2>
            <table className="entries" cellSpacing={0}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Label</th>
                        <th>Name</th>
                        <th>Password</th>
                        <th>Last Used</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {
                    entries &&
                    entries.map(e => 
                        <tr className="entry" key={e.id}>
                            <td className="entry-favorite">
                                <ToggleableIcon 
                                    defaultElement={<Icons.Star />}
                                    toggledElement={<Icons.StarFill />}
                                    hoverFg="#d3a747ff"
                                    hoverBg="#d3a74718"
                                    toggled={e.favorite}
                                    onToggle={() => onEntryFavorite(e.id)}
                                />
                            </td>
                            <td>
                                <div className="entry-label">
                                    <Favicon label={e.label} url={e.url} />
                                    <span title={e.label}>{e.label}</span>
                                </div>
                            </td>

                            <td className="entry-name">
                                <span title={e.name}>{e.name}</span>
                            </td>

                            <td>
                                <EntryPasswordField id={e.id} />
                            </td>

                            <td className="entry-last-use">{e.lastUsed.toLocaleDateString()}</td>

                            <td>
                                <div className="entry-actions">
                                    <Tooltip text="Edit">
                                        <HoverableIcon
                                            hoverFg="#699dd8ff"
                                            hoverBg="#699dd818"
                                            onClick={() => onEntryUpdate(e.id)}
                                        >
                                            <Icons.PencilFill />
                                        </HoverableIcon>
                                    </Tooltip>

                                    <Tooltip text="Delete">
                                        <HoverableIcon
                                            hoverFg="#ec3e3eff"
                                            hoverBg="#ec3e3e18"
                                            onClick={() => onEntryDelete(e.id)}
                                        >
                                            <Icons.TrashFill />
                                        </HoverableIcon>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>

            <Footer />

        </>
    )
}

export default Vault;