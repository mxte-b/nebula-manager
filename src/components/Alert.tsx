const Alert = (
{
    type, 
    message, 
    id
}
:{
    type: "success" | "warning" | "error",
    message: string,
    id: string
}
) => {
    return (
        <div className={`alert alert-${type}`} id={id}>
            {message}
        </div>
    )
}

export default Alert;