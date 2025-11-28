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
    id: string,
    createdAt: Date,
    modifiedAt: Date,
    label: string,
    url: string,
    name: string,
    password: string
}

export type EntryDTO = {
    id: string,
    createdAt: string,
    modifiedAt: string,
    label: string,
    url: string,
    name: string,
    password: string
}

export const toEntry = (e: EntryDTO): Entry => ({
    ...e,
    createdAt: new Date(e.createdAt),
    modifiedAt: new Date(e.modifiedAt)
});

export const toEntryDTO = (e: Entry): EntryDTO => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    modifiedAt: e.modifiedAt.toISOString()
});

/* -------------------------------------------------------------------------- */
/*                          Result type and helpers                           */
/* -------------------------------------------------------------------------- */
export type Result<T, E> = 
    { ok: true, value: T } |
    { ok: false, error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ok: true, value: value});
export const Err = <T>(error: T): Result<never, T> => ({ok: false, error: error});