import { AnimatePresence } from "motion/react";
import { useConfirmPopup } from "../contexts/confirmPopup";
import ConfirmPopupItem from "./ConfirmPopupItem";

const PopupManager = () => {
    const { popup } = useConfirmPopup();

    return (
        <div className="popups">
            <AnimatePresence>
                { popup && <ConfirmPopupItem popup={popup} /> }
            </AnimatePresence>
        </div>
    ) 
}

export default PopupManager;