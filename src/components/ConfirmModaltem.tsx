import { useConfirmModal } from "../contexts/confirmModal";
import { ConfirmModal } from "../types/general";
import { motion } from "motion/react";
import Icons from "./Icons";
import CloseButton from "./CloseButton";

const ConfirmModalItem = ({ modal }: { modal: ConfirmModal }) => {

    const { closeModal } = useConfirmModal();
    const Icon = modal.icon ? Icons[modal.icon] : null;

    return (
        <motion.div
            className="modal-wrapper"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onMouseDown={closeModal}
        >
            <motion.div
                className={"confirm-modal" + (modal.dangerous ? " dangerous" : "")}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                    duration: 0.2,
                    ease: "easeInOut"
                }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <div className="title-icon">
                        {
                            Icon && <Icon />
                        }
                    </div>
                    <div className="modal-title">{modal.title}</div>
                    <CloseButton onClick={closeModal} />
                </div>
                <div className="modal-message">
                    {modal.message}
                </div>
                <div className="button-group">
                    <button type="button" onClick={modal.onCancel}>Cancel</button>
                    <button type="button" className="dangerous" onClick={() => {
                        modal.onConfirm();
                        closeModal();
                    }}>Confirm</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ConfirmModalItem;