import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { FormContextType, FormField } from "../types/general";

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {

    const [form, setForm] = useState<Record<string, FormField>>({});

    const registerField = (name: string) => setForm(p => ({...p, [name]: {value: "", error: null, touched: false } }));

    const unregisterField = (name: string) => setForm(p => {
        const { [name]: _, ...rest } = p;
        return rest;
    });

    const setValue = (field: string, value: unknown) => setForm(p => ({...p, [field]: {...p[field], value, touched: true } }));

    const setError = (field: string, error: string | null) => setForm(p => ({...p, [field]: {...p[field], error } }));

    return <FormContext.Provider value={{ form: form, registerField, unregisterField, setValue, setError }}>
        {children}
    </FormContext.Provider>
}

export const useForm = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error("useForm must be used inside an FormProvider.");
    return context;
}