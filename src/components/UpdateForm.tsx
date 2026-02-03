import { Entry, UpdateEntry } from "../types/general";
import normalizeUrl from "../types/normalize-url";
import passwordUtils from "../utils/passwordUtils";
import CloseButton from "./CloseButton";
import Form from "./form/Form";
import FormGroup from "./form/FormGroup";
import TextInput from "./form/TextInput";
import HoverableIcon from "./HoverableIcon";
import Icons from "./Icons";
import Tooltip from "./Tooltip";

const UpdateForm = ({
    entry,
    visible,
    onSubmit,
    onClose
}: {
    entry: Entry | undefined;
    visible: boolean;
    onSubmit: (id: string, entry: UpdateEntry) => void;
    onClose: () => void;
}) => {

    const { generatePassword } = passwordUtils();

    if (!entry) return null;

    return (
        <Form<UpdateEntry>
            modal
            visible={visible}
            onClose={onClose}
            onSubmit={(data) => {
                onSubmit(entry.id, {
                    ...data,
                    ...(data.url && { url: normalizeUrl(data.url) }),
                });
            }}
        >
            <div className="form-header">
                <div className="title-icon"><Icons.Key /></div>
                <div className="form-title">Edit Entry</div>
                <CloseButton onClick={onClose} />
            </div>

            <FormGroup>
                <TextInput label="Label" icon="Bookmark" name="label" placeholder="Label" defaultValue={entry.label} />
                <TextInput label="Website (optional)" icon="Globe" name="url" placeholder="Website" defaultValue={entry.url} />
                <TextInput label="Username" icon="Person" name="name" placeholder="Username" defaultValue={entry.name} />
                <TextInput label="Password" icon="Lock" name="password" placeholder="Password" 
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

export default UpdateForm;
