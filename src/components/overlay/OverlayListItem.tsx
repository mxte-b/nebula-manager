import { openUrl } from "@tauri-apps/plugin-opener";
import { Entry, TagData } from "../../types/general";
import Favicon from "../Favicon";
import Icons from "../Icons";
import { JSX, useEffect, useMemo, useRef } from "react";
import TagPill from "../TagPill";

const OverlayListItem = (
    {
        entry,
        activeId,
        category,
        labelOverride,
        onClick
    }:
    {
        entry: Entry, 
        activeId: {
            key: string;
            id: string;
        } | null,
        category: string,
        labelOverride?: JSX.Element,
        onClick?: () => void
    }
) => {
    const ref = useRef<HTMLDivElement>(null);

    const isActive = useMemo(() => activeId && activeId.id === entry.id && activeId.key == category, [activeId]);

    const getEntryTags = () => {
        const tags: TagData[] = [];

        if (entry.favorite) tags.push({ name: "Favorite", color: "#d3b716", icon: "StarFill" });
        if (entry.uses > 10) tags.push({ name: "Frequent", color: "#d16f13", icon: "Fire" });

        return tags;
    }

    const getEntryClassList = () => {
        const classes = ["overlay-list-item"];

        if (isActive) {
            classes.push("active");
        }

        return classes.join(" ");
    }
    
    useEffect(() => {
        if (!isActive || !ref.current) return;

        const container = ref.current.parentElement;
        if (!container) return;

        // Check if this entry is the first in the list
        const firstItem = container.firstElementChild;
        const isFirst = firstItem === ref.current;

        ref.current.scrollIntoView({
            block: isFirst ? "end" : "nearest",
            behavior: "smooth",
        });

    }, [isActive]);

    return (
        <div
            ref={ref}
            className={getEntryClassList()} 
            onClick={onClick}
        >
            <div className="overlay-list-item-icon">
                <Icons.ArrowUpRight />
                <Favicon label={entry.label} url={entry.url} size={35} onClick={() => openUrl(entry.url)}/>
            </div>
            <div className="overlay-list-item-label">
                { labelOverride ? labelOverride : entry.label }
            </div>
            <div className="overlay-list-item-name">
                { entry.name }
            </div>

            <div className="overlay-list-item-tags">
                {
                    getEntryTags().map(t => <TagPill key={`tag-${t.name.toLowerCase().normalize("NFKC")}`} tag={t.name} color={t.color} icon={t.icon} />)
                }
            </div>
        </div>
    );
};

export default OverlayListItem;