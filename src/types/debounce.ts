const debounce = <T extends (...args: any[]) => void>(fn: T, debounce: number) => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    const debounced = (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), debounce);
    }

    debounced.cancel = () => clearTimeout(timeoutId);

    return debounced;
}

export default debounce;