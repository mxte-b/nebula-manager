import { ReactNode } from "react";
import { useForm } from "../contexts/form";

const Form = <T extends Record<string, unknown>,>(
    {
        modal = false,
        onSubmit,
        children
    }:
    {
        modal?: boolean,
        onSubmit: (data: T) => void,
        children?: ReactNode
    }
) => {

    const { form } = useForm();

    const handleSubmit = () => {
        const isValid = Object.values(form).every(f => f.error === null);
        if (!isValid) return;

        // Record -> key-value pair
        const data = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.value])) as T;

        onSubmit(data);
    }

    return (
        <form 
            className={"form" + (modal ? " modal": "")} 
            autoComplete="off"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            { children }
        </form>
    );
};

export default Form;