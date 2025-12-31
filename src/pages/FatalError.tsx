import { VaultError } from "../types/general";

const FatalError = ({ error }: { error: VaultError | undefined }) => {
    return (
        <div>FatalError: {JSON.stringify(error)}</div>
    )
}

export default FatalError;