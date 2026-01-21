import { useMemo } from "react";
import { useVault } from "../contexts/vault";
import Favicon from "./Favicon";

const RecentlyUsedPasswords = ({ count = 5 }: { count ?: number }) => {
    const { entries } = useVault();

    const getFavorites = () => {
        if (!entries) return;
        
        return entries.sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0)).slice(0, count);
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

export default RecentlyUsedPasswords;