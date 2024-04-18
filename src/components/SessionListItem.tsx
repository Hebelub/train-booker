import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Session } from '@/types/Session';
import { UserIcon, CalendarIcon, CheckIcon } from '@/utils/icons';
import { formatDate, formatTime } from '@/utils/utils';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { EventStatus } from '@/components/EventStatus'


function SessionListItem(props: Session) {

    const { userId } = useAuth();    
    const [isBooked, setIsBooked] = useState(false);

    useEffect(() => {
        if (userId && props.attendeeIds.includes(userId || "")) {
            setIsBooked(true);
        }
    }, [props.attendeeIds, userId]);

    return (
        <Link href={`/sessions/${props.id}`} passHref className="no-underline hover:no-underline">
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <span>{formatDate(props.startTime) + ", " + formatTime(props.startTime)} <EventStatus startTime={props.startTime} duration={props.duration} /></span>
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
