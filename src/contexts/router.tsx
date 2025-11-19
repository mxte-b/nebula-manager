import { createContext, ReactNode, useContext, useState } from "react";
import { Page, RouterContextType } from "../types/general";

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider = ({ children }: { children: ReactNode}) => {
    const [currentPage, setCurrentPage] = useState<Page>("vault");
    const navigate = (page: Page) => setCurrentPage(page);

    return (
        <RouterContext.Provider value={{ currentPage: currentPage, navigate: navigate }}>
            { children }
        </RouterContext.Provider>
    );
};

export const useRouter = () => {
    const context = useContext(RouterContext);
    if (!context) throw new Error("useRouter must be used inside a RouterProvider.");
    return context;
}