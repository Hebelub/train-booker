import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { Session } from '@/types/Session';
import { UserIcon, CalendarIcon, ClockIcon, LocationIcon } from '@/utils/icons';
import { convertToHoursAndMinutes, formatDate, formatTime } from '@/utils/utils';

function SessionListItem(props: Session) {
    return (
        <Link href={`/sessions/${props.id}`} passHref className="no-underline hover:no-underline">
            {/* <Card className="bg-transparent border-none"> */}
                <CardHeader>
                    <CardTitle>{props.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <CalendarIcon />
                        <span>{formatDate(props.startTime) + ", " + formatTime(props.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserIcon />
                        <span>{props.instructorName}</span>
                    </div>
                </CardContent>
            {/* </Card> */}
        </Link>
    );
}

export default SessionListItem;
