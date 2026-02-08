import { motion } from "framer-motion"; 

const CharacterColumn = ({ character }: { character: string }) => {
    return (
        <motion.div
            layout 
            className="ticker-column char-column"
            initial={{ opacity: 0, width: 0,}}
            animate={{ opacity: 1, width: "var(--ticker-colwidth)" }}
            exit={{ opacity:0, width: 0 }}
        >
            {
                <motion.span 
                    key={character}
                    className="ticker-digit" 
                >
                    {character}
                </motion.span>
            }
        </motion.div>
    )
}

export default CharacterColumn;