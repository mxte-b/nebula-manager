import { JSX } from "react";

/* -------------------------------------------------------------------------- */
/*                                   Router                                   */
/* -------------------------------------------------------------------------- */
export type Page = "vault" | "export" | "settings" | "about";

export interface RouteProps {
    path: Page;
    element: JSX.Element;
}

export type RouterContextType = {
    currentPage: Page;
    navigate: (page: Page) => void;
}

/* -------------------------------------------------------------------------- */
/*                                Alert system                                */
/* -------------------------------------------------------------------------- */
export type AlertType = "success" | "warning" | "error";

export type Alert = {
    id: string;
    type: AlertType;
    message: string;
    duration: number;
}

export type AlertContextType = {
    alerts: Alert[];
    addAlert: (alert: Omit<Alert, "id">) => void;
    removeAlert: (id: string) => void;
}

/* -------------------------------------------------------------------------- */
/*                           Vault types and helpers                          */
/* -------------------------------------------------------------------------- */
export type Entry = {
    id: string,
    createdAt: Date,
    modifiedAt: Date,
    lastUsed: Date,
    label: string,
    url: string,
    name: string,
    favorite: boolean
}

export type EntryDTO = {
    id: string,
    createdAt: string,
    modifiedAt: string,
    lastUsed: string,
    label: string,
    url: string,
    name: string,
    favorite: boolean
}

export type UpdateEntry = {
    label?: string,
    url?: string,
    name?: string,
    password?: string
}

export const toEntry = (e: EntryDTO): Entry => ({
    ...e,
    createdAt: new Date(e.createdAt),
    modifiedAt: new Date(e.modifiedAt),
    lastUsed: new Date(e.lastUsed)
});

export const toEntryDTO = (e: Entry): EntryDTO => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    modifiedAt: e.modifiedAt.toISOString(),
    lastUsed: e.lastUsed.toISOString()
});

/* -------------------------------------------------------------------------- */
/*                          Result type and helpers                           */
/* -------------------------------------------------------------------------- */
export type Result<T, E> = 
    { ok: true, value: T } |
    { ok: false, error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ok: true, value: value});
export const Err = <T>(error: T): Result<never, T> => ({ok: false, error: error});