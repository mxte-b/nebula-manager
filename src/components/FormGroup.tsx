import { ReactNode } from "react";

const FormGroup = (
    {
        children
    }:
    {
        children?: ReactNode
    }
) => {
    return (
        <div className="form-group">
            { children }
        </div>
    );
};

export default FormGroup;