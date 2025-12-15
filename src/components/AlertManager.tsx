import { useAlert } from "../contexts/alert"
import AlertItem from "./AlertItem";

const AlertManager = () => {
    const { alerts, removeAlert } = useAlert();

    return (
        <div className="alerts">
            {
                alerts.map(a => <AlertItem alert={a} onClose={removeAlert} key={a.id} />)
            }
        </div>
    )
}

export default AlertManager;