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

/* -------------------------------------------------------------------------- */
/*                           Vault types and helpers                          */
/* -------------------------------------------------------------------------- */
export type Entry = {
    label: string,
    name: string,
    password: string
}

/* -------------------------------------------------------------------------- */
/*                          Result type and helpers                           */
/* -------------------------------------------------------------------------- */
export type Result<T, E> = 
    { ok: true, value: T } |
    { ok: false, error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ok: true, value: value});
export const Err = <T>(error: T): Result<never, T> => ({ok: false, error: error});