"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import SessionBookingCard from './SessionBookingCard';
import { getSessions } from '@/utils/sessions';
import { Session } from '@/types/Session';

function SessionBooker() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        getSessions().then(fetchedSessions => {
            console.log(fetchedSessions);
            setSessions(fetchedSessions);
        });
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-center items-stretch space-x-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                />
                <div className="h-[350px] w-[350px] flex flex-col">
                    <div className="h-[50px] flex items-center justify-center border rounded-md mb-4">
                        {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : "Select a date"}
                    </div>
                    <div className="flex-1 rounded-md border p-4 overflow-y-auto">
                        <ScrollArea className="h-full">
                            {sessions.map((session, index) => (
                                <SessionBookingCard 
                                    key={index} 
                                    id={session.id} 
                                    startTime={new Date(session.startTime)} 
                                    duration={session.duration} 
                                    name={session.name} 
                                    description={session.description} 
                                    location={session.location} 
                                    instructorName={session.instructorName}
                                    maxAttendees={session.maxAttendees}
                                    attendeeIds={session.attendeeIds}
                                />
                            ))}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SessionBooker;
