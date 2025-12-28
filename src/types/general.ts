import { JSX } from "react";
import Icons from "../components/Icons";

/* -------------------------------------------------------------------------- */
/*                                    Setup                                   */
/* -------------------------------------------------------------------------- */
export type SetupPhase = "welcome" | "create" | "import" | "done";

export interface PhaseEndpointProps {
    onComplete: () => void,
    back: () => void,
}

export interface RootPhaseProps {
    next: (phase: SetupPhase) => void
}

// PhaseProps has no params for next because we pre-define the routes
export interface PhaseProps {
    next: () => void,
    back: () => void,
}


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
    count?: number;
    message: string;
    duration: number;
    _isSwap?: boolean;
}

export type AlertContextType = {
    alerts: Alert[];
    addAlert: (alert: Omit<Alert, "id">) => void;
    removeAlert: (id: string) => void;
}

/* -------------------------------------------------------------------------- */
/*                                   Popups                                   */
/* -------------------------------------------------------------------------- */

export type ConfirmPopup = {
    title: string,
    message: string,
    dangerous?: boolean,
    icon?: keyof typeof Icons
    onCancel: () => void,
    onConfirm: () => void,
}

export type ConfirmPopupContextType = {
    popup: ConfirmPopup | null,
    openPopup: (popup: ConfirmPopup) => void,
    closePopup: () => void,
}

/* -------------------------------------------------------------------------- */
/*                           Vault types and helpers                          */
/* -------------------------------------------------------------------------- */
export type VaultState = "Uninitialized" | "Loaded";

export type VaultStateContextType = {
    state: VaultState | null,
    loading: boolean,
    error: string | null,
    refreshState: () => void,
}

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