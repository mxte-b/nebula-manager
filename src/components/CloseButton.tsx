import Icons from "./Icons";

const CloseButton = ({ onClick }: { onClick?: () => void }) => {
    return (
        <button type="button" className="button-close" onClick={onClick}>
            <Icons.X />
        </button>
    )
}

export default CloseButton;