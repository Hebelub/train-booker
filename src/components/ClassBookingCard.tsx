import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

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

interface ClassBookingCardProps {
    id: string;
    startTime: Date;
    duration: number;
    name: string;
    description: string;
    location: string;
    instructorName: string;
}

function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
    )
}

function ClockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clipRule="evenodd" />
        </svg>
    )
}

function ClassBookingCard(props: ClassBookingCardProps) {
    const formattedStartTime = props.startTime.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    return (
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
    );
}

export default ClassBookingCard;
