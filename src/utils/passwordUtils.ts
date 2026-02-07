import { COMMON_PASSWORDS } from "../types/common-passwords";
import { PasswordEvaluation, PasswordStrength } from "../types/general"

const COMMONS = new Set(COMMON_PASSWORDS);

const MAX_ENTROPY = 80; 

const PENALTY_WEIGHTS = {
    CLASS: 0.7,
    LENGTH: 0.2,
}

const MAX_PENALTIES = {
    CLASS: 0.6,
    LENGTH: 0.3,
}

const passwordUtils = () => {

    const normalizePassword = (password: string): string => {
        return password.normalize("NFKC").toLowerCase().trim();
    }

    const scoreToStrength = (score: number): PasswordStrength => {
        if (score < 0.4) return "Weak";
        else if (score < 0.6) return "Okay";
        else if (score < 0.8) return "Strong";
        else return "Excellent";
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

    const evaluatePassword = (password: string): PasswordEvaluation => {
        let score = 0;
        const suggestions: string[] = [];

        // Check if the password is empty
        if (password.length == 0) {
            score = 0;
        }
        // Check if it is among the most common 1k
        else if (COMMONS.has(normalizePassword(password))) {
            score = 0;
            suggestions.push("This password is compromised, consider choosing another")
        }
        else {
            // Calculate entropy
            const normalizedEntropy = Math.min(1, getEntropy(password) / MAX_ENTROPY);
            if (normalizedEntropy < 0.6) {
                suggestions.push("Increase character variety")
            }

            // Apply penalties
            const symbolClassPenalty = Math.min(MAX_PENALTIES.CLASS, PENALTY_WEIGHTS.CLASS * (1 - getSymbolCount(password) / 95));
            if (symbolClassPenalty > 0.1) {
                suggestions.push("Add more character types (e.g. digits, special characters)")
            }

            const lengthPenalty = Math.min(MAX_PENALTIES.LENGTH, PENALTY_WEIGHTS.LENGTH * (password.length < 8 ? 1 : 0));

            if (lengthPenalty > 0.1) {
                suggestions.push("Consider making your password longer")
            }

            score = Math.min(1, Math.max(0, normalizedEntropy - symbolClassPenalty - lengthPenalty));
        }

        const strength = scoreToStrength(score);

        if (score > 0.8) suggestions.splice(0, suggestions.length);

        return { strength: strength, suggestions: suggestions };
    }

    const generatePassword = (length: number = 16): string => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        const indicies = new Uint32Array(length);
        crypto.getRandomValues(indicies);
        
        let password = "";

        indicies.forEach(c => password += chars[c % chars.length]);

        return password;
    }

    return {
        evaluatePassword,
        generatePassword
    }
}

export default passwordUtils;