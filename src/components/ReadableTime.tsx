import useReadableTime from "../hooks/useReadableTime";

const ReadableTime = ({ time }: { time: Date }) => {
    const timeString = useReadableTime(time);

    return (
        <span>{timeString}</span>
    );
};

export default ReadableTime;