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
/*                                Toast system                                */
/* -------------------------------------------------------------------------- */
export type ToastType = "success" | "warning" | "error" | "info";

export type Toast = {
    id: string;
    type: ToastType;
    count?: number;
    message: string;
    duration: number;
    _isSwap?: boolean;
}

export type ToastContextType = {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

/* -------------------------------------------------------------------------- */
/*                                   Modals                                   */
/* -------------------------------------------------------------------------- */

export type ConfirmModal = {
    title: string,
    message: string,
    dangerous?: boolean,
    icon?: keyof typeof Icons
    onCancel: () => void,
    onConfirm: () => void,
}

export type ConfirmModalContextType = {
    modal: ConfirmModal | null,
    openModal: (modal: ConfirmModal) => void,
    closeModal: () => void,
}

/* -------------------------------------------------------------------------- */
/*                                   Stepper                                  */
/* -------------------------------------------------------------------------- */
export type Step = {
    label: string
}

/* -------------------------------------------------------------------------- */
/*                           Vault types and helpers                          */
/* -------------------------------------------------------------------------- */
export type VaultErrorKind = "IO" | "Parse" | "Version" | "Access" | "Auth" | "Crypto" | "NotFound";

export type VaultErrorSeverity = "Soft" | "Blocking" | "Fatal";

export type VaultError = {
    kind: VaultErrorKind,
    severity: VaultErrorSeverity,
    message: string,
    code: string
}

export type VaultResult<T> = Result<T, VaultError>;

export type VaultState = "Uninitialized" | "Locked" | "Unlocked";

export type VaultStatus = {
    state: VaultState,
    ready: boolean,
    last_error: VaultError | null
}

export type VaultStatusContextType = {
    status: VaultStatus | null,
    loading: boolean,
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
/*                               Password types                               */
/* -------------------------------------------------------------------------- */
export type PasswordStrength = "Weak" | "Okay" | "Strong" | "Very strong";

export type PasswordEvaluation = {
    strength: PasswordStrength,
    message?: string
}

/* -------------------------------------------------------------------------- */
/*                          Result type and helpers                           */
/* -------------------------------------------------------------------------- */
export type Result<T, E> = 
    { ok: true, value: T } |
    { ok: false, error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ok: true, value: value});
export const Err = <T>(error: T): Result<never, T> => ({ok: false, error: error});