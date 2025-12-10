const Alert = (
{
    type, 
    message, 
    id,
    duration = 5
}
:{
    type: "success" | "warning" | "error",
    message: string,
    id: string,
    duration?: number
}
) => {
    return (
        <div className={`alert alert-${type}`} id={id}>
            {message}
        </div>
    )
}

export default Alert;