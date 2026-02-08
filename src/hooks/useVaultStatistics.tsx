import { useMemo } from "react";
import { Entry, PasswordStrength, VaultStatistics } from "../types/general";

const WEIGHTS: Record<PasswordStrength, number> = {
    Weak: 0,
    Okay: 0.5,
    Strong: 0.9,
    Excellent: 1
};

const SIX_MONTHS = 1000 * 60 * 60 * 24 * 30 * 6;

const useVaultStatistics = (entries: Entry[] | null) => {
    const statistics: VaultStatistics | null = useMemo(() => {
        if (!entries || !entries.length) return null;

        // Definitions of metrics
        let uses = 0, health = 0, olds = 0;

        const strengths: Record<PasswordStrength, number> = {
            Weak: 0,
            Okay: 0,
            Strong: 0,
            Excellent: 0
        };

        // Accumulation
        entries.forEach(e => {
            uses += e.uses;
            health += WEIGHTS[e.passwordStrength];
            strengths[e.passwordStrength]++;

            if (Date.now() - e.modifiedAt.getTime() > SIX_MONTHS) olds++;
        });

        // Averaging
        uses /= entries.length;
        health /= entries.length;

        const distribution: Record<PasswordStrength, number> = {
            Weak: strengths.Weak / entries.length,
            Okay: strengths.Okay / entries.length,
            Strong: strengths.Strong / entries.length,
            Excellent: strengths.Excellent / entries.length
        };

        return {
            numEntries: entries.length,
            averages: {
                entryUses: uses
            },
            security: {
                oldPasswords: olds,
                health: health,
                strengths: strengths,
                distribution: distribution
            }
        } as VaultStatistics
    }, [entries]);

    return { statistics };
};

export default useVaultStatistics;