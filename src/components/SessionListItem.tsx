import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Session } from '@/types/Session';
import { UserIcon, CalendarIcon, CheckIcon, ClockIcon, EyeIcon } from '@/utils/icons';
import { formatDate, formatTime } from '@/utils/utils';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { EventStatus } from '@/components/EventStatus'
import { idsOfAttending, isSessionHidden } from '@/utils/sessions';


function SessionListItem(props: Session) {

    const { userId } = useAuth();
    const [isBooked, setIsBooked] = useState(false);

    useEffect(() => {
        if (userId && idsOfAttending(props).includes(userId || "")) {
            setIsBooked(true);
        }
    }, [props, userId]);

    const getDayName = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const dateDisplay = props.repeatMode === 'weekly'
        ? `Every ${getDayName(props.startTime)}`
        : `Once at ${formatDate(props.startTime)}`;

    return (
        <Link href={`/sessions/${props.id}`} passHref className="no-underline hover:no-underline">
            <CardHeader>
                <CardTitle className="flex items-center">
                    {props.name}
                    {isSessionHidden(props) && (
                        <EyeIcon className="w-6 h-6 ml-2" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <span>{dateDisplay}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ClockIcon />
                    {formatTime(props.startTime)} - {formatTime(new Date(props.startTime.getTime() + props.duration * 60000))}
                    <EventStatus startTime={props.startTime} duration={props.duration} />
                </div>
                <div className="flex items-center gap-2">
                    <UserIcon />
                    <span>{props.instructorName}</span>
                </div>
                {isBooked && (
                    <div className="flex items-center gap-2 text-green-500">
                        <CheckIcon />
                        <span>Booked</span>
                    </div>
                )}
            </CardContent>
        </Link>
    );
}

export default SessionListItem;
