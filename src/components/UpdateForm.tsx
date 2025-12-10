import { FormEvent, useState } from "react";
import { Entry, UpdateEntry } from "../types/general";
import { AnimatePresence, motion } from "motion/react";
import Icons from "./Icons";

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

    const [updated, setUpdated] = useState<UpdateEntry>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!entry) return;

        onSubmit(entry.id, updated);
    };

    return (
        <AnimatePresence>
            {visible && entry && (
                <motion.div
                    className="entry-form-wrapper"
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    onMouseDown={onClose}
                >
                    <motion.form
                        className="entry-form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut"
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="form-header">
                            <div className="title-icon"><Icons.Key /></div>
                            <div className="form-title">Edit Entry</div>
                            <button type="button" className="form-close" onClick={onClose}>
                                <Icons.X />
                            </button>
                        </div>

                        <div className="form-group">
                            <div className="group-label">Label</div>
                            <div className="group-input">
                                <Icons.Bookmark />
                                <input
                                    autoComplete="off"
                                    type="text"
                                    id="label"
                                    defaultValue={entry.label}
                                    onChange={(e) =>
                                        setUpdated(prev => ({ ...prev, label: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="group-label">Website</div>
                            <div className="group-input">
                                <Icons.Globe />
                                <input
                                    autoComplete="off"
                                    type="text"
                                    id="website"
                                    defaultValue={entry.url}
                                    onChange={(e) =>
                                        setUpdated(prev => ({ ...prev, url: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="group-label">Username</div>
                            <div className="group-input">
                                <Icons.Person />
                                <input
                                    autoComplete="off"
                                    type="text"
                                    id="username"
                                    defaultValue={entry.name}
                                    onChange={(e) =>
                                        setUpdated(prev => ({ ...prev, name: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="group-label">Password</div>
                            <div className="group-input">
                                <Icons.Lock />
                                <input
                                    autoComplete="off"
                                    type="text"
                                    id="password"
                                    onChange={(e) =>
                                        setUpdated(prev => ({ ...prev, password: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="button-cancel"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="button-save prominent"
                            >
                                Save
                            </button>
                        </div>

                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateForm;
