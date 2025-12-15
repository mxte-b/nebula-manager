import { useEffect } from "react";
import { Alert } from "../types/general";

const AlertItem = (
{
    alert,
    onClose
}
:{
    alert: Alert,
    onClose: (id: string) => void
}
) => {
    useEffect(() => {
        console.log("Adding close to alert " + alert.id)
        setTimeout(() => onClose(alert.id), alert.duration);
    }, []);

    return (
        <div className={`alert alert-${alert.type}`} id={alert.id}>
            {alert.message}
        </div>
    )
}

export default AlertItem;