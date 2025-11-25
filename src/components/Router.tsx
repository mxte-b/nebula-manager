import { ReactNode } from "react";
import { useRouter } from "../contexts/router"
import { RouteProps } from "../types/general"

export const Route = ({ 
    path, 
    element
}: RouteProps) => {
    const { currentPage } = useRouter();
    return currentPage == path ? element : null;
}

// Wrapper element, just for hierarchy
export const Router = ({ children } : { children: ReactNode }) => {
    return (
        <>{ children }</>
    )
}