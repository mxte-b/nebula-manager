import { ReactNode } from "react";
import { useRouter } from "../contexts/router"
import { RouteProps } from "../types/general"
import { motion } from "motion/react";

export const Route = ({ 
    path, 
    element
}: RouteProps) => {
    const { currentPage } = useRouter();
    const active = currentPage == path;

    return <motion.section
        className={"content no-scrollbar " + path + (active ? " active" : "")}
        >
            {element}
        </motion.section>
}

// Wrapper element, just for hierarchy
export const Router = ({ children } : { children: ReactNode }) => {
    return (
        <>{ children }</>
    )
}