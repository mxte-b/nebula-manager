import { JSX } from "react";

export type Page = "vault" | "export" | "settings" | "about";

export interface RouteProps {
    path: Page;
    element: JSX.Element
}

export type RouterContextType = {
    currentPage: Page;
    navigate: (page: Page) => void;
}