import { useConfirmModal } from "../contexts/confirmModal";
import { ConfirmModal } from "../types/general";
import { motion } from "motion/react";
import Icons from "./Icons";
import CloseButton from "./CloseButton";

const ConfirmModalItem = ({ popup }: { popup: ConfirmModal }) => {

    const { closePopup } = useConfirmModal();
    const Icon = popup.icon ? Icons[popup.icon] : null;

    return (
        <motion.div
            className="popup-wrapper"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onMouseDown={closePopup}
        >
            <motion.div
                className={"confirm-popup" + (popup.dangerous ? " dangerous" : "")}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                    duration: 0.2,
                    ease: "easeInOut"
                }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="popup-header">
                    <div className="title-icon">
                        {
                            Icon && <Icon />
                        }
                    </div>
                    <div className="popup-title">{popup.title}</div>
                    <CloseButton onClick={closePopup} />
                </div>
                <div className="popup-message">
                    {popup.message}
                </div>
                <div className="button-group">
                    <button type="button" onClick={popup.onCancel}>Cancel</button>
                    <button type="button" className="dangerous" onClick={() => {
                        popup.onConfirm();
                        closePopup();
                    }}>Confirm</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ConfirmModalItem;