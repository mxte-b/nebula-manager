import { useModal } from "../contexts/modal";
import { Modal } from "../types/general";
import { motion } from "motion/react";
import Icons from "./Icons";
import CloseButton from "./CloseButton";

const ModalItem = ({ modal }: { modal: Modal }) => {

    const { closeModal } = useModal();

    const getIcon = () => {
        if (modal.icon) return Icons[modal.icon];

        if (modal.type == "message") {
            switch (modal.variant) {
                case "info": return Icons.InfoCircle
                case "warning": return Icons.ExclamationTriangle
                case "error": return Icons.ExclamationCircleFill
            }
        }

        return null;
    }

    const getCSSClasses = () => {
        let classList = ["modal", "type-" + modal.type];

        if (modal.type == "confirm" && modal.dangerous) classList.push("dangerous");
        if (modal.type == "message") classList.push(modal.variant);

        return classList.join(" ");
    }

    const getCTAs = () => {
        if (modal.type == "confirm") {
            return <>
                <button type="button" onClick={modal.onCancel}>Cancel</button>
                <button type="button" className={modal.dangerous ? "dangerous" : "prominent"} onClick={() => {
                    modal.onConfirm();
                    closeModal();
                }}>Confirm</button>
            </>
        }
        else if (modal.type == "message") {
            return <button type="button" className={modal.variant} onClick={() => {
                modal.onAcknowledge();
                closeModal();
            }}>Okay</button>
        }
    }

    const Icon = getIcon();

    return (
        <motion.div
            className="modal-wrapper"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onMouseDown={closeModal}
        >
            <motion.div
                className={getCSSClasses()}
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
                    { getCTAs() }
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ModalItem;