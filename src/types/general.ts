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

export type ModalType = "confirm" | "message";

type ModalBase = {
    title: string,
    message: string,
    icon?: keyof typeof Icons
}

type ConfirmModal = {
    type: "confirm",
    dangerous?: boolean;
    onConfirm: () => void,
    onCancel: () => void
}

type MessageModal =  {
    type: "message",
    variant: "info" | "warning" | "error",
    onAcknowledge: () => void
}

export type Modal = ModalBase & (ConfirmModal | MessageModal);

export type ModalContextType = {
    modal: Modal | null,
    openModal: (modal: Modal) => void,
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
export type VaultErrorKind = "IO" | "Parse" | "Version" | "Access" | "Auth" | "Crypto" | "NotFound" | "Internal";

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

export type Entry = {
    id: string,
    createdAt: Date,
    modifiedAt: Date,
    lastUsed: Date | null,
    uses: number,
    label: string,
    url: string,
    name: string,
    favorite: boolean
}

export type EntryDTO = {
    id: string,
    createdAt: string,
    modifiedAt: string,
    lastUsed: string | null,
    uses: number,
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

export type VaultCallbacks<T = void> = {
    ok?: (result: T) => void;
    err?: (error: VaultError) => void;
};

export type VaultContextType = {
    // Status
    status: VaultStatus | null,
    loading: boolean,
    refreshStatus: () => void,

    // Auth
    setupVault: (
        masterPassword: string,
        callbacks?: VaultCallbacks
    ) => Promise<VaultResult<null>>;

    unlockVault: (
        password: string,
        callbacks?: VaultCallbacks
    ) => Promise<VaultResult<null>>;

    // Entries
    entries: Entry[] | null,
    createEntry: (
        entry: Entry,
        callbacks?: VaultCallbacks<Entry[]>
    ) => Promise<VaultResult<Entry[]>>;

    updateEntry: (
        id: string,
        updated: UpdateEntry,
        callbacks?: VaultCallbacks<Entry>
    ) => Promise<VaultResult<Entry>>;

    toggleFavorite: (
        id: string,
        callbacks?: VaultCallbacks
    ) => Promise<VaultResult<null>>;

    deleteEntry: (
        id: string,
        callbacks?: VaultCallbacks
    ) => Promise<VaultResult<null>>;

    getEntryPassword: (
        id: string,
        callbacks?: VaultCallbacks<string>
    ) => Promise<VaultResult<string>>;

    copyEntryDetail: (
        id: string,
        detail: "name" | "password",
        autoClearTime?: number,
        callbacks?: VaultCallbacks
    ) => Promise<VaultResult<null>>;
}

export const toEntry = (e: EntryDTO): Entry => ({
    ...e,
    createdAt: new Date(e.createdAt),
    modifiedAt: new Date(e.modifiedAt),
    lastUsed: e.lastUsed ? new Date(e.lastUsed) : null
});

export const toEntryDTO = (e: Entry): EntryDTO => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    modifiedAt: e.modifiedAt.toISOString(),
    lastUsed: e.lastUsed?.toISOString() || null
});

export type EntryUseResult = {
    lastUse: string,
    uses: number,
}

/* -------------------------------------------------------------------------- */
/*                               Password types                               */
/* -------------------------------------------------------------------------- */
export type PasswordStrength = "Weak" | "Okay" | "Strong" | "Very strong";

export type PasswordEvaluation = {
    strength: PasswordStrength,
    suggestions: string[]
}

/* -------------------------------------------------------------------------- */
/*                          Result type and helpers                           */
/* -------------------------------------------------------------------------- */
export type Result<T, E> = 
    { ok: true, value: T } |
    { ok: false, error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ok: true, value: value});
export const Err = <T>(error: T): Result<never, T> => ({ok: false, error: error});


/* -------------------------------------------------------------------------- */
/*                                 Form types                                 */
/* -------------------------------------------------------------------------- */
export type FormField = {
    value: unknown;
    touched: boolean;
    error: string | null;
}

export type FormContextType = {
    form: Record<string, FormField>;
    registerField: (name: string, defaultValue?: unknown) => void;
    unregisterField: (name: string) => void;
    setValue: (field: string, value: unknown) => void;
    setError: (field: string, error: string | null) => void;
    validateFields: () => boolean;
};

export type InputRule = {
    regex: RegExp;
    errorMessage: string;
}

export type InputActions = {
    setValue: (value: unknown) => void;
}

export type FormEntryData = {
    label: string,
    url: string,
    name: string,
    password: string
}

export type TextInputProps = {
    name: string,
    label: string,
    
    id?: string,
    icon?: keyof typeof Icons
    type?: "text" | "password" | "email" | "tel",
    rules?: InputRule[],
    required?: boolean,
    placeholder?: string,
    defaultValue?: unknown,
    actions?: (actions: InputActions) => React.ReactNode
}
