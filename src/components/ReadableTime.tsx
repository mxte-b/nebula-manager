import useReadableTime from "../hooks/useReadableTime";

const ReadableTime = ({ time }: { time: Date | null }) => {
    const timeString = useReadableTime(time);

    return (
        <span>{timeString}</span>
    );
};

export default ReadableTime;