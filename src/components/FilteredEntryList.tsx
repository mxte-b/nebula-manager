import { useEffect, useMemo, useState } from "react";
import { useVault } from "../contexts/vault";
import Favicon from "./Favicon";
import Tooltip from "./Tooltip";
import HoverableIcon from "./HoverableIcon";
import Icons from "./Icons";
import { useError } from "../contexts/error";
import { AnimatePresence, motion } from "motion/react";
import { Entry } from "../types/general";

const FilteredEntryList = ({ count = 5, filterFunction }: { count?: number, filterFunction: (entries: Entry[] | null, count: number) => Entry[] | undefined }) => {

    const [copiedRecently, setCopiedRecently] = useState<boolean>(false);

    const { entries, copyEntryDetail  } = useVault();
    const { addError } = useError();

    const items = useMemo(() => filterFunction(entries, count), [entries]);

    const handlePasswordCopy = (id: string) => {
        copyEntryDetail(id, "password", 30000, {
            err: addError
        })
    }

    useEffect(() => {
        let t = undefined;

        if (copiedRecently) {
            t = setTimeout(() => setCopiedRecently(false), 5000);
        }

        return () => clearTimeout(t);
    }, [copiedRecently]);

    return (
        <div className="info-grid-list">
            <AnimatePresence>
                { items && items.map(e => 
                    <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "55px" }}
                        exit={{ opacity: 0, height: 0 }}
                        key={e.id}
                        className="info-grid-list-iwrap"
                    >
                        <div className="info-grid-list-item">
                            <Favicon label={e.label} url={e.url} />
                            <div className="item-details">
                                <div className="title" title={e.label}>{e.label}</div>
                                <div className="name" title={e.name}>{e.name}</div>
                            </div>
                            <div className="item-actions">
                                <Tooltip
                                    text={copiedRecently ? "Copied!" : "Copy"}
                                    onExitComplete={() => setCopiedRecently(false)}
                                >
                                    <HoverableIcon
                                        hoverFg="#699dd8ff"
                                        hoverBg="#699dd818"
                                        onClick={() => {
                                            handlePasswordCopy(e.id);
                                            setCopiedRecently(true);
                                        }}
                                    >
                                        <Icons.Copy/>
                                    </HoverableIcon>
                                </Tooltip>
                            </div>
                        </div>
                    </motion.div>) 
                }
            </AnimatePresence>
        </div>
    );
};

export default FilteredEntryList;