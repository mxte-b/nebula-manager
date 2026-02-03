import { Entry } from "../types/general";
import { v4 as uuidv4 } from 'uuid';
import Form from "./form/Form";
import FormGroup from "./form/FormGroup";
import TextInput from "./form/TextInput";
import Icons from "./Icons";
import CloseButton from "./CloseButton";
import Tooltip from "./Tooltip";
import HoverableIcon from "./HoverableIcon";
import passwordUtils from "../utils/passwordUtils";
import normalizeUrl from "../types/normalize-url";

type FormEntryData = {
    label: string,
    url: string,
    name: string,
    password: string
}

const EntryForm = (
    { 
        visible,
        onSubmit,
        onClose

    }: 
    { 
        visible: boolean,
        onSubmit: (entry: Entry) => void,
        onClose: () => void
    }) => {

        const { generatePassword } = passwordUtils();
    
    return (
        <Form<FormEntryData> 
            modal 
            visible={visible}
            onClose={onClose}
            onSubmit={(data) => {
                const now = new Date();

                onSubmit({
                    id: uuidv4(),
                    createdAt: now,
                    modifiedAt: now,
                    lastUsed: null,
                    uses: 0,
                    favorite: false,
                    ...data,
                    url: normalizeUrl(data.url),
                });
            }}
        >
            <div className="form-header">
                <div className="title-icon"><Icons.Key /></div>
                <div className="form-title">New Entry</div>
                <CloseButton onClick={onClose} />
            </div>

            <FormGroup>
                <TextInput icon="Bookmark" label="Label" name="label" placeholder="Label" required />
                <TextInput icon="Globe" label="Website (optional)" name="url" placeholder="Website" />
                <TextInput icon="Person" label="Username" name="name" placeholder="Username" required />
                <TextInput icon="Lock" label="Password" name="password" placeholder="Password" required 
                    actions={(field) =>
                        <>
                            <Tooltip text="Generate">
                                <HoverableIcon
                                    onClick={() => {
                                        field.setValue(generatePassword());
                                    }}
                                    hoverFg="#d3a747ff"
                                    hoverBg="#d3a74718"
                                >
                                    <Icons.Stars />
                                </HoverableIcon>
                            </Tooltip>
                        </>
                    }
                />
            </FormGroup>

            <div className="button-group">
                <button type="button" className="button-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="button-save prominent">Save</button>
            </div>
        </Form>
    )
}

export default EntryForm;