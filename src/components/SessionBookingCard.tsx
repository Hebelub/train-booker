import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { Session } from '@/types/Session';
import { UserIcon, ClockIcon, LocationIcon } from '@/utils/icons';

function convertToHoursAndMinutes(number: number) {
    const hours = Math.floor(number); // Gets the whole hour part
    const minutes = Math.round((number - hours) * 60); // Converts the fractional part to minutes
    let result = "";

    // Append hours to the result string if more than 0
    if (hours > 0) {
        result += `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    // Append minutes to the result string if more than 0, with handling for when hours are also present
    if (minutes > 0) {
        if (result.length > 0) {
            result += " ";
        }
        result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return result || "0 minutes"; // Return "0 minutes" if the input was 0 or something that rounds down to 0
}

function SessionBookingCard(props: Session) {
    const formattedStartTime = props.startTime.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <Link href={`/sessions/${props.id}`} passHref className="no-underline hover:no-underline">
            <Card>
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <span>{formattedStartTime}</span>
                    </CardDescription>
                    <CardTitle>{props.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <UserIcon />
                        <span>{props.instructorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ClockIcon />
                        <span>{convertToHoursAndMinutes(props.duration)}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default SessionBookingCard;
