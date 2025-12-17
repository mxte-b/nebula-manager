import { AnimatePresence } from "motion/react";
import { useAlert } from "../contexts/alert"
import AlertItem from "./AlertItem";

const AlertManager = () => {
    const { alerts, removeAlert } = useAlert();

    return (
        <div className="alerts">
            <AnimatePresence>
                {
                    alerts.map(a => <AlertItem alert={a} onClose={removeAlert} key={a.id} />)
                }
            </AnimatePresence>
        </div>
    )
}

export default AlertManager;