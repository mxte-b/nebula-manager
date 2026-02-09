import { motion } from "motion/react";

const VaultIntro = ({ onAddButtonClicked }: { onAddButtonClicked: () => void }) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="wrapper vault-intro"
        >
            <motion.div layout className="vault-intro__content">
                <header className="vault-intro__header">
                    <h1 className="vault-intro__title">
                        Welcome to your Vault!
                    </h1>
                    <div className="vault-intro__group">
                        <p className="vault-intro__text">
                            This is your safehouse for storing passwords and login details.
                        </p>
                        <p className="vault-intro__text">
                            Click the button below to create your first password, which will unlock the main interface.
                        </p>
                    </div>
                </header>
                <button onClick={onAddButtonClicked} className="button-continue vault-intro__button">
                    Add First Password
                </button>
            </motion.div>
        </motion.div>
    );
};

export default VaultIntro;