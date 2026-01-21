import { useMemo } from "react";
import { useVault } from "../contexts/vault";
import Favicon from "./Favicon";

const FavoritePasswords = ({ count = 5 }: { count ?: number }) => {
    const { entries } = useVault();

    const getFavorites = () => {
        if (!entries) return;

        return entries.filter(e => e.favorite).sort((a, b) => b.uses - a.uses).slice(0, count);
    }
    
    const favorites = useMemo(getFavorites, [entries]);

    return (
        <div className="favorites-list">
            { favorites && favorites.map(e => 
                <>
                    <Favicon label={e.label} url={e.url} />
                    <span title={e.label}>{e.label}</span>
                </>) 
            }
        </div>
    );
};

export default FavoritePasswords;