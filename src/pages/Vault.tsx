import Favicon from "../components/Favicon";
import Icons from "../components/Icons";
import EntryPasswordField from "../components/EntryPasswordField";
import ToggleableIcon from "../components/ToggleableIcon";
import Footer from "../components/Footer";
import HoverableIcon from "../components/HoverableIcon";
import Tooltip from "../components/Tooltip";
import { useModal } from "../contexts/modal";
import ReadableTime from "../components/ReadableTime";
import FavoritePasswords from "../components/FavoritePasswords";
import RecentlyUsedPasswords from "../components/RecentlyUsedPasswords";
import { AnimatePresence, motion } from "motion/react";
import { useVault } from "../contexts/vault";

const Vault = (
    { 
        onEntryDelete,
        onEntryUpdate,
        onEntryFavorite,
    }: { 
        onEntryDelete: (id: string) => void,
        onEntryUpdate: (id: string) => void,
        onEntryFavorite: (id: string) => void,
    }
) => {

    const { openModal, closeModal } = useModal();

    const { entries } = useVault();

    return (
        <>
            <div className="wrapper">

                <h1>My passwords</h1>

                <div className="info-grid">
                    <div className="favorites">
                        <h2>Favorites</h2>
                        <FavoritePasswords />
                    </div>
                    <div className="recents">
                        <h2>Recently used</h2>
                        <RecentlyUsedPasswords />
                    </div>
                </div>
                <h2>Security overview</h2>
                <div>0 toasts</div>
                <h2>All - {entries?.length} entries</h2>

                <div className="table">
                    <div className="table-row headers" role="row">
                        <div className="table-header favorite" role="cell"></div>
                        <div className="table-header label" role="cell">Label</div>
                        <div className="table-header name" role="cell">Name</div>
                        <div className="table-header password" role="cell">Password</div>
                        <div className="table-header last-use" role="cell">Last Used</div>
                        <div className="table-header actions" role="cell"></div>
                    </div>
                    <div className="table-body">
                        <AnimatePresence>
                        {
                            entries &&
                            entries.sort((a, b) => a.label.localeCompare(b.label)).map(e =>
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "55px" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="table-row entry" 
                                    role="row"
                                    key={e.id}
                                >
                                    <div className="table-col favorite" role="cell">
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
                                    </div>

                                    <div className="table-col label" role="cell">
                                        <div className="entry-label">
                                            <Favicon label={e.label} url={e.url} />
                                            <span title={e.label}>{e.label}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="table-col name" role="cell">
                                        <span title={e.name}>{e.name}</span>
                                    </div>

                                    <div className="table-col password" role="cell">
                                        <EntryPasswordField id={e.id} />
                                    </div>

                                    <div className="table-col last-use" role="cell">
                                        <ReadableTime time={e.lastUsed} />
                                    </div>

                                    <div className="table-col actions" role="cell">
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
                                    </div>
                                </motion.div>
                            )
                        }
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Vault;