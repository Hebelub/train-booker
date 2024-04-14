"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import SessionListItem from './SessionListItem';
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
        <div className="flex justify-center items-stretch h-[100%] flex-col w-[350px]">
            <div className="h-[50px] flex items-center justify-center border rounded-md mb-4">
                {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : "Select a date"}
            </div>
            <div className="flex-1 rounded-md overflow-y-auto">
                <ScrollArea className="h-full">
                    {sessions.map((session, index) => (
                        <div className="">
                            <SessionListItem
                                key={index}
                                {...session}
                            />
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </div>
    );
}

export default SessionBooker;
