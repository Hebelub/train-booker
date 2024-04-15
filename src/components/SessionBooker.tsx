"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import SessionListItem from './SessionListItem';
import { getSessions } from '@/utils/sessions';
import { Session } from '@/types/Session';
import SessionList from '@/components/SessionList';
import { useAuth } from '@clerk/clerk-react';
import { isUserIdAdmin } from '@/utils/utils';
import { useRouter } from 'next/navigation';


function SessionBooker() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [sessions, setSessions] = useState<Session[]>([]);

    const { userId } = useAuth();
    const isAdmin = isUserIdAdmin(userId || "");
    const router = useRouter();

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
                <SessionList sessions={sessions} />
            </div>

            {/* Admin section */}
            {isAdmin && (
                <div className="mt-4 w-full">
                    <Separator />
                    <span className="text-center text-sm text-gray-500 mt-4">Admin Section</span>
                    <Button className='w-full' onClick={() => router.push('/sessions/create')}>Create Session</Button>
                </div>
            )}

        </div>
    );
}

export default SessionBooker;
