import { Color } from "@tauri-apps/api/webviewWindow";
import { CSSProperties } from "react";
import Icons from "./Icons";

const TagPill = ({tag, color, icon}: {tag: string, color: Color, icon: keyof typeof Icons}) => {
    const Icon = Icons[icon];

    return (
        <div className="tag" style={{ "--tag-color": color } as CSSProperties}>
            <Icon className="tag-icon" />
            <span className="tag-name">{tag}</span>
        </div>
    );
};

export default TagPill;