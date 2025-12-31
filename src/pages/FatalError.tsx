import { VaultError } from "../types/general";

const FatalError = ({ error }: { error: VaultError }) => {
    return (
        <div>FatalError: {JSON.stringify(error)}</div>
    )
}

export default FatalError;