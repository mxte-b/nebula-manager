import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { JSX, useEffect, useRef, useState } from "react";

const OverlayRenderController = ({children}: {children: JSX.Element}) => {
    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const loadedRef = useRef<boolean>(false);

    useEffect(() => {
        if (loadedRef.current) return;
        
        let unlisten: UnlistenFn | undefined = undefined;

        (async() => {
            unlisten = await listen("vault_ready", () => {
                setShouldRender(true);
                loadedRef.current = true;
            });
        })();

        return () => unlisten?.();
    }, []);
    
    return shouldRender || loadedRef.current ? children : null;
};

export default OverlayRenderController;