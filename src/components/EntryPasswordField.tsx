import { useState } from "react";
import Icons from "./Icons";
import ToggleableIcon from "./ToggleableIcon";

const EntryPasswordField = ({ password }: { password: string }) => {
    const [passwordShown, setPasswordShown] = useState<boolean>(false);

    return (
        <div className="entry-password">
            <span>
                {
                    passwordShown ? password : <>••••••••••••••••••••</>
                }
            </span>
            <ToggleableIcon 
                defaultElement={<Icons.EyeFill />}
                toggledElement={<Icons.EyeSlashFill />}
                hoverFg="#ffa2eb"
                hoverBg="#ffa2eb25"
                onToggle={setPasswordShown}
            />
        </div>
    )
}

export default EntryPasswordField;