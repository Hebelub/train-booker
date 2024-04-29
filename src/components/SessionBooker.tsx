"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import SessionListItem from './SessionListItem';
import { getSessions, isUpcomingOrToday } from '@/utils/sessions';
import { Session } from '@/types/Session';
import SessionList from '@/components/SessionList';
import { useAuth } from '@clerk/clerk-react';
import { isUserIdAdmin } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox"

function SessionBooker() {

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [sessions, setSessions] = useState<Session[]>([]);

    const { userId } = useAuth();
    const isAdmin = isUserIdAdmin(userId || "");
    const router = useRouter();

    const [showOnlyBooked, setShowOnlyBooked] = useState(false);

    const handleCheckboxChange = (isChecked: boolean) => {
        setShowOnlyBooked(isChecked);
    };

    useEffect(() => {
        getSessions().then(fetchedSessions => {
            const upcomingSessions = fetchedSessions.filter(isUpcomingOrToday);
            const sortedSessions = upcomingSessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
            setSessions(sortedSessions);
        });
    }, []);

    return (
        <div className="flex justify-center items-stretch h-[100%] flex-col w-[350px]">
            
            <div className="flex items-center space-x-2 my-2">
                    <Checkbox id="terms" onCheckedChange={handleCheckboxChange} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Only show booked sessions
                    </label>
                </div>

            <div className="flex-1 rounded-md overflow-y-auto">
                <SessionList sessions={sessions} showOnlyBooked={showOnlyBooked} />
            </div>

            {/* Admin section */}
            {isAdmin && (
                <div className="mt-4 w-full">
                    <Separator />
                    <span className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Admin Section</span>
                    <Button className='w-full' onClick={() => router.push('/sessions/create')}>Create Session</Button>
                </div>
            )}

        </div>
    );
}

export default SessionBooker;
