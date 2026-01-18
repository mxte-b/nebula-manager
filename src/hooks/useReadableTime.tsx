import { useEffect, useRef, useState } from "react"
import { timeSinceDate } from "../types/readabletime";

const useReadableTime = (time: Date) => {
    const [timeString, setTimeString] = useState<string>("");
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        };

        setTimeString(timeSinceDate(time))

        intervalRef.current = setInterval(() => {
            setTimeString(timeSinceDate(time))
        }, 60000);

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
    }, [time]);

    return timeString;
}

export default useReadableTime;