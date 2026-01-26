import { ReactNode } from "react";
import { FormProvider, useForm } from "../../contexts/form";
import { AnimatePresence, motion } from "motion/react";

type FormProps<T extends Record<string, unknown>> = {
    onSubmit: (data: T) => void;
    modal?: false,
    children?: ReactNode;
} | {
    onSubmit: (data: T) => void;
    modal: true,
    visible: boolean,
    onClose?: () => void,
    children?: ReactNode;
}

const FormInner = <T extends Record<string, unknown>,>(props: FormProps<T>) => {
    const { form, validateFields } = useForm();

    const handleSubmit = () => {
        const isValid = validateFields();
        if (!isValid) return;

        // Record -> key-value pair
        const data = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.value])) as T;

        props.onSubmit(data);
    }

    if (props.modal) {
        return <motion.form 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
                duration: 0.2,
                ease: "easeInOut"
            }}
            className={"form style-modal tooltip-boundary"} 
            autoComplete="off"
            onMouseDown={e => e.stopPropagation()}
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            { props.children }
        </motion.form>
    }

    return (
        <form 
            className="form" 
            autoComplete="off"
            onMouseDown={e => e.stopPropagation()}
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                
            }}
        >
            { props.children }
        </form>
    );
}

const Form = <T extends Record<string, unknown>,>(props: FormProps<T>) => {

    if (props.modal) {
        return (
            <FormProvider>
                <AnimatePresence>
                    {
                        props.visible && 

                        <motion.div 
                            className="form-wrapper"
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            onMouseDown={props.onClose}
                        >
                            <FormInner {...props} />
                        </motion.div>
                    }
                    
                </AnimatePresence>
            </FormProvider>
        )
    }

    return (
        <FormProvider>
            <FormInner {...props} />
        </FormProvider>
    );
};

export default Form;