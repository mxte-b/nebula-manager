import ReactDOM from "react-dom/client";
import Overlay from "../src/components/Overlay";
import { VaultProvider } from "../src/contexts/vault";
import { ModalProvider } from "../src/contexts/modal";
import { ToastProvider } from "../src/contexts/toast";
import { ErrorProvider } from "../src/contexts/error";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ModalProvider>
        <ToastProvider>
            <ErrorProvider>
                <VaultProvider>
                    <Overlay />
                </VaultProvider>
            </ErrorProvider>
        </ToastProvider>
    </ModalProvider>
);
