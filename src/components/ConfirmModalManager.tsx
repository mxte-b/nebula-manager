import { AnimatePresence } from "motion/react";
import { useConfirmModal } from "../contexts/confirmModal";
import ConfirmModalItem from "./ConfirmModaltem";

const ModalManager = () => {
    const { modal } = useConfirmModal();

    return (
        <div className="modals">
            <AnimatePresence>
                { modal && <ConfirmModalItem modal={modal} /> }
            </AnimatePresence>
        </div>
    ) 
}

export default ModalManager;