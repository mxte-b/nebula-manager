import { useEffect, useMemo } from "react";
import { TextInputProps } from "../../types/general";
import { useForm } from "../../contexts/form";
import Icons from "../Icons";

const TextInput = (
    {
        name,
        label, 

        id,
        icon,
        type = "text",
        rules,
        required = false,
        placeholder,
        defaultValue,
        actions,
    }: TextInputProps
) => {
    const { form, setValue, setError, registerField, unregisterField } = useForm();

    const field = useMemo(() => form[name], [form]);
    const Icon = icon && Icons[icon];

    const validate = (value: string) => {
        if (value.length < 1 && required) {
            setError(name, "This field is required");
            return;
        }

        // Check for any errors
        let valid = rules?.every(r => {
            if (!r.regex.test(value)) {
                setError(name, r.errorMessage);
                return false;
            }

            return true;
        }) || true;

        if (valid) setError(name, null);
    }   

    useEffect(() => {
        registerField(name, defaultValue);

        // Initial validation
        const value = (defaultValue ?? "") as string;
        validate(value);

        return () => unregisterField(name);
    }, [name]);

    return (
        field &&
        <div className={"form-input" + (required ? " required" : "")}>
            <label htmlFor={id}>
                { label }
                { required && <span className="star">*</span>}
            </label>
            <div className="form-input-wrapper">
                { Icon && <Icon /> }
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
                        validate(v);
                    }}
                />
                { 
                    actions?.({ setValue: (v) => setValue(name, v) }) 
                }
            </div>
            {
                field.touched && field.error && 
                <div className="form-input-error">
                    {field.error}
                </div>
            }
        </div>  
    );
};

export default TextInput;