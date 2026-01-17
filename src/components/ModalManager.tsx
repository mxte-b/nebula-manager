import { AnimatePresence } from "motion/react";
import { useModal } from "../contexts/modal";
import ModalItem from "./ModalItem";

const ModalManager = () => {
    const { modal } = useModal();

    return (
        <div className="modals">
            <AnimatePresence>
                { modal && <ModalItem modal={modal} /> }
            </AnimatePresence>
        </div>
    ) 
}

export default ModalManager;