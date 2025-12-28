import { AnimatePresence } from "motion/react";
import { useConfirmModal } from "../contexts/confirmModal";
import ConfirmModalItem from "./ConfirmModaltem";

const ModalManager = () => {
    const { popup } = useConfirmModal();

    return (
        <div className="popups">
            <AnimatePresence>
                { popup && <ConfirmModalItem popup={popup} /> }
            </AnimatePresence>
        </div>
    ) 
}

export default ModalManager;