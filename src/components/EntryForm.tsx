import { FormEvent } from "react";
import { Entry } from "../types/general";
import { AnimatePresence, motion } from "motion/react"
import { v4 as uuidv4 } from 'uuid';
import Icons from "./Icons";

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

    const getEntryValue: () => Entry = () => {
        const now = new Date();
        return {
            id: uuidv4(),
            createdAt: now,
            modifiedAt: now,
            lastUsed: now,
            favorite: false,
            label: (document.getElementById("label") as HTMLInputElement).value,
            url: (document.getElementById("website") as HTMLInputElement).value,
            name: (document.getElementById("username") as HTMLInputElement).value,
            password: (document.getElementById("password") as HTMLInputElement).value,
        };
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(getEntryValue());
    }

    return (
        <>
            <AnimatePresence>
                {visible && (
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
                                <div className="form-title">
                                    New Password
                                </div>
                                <button type="button" className="form-close" onClick={onClose}>
                                    <Icons.X />
                                </button>
                            </div>

                            <div className="form-group">
                                <div className="group-label">Label</div>
                                <div className="group-input">
                                    <Icons.Bookmark />
                                    <input autoComplete="off" required type="text" name="label" id="label" placeholder=""/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="group-label">Website (optional)</div>
                                <div className="group-input">
                                    <Icons.Globe />
                                    <input autoComplete="off" required type="text" name="website" id="website" placeholder=""/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="group-label">Username</div>
                                <div className="group-input">
                                    <Icons.Person />
                                    <input autoComplete="off" required type="text" name="username" id="username" placeholder=""/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="group-label">Password</div>
                                <div className="group-input">
                                    <Icons.Lock />
                                    <input autoComplete="off" required type="text" name="password" id="password" placeholder=""/>
                                </div>
                            </div>

                            <div className="button-group">
                                <button type="button" className="button-cancel" onClick={onClose}>Cancel</button>
                                <button type="submit" className="button-save prominent" onClick={handleSubmit}>Save</button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default EntryForm;