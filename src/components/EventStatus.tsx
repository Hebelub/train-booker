type EventStatusProps = {
    startTime: Date;
    duration: number;
};

export const EventStatus: React.FC<EventStatusProps> = ({ startTime, duration }) => {
    // Implement the logic to determine the status
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    // Event is in the future
    if (now < start) {
        return null;
    }

    // Event is in the past
    if (now > end) {
        return (
            <div className={`text-red-500 flex items-center gap-2`}>
                <span>{"Passed"}</span>
            </div>
        )
    }

    // Event is ongoing
    else {
        return (
            <div className={`text-yellow-500 flex items-center gap-2`}>
                <span>{"Ongoing"}</span>
            </div>
        )
    }
};
