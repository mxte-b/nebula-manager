import { HTMLInputTypeAttribute, ReactNode, useEffect, useMemo } from "react";
import { InputActions, InputRule } from "../types/general";
import { useForm } from "../contexts/form";

const Input = (
    {
        name,
        id,
        actions,
        type = "text",
        rules,
        placeholder,
        required = false,
    }:
    {
        name: string,
        
        id?: string,
        actions?: (actions: InputActions) => ReactNode
        type?: HTMLInputTypeAttribute,
        rules?: InputRule[],
        placeholder?: string,
        required?: boolean,
    }
) => {
    const { form, setValue, setError, registerField, unregisterField } = useForm();

    const field = useMemo(() => form[name], [form]);

    useEffect(() => {
        registerField(name);
        return () => unregisterField(name);
    }, [name]);

    return (
        field &&
        <div className={"form-input" + (required ? "required" : "")}>
            <label htmlFor="password">
                Password
                { required && <span className="star">*</span>}
            </label>
            <div className="form-input-wrapper">
                <input
                    autoComplete="off"
                    placeholder={placeholder}
                    type={type}
                    name={name}
                    id={id}
                    value={field.value as string}
                    onChange={(e) => {
                        const v = e.target.value;
                        setValue(name, v);

                        if (v.length < 1) {
                            setError(name, "This field is required");
                            return;
                        }

                        // Check for any errors
                        let valid = rules?.every(r => {
                            if (!r.regex.test(v)) {
                                setError(name, r.errorMessage);
                                return false;
                            }

                            return true;
                        });

                        if (valid) setError(name, null);
                    }}
                />
                { 
                    actions?.({ setValue: (v) => setValue(name, v) }) 
                }
            </div>
            {
                field.error && 
                <div className="form-input-error">
                    {field.error}
                </div>
            }
        </div>  
    );
};

export default Input;