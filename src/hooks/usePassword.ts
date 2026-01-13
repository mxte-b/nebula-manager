import { COMMON_PASSWORDS } from "../types/common-passwords";
import { PasswordEvaluation, PasswordStrength } from "../types/general"

const COMMONS = new Set(COMMON_PASSWORDS);
const MESSAGES: Record<PasswordStrength, string> = {
    "Weak": "This password is too weak",
    "Okay": "This password is okay",
    "Strong": "This password is strong",
    "Very strong": "This password is very strong",
};

const MAX_ENTROPY = 80; 

const PENALTY_WEIGHTS = {
    CLASS: 0.2,
    LENGTH: 0.2,
}

const MAX_PENALTIES = {
    CLASS: 0.3,
    LENGTH: 0.3,
}

const usePassword = () => {

    const normalizePassword = (password: string): string => {
        return password.normalize("NFKC").toLowerCase().trim();
    }

    const scoreToStrength = (score: number): PasswordStrength => {
        if (score < 0.4) return "Weak";
        else if (score < 0.6) return "Okay";
        else if (score < 0.8) return "Strong";
        else return "Very strong";
    }

    const getSymbolCount = (password: string): number => {
        let symbols = 0;

        if (/[a-z]/.test(password)) symbols += 26;
        if (/[A-Z]/.test(password)) symbols += 26;
        if (/[0-9]/.test(password)) symbols += 10;
        if (/[^a-zA-Z0-9]/.test(password)) symbols += 33;

        return symbols;
    }
    
    const getUniqueSymbols = (password: string) => new Set(Array.from(password)).size;

    const getEntropy = (password: string): number => {
        let uniqueSymbols = getUniqueSymbols(password);
        let classSpace = getSymbolCount(password);

        let symbolSpace = Math.min(classSpace, uniqueSymbols * 4);

        if (symbolSpace === 0) return 0;
        
        return Array.from(password).length * Math.log2(symbolSpace);
    }

    const getStrength = (password: string) : PasswordStrength => {
        let score = 0;

        // Check if the password is empty or among the most common 1k
        if (password.length == 0 || COMMONS.has(normalizePassword(password))) {
            score = 0;
        }
        else {
            // Calculate entropy
            const normalizedEntropy = Math.min(1, getEntropy(password) / MAX_ENTROPY);

            // Apply penalties
            const symbolClassPenalty = Math.min(MAX_PENALTIES.CLASS, PENALTY_WEIGHTS.CLASS * (1 - getSymbolCount(password) / 95));
            const lengthPenalty = Math.min(MAX_PENALTIES.LENGTH, PENALTY_WEIGHTS.LENGTH * Math.pow(2, -password.length / 10));

            score = Math.min(1, Math.max(0, normalizedEntropy - symbolClassPenalty - lengthPenalty));
            console.log(score, symbolClassPenalty, lengthPenalty, normalizedEntropy)
        }


        return scoreToStrength(score);
    }

    const evaluatePassword = (password: string): PasswordEvaluation => {
        const strength = getStrength(password);
        const message = MESSAGES[strength];

        return { strength: strength, message: message };
    }

    const generatePassword = () => {

    }

    return {
        evaluatePassword,
        generatePassword
    }
}

export default usePassword;