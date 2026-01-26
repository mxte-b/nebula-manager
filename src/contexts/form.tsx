import { createContext, ReactNode, useContext, useState } from "react";
import { FormContextType, FormField } from "../types/general";

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {

    const [form, setForm] = useState<Record<string, FormField>>({});

    const registerField = (name: string, defaultValue?: unknown) => setForm(p => ({...p, [name]: {value: (defaultValue ?? "") as string, error: null, touched: false } }));

    const unregisterField = (name: string) => setForm(p => {
        const { [name]: _, ...rest } = p;
        return rest;
    });

    const setValue = (field: string, value: unknown) => setForm(p => ({...p, [field]: {...p[field], value, touched: true } }));

    const setError = (field: string, error: string | null) => setForm(p => ({...p, [field]: {...p[field], error } }));

    const validateFields = () => {
        // Make all errors appear
        setForm(prev => {
            const updated: typeof prev = {};

            for (const [key, field] of Object.entries(prev)) {

                updated[key] = {
                    ...field,
                    touched: true
                };
            }

            return updated;
        });

        return Object.values(form).every(f => f.error === null);
    }

    return <FormContext.Provider value={{ form: form, registerField, unregisterField, setValue, setError, validateFields }}>
        {children}
    </FormContext.Provider>
}

export const useForm = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error("useForm must be used inside an FormProvider.");
    return context;
}

export const useFormFieldValue = (field: string) => {
    const { form } = useForm();

    return (form[field]?.value ?? "") as string;
}