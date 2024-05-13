import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SessionListItem from './SessionListItem';
import { Session } from '@/types/Session';
import { useAuth } from '@clerk/clerk-react';
import { Checkbox } from "@/components/ui/checkbox"
import { idsOfAttending } from '@/utils/sessions';
import { LoadingIcon } from '@/utils/icons'

interface SessionListProps {
    sessions: Session[];
    showOnlyBooked: boolean;
    loading: boolean;
}

function SessionList({ sessions, showOnlyBooked, loading }: SessionListProps) {
    const { userId } = useAuth();

    // Function to group sessions by date
    const groupSessionsByDate = (sessions: Session[]) => {
        const grouped = new Map<string, Session[]>();

        // First sort sessions by the startTime
        const sortedSessions = sessions.sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        // Then group them by date
        sortedSessions.forEach(session => {
            const dateKey = session.startTime.toISOString().split('T')[0]; // YYYY-MM-DD format
            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, []);
            }
            grouped.get(dateKey)?.push(session);
        });

        return grouped;
    };

    // Filter sessions if the checkbox is checked
    const filteredSessions = showOnlyBooked ? sessions.filter(session => idsOfAttending(session).includes(userId || "")) : sessions;
    const sessionsByDate = groupSessionsByDate(filteredSessions);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingIcon className="w-16 h-16" />
            </div>
        );
    }

    // Conditional rendering logic before the return statement
    if (filteredSessions.length === 0) {
        if (showOnlyBooked) {
            return (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    You have no sessions booked.
                </div>
            );
        } else {
            return (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No sessions found.
                </div>
            );
        }
    }

    return (
        <ScrollArea className="h-full">
            {Array.from(sessionsByDate.entries()).map(([date, sessions]) => (
                <div key={date}>
                    <div className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-lg font-semibold">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    {sessions.map(session => (
                        <div key={session.id}>
                            <SessionListItem {...session} />
                            <Separator className="my-2" />
                        </div>
                    ))}
                </div>
            ))}
        </ScrollArea>
    );
}

export default SessionList;
