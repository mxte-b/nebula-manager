type Interval = {
    ms: number,
    prefix?: string,
    postfix: string,
}

const INTERVALS: Interval[] = [
  { ms: 1000, postfix: "second" },
  { ms: 60 * 1000, postfix: "minute" },
  { ms: 60 * 60 * 1000, postfix: "hour", prefix: "an" },
  { ms: 24 * 60 * 60 * 1000, postfix: "day" },
  { ms: 7 * 24 * 60 * 60 * 1000, postfix: "week" },
  { ms: 30 * 24 * 60 * 60 * 1000, postfix: "month" },
  { ms: 365 * 24 * 60 * 60 * 1000, postfix: "year" }
];

export const timeSinceDate = (t: Date, includeSeconds: boolean = false): string => {
    const now = new Date();
    const elapsed = Math.abs(now.getTime() - t.getTime());

    if (includeSeconds && elapsed < 1000) return "just now"; 

    for (let i = INTERVALS.length - 1; i >= (includeSeconds ? 0 : 1); i--) {
        const interval = INTERVALS[i];
        
        if (elapsed >= interval.ms) {
            const count = Math.floor(elapsed / interval.ms);

            return `${count == 1 ? interval.prefix || "a" : count} ${interval.postfix}${count == 1 ? "" : "s"} ago`
        }
    }

    return "just now";
}