import { COMMON_PASSWORDS } from "../types/common-passwords";
import { PasswordEvaluation, PasswordStrength } from "../types/general"

const COMMONS = new Set(COMMON_PASSWORDS);
const MESSGAGES: Record<PasswordStrength, string> = {
    "Weak": "This password is too weak",
    "Okay": "This password is okay",
    "Strong": "This password is strong",
    "Very strong": "This password is very strong",
};

const MAX_ENTROPY = 60; 
const MAX_PENALTIES = {
    CLASS: 0.5,
    LENGTH: 1,
    DIVERSITY: 0.8,
}

const usePassword = () => {

    const normalizePassword = (password: string): string => {
        return password.toLowerCase().trim();
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
        if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~]/.test(password)) symbols += 33;

        return symbols;
    }
    
    const getUniqueSymbols = (password: string): number => {
        return new Set(password).size;
    }

    const getEntropy = (password: string): number => {
        let symbols = getSymbolCount(password);

        if (symbols === 0) return 0;
        
        return password.length * Math.log2(symbols);
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
            const symbolClassPenalty = MAX_PENALTIES.CLASS * (1 - getSymbolCount(password) / 95);
            const lengthPenalty = MAX_PENALTIES.LENGTH * Math.pow(2, -password.length / 4);
            const diversityPenalty = MAX_PENALTIES.DIVERSITY * (1 - getUniqueSymbols(password) / password.length);

            score = Math.min(1, Math.max(0, normalizedEntropy - symbolClassPenalty - lengthPenalty - diversityPenalty));
        }

        return scoreToStrength(score);
    }

    const evaluatePassword = (password: string): PasswordEvaluation => {
        const strength = getStrength(password);
        const message = MESSGAGES[strength];

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