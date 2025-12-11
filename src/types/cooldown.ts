const cooldown = <T extends (...args: any[]) => void>(fn: T, cooldown: number) => {
    let last: number | null = null;
    
    return (...args: Parameters<T>) => {
        const now = performance.now();
        
        if (!last || now - last > cooldown) {
            fn(...args);
            last = now;
        }

        return;
    }
}

export default cooldown