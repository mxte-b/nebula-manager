import Favicon from "../components/Favicon";
import { Entry } from "../types/general";
import Icons from "../components/Icons";
import EntryPasswordField from "../components/EntryPasswordField";
import ToggleableIcon from "../components/ToggleableIcon";
import Footer from "../components/Footer";
import HoverableIcon from "../components/HoverableIcon";
import Tooltip from "../components/Tooltip";
import { useModal } from "../contexts/modal";

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

    const { openModal, closeModal } = useModal();

    return (
        <>
            <div className="wrapper">
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
                <div>0 toasts</div>
                <h2>All - {entries?.length} entries</h2>
                <table className="entries" cellSpacing={0}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Label</th>
                            <th>Name</th>
                            <th>Password</th>
                            <th className="entry-last-use">Last Used</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        entries &&
                        entries.map(e =>
                            <tr className="entry" key={e.id}>
                                <td className="entry-favorite">
                                    <Tooltip text="Favorite">
                                        <ToggleableIcon
                                            defaultElement={<Icons.Star />}
                                            toggledElement={<Icons.StarFill />}
                                            hoverFg="#d3a747ff"
                                            hoverBg="#d3a74718"
                                            toggled={e.favorite}
                                            onToggle={() => onEntryFavorite(e.id)}
                                        />
                                    </Tooltip>
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
                                                onClick={() => {
                                                    openModal({
                                                        type: "confirm",
                                                        title: "Are you sure?",
                                                        message: "This will permanently delete the entry.",
                                                        dangerous: true,
                                                        icon: "ExclamationTriangle",
                                                        onCancel: closeModal,
                                                        onConfirm: () => onEntryDelete(e.id)
                                                    })
                                                }}
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
            </div>

            <Footer />
        </>
    )
}

export default Vault;