const CircularProgress = ({
    progress,
    size,
    strokeWidth,
    arcAngle = 270,
}: {
    progress: number;
    size: number;
    strokeWidth: number; 
    arcAngle?: number;
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const arcLength = (circumference * arcAngle) / 360;
    const offset = arcLength * (1 - progress / 100);

    const cx = size / 2;
    const cy = size / 2;

    const rotation = -90 - arcAngle / 2;
    const getColor = (p: number) => {
        if (p >= 85) return "#3992ff";
        if (p >= 65) return "#4bd646"; 
        if (p >= 40) return "#ffa72c"; 
        return "#c72e2e";             
    };

    const strokeColor = getColor(progress);

    return (
        <svg width={size} height={size}>
            <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="#ffffff0c"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                transform={`rotate(${rotation} ${cx} ${cy})`}
            />

            <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(${rotation} ${cx} ${cy})`}
                style={{ transition: "stroke-dashoffset 0.3s ease-out, stroke 0.3s ease-out" }}
            />
        </svg>
    );
};

export default CircularProgress;
