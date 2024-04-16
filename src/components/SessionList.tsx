import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SessionListItem from './SessionListItem';
import { Session } from '@/types/Session';
import { useAuth } from '@clerk/clerk-react';
import { Checkbox } from "@/components/ui/checkbox"

interface SessionListProps {
    sessions: Session[];
}

function SessionList({ sessions }: SessionListProps) {
    const { userId } = useAuth();

    const [showOnlyBooked, setShowOnlyBooked] = useState(false);

    // Handler for the checkbox change
    const handleCheckboxChange = (isChecked: boolean) => {
        setShowOnlyBooked(isChecked);
    };


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
    const filteredSessions = showOnlyBooked ? sessions.filter(session => session.attendeeIds.includes(userId || "")) : sessions;
    const sessionsByDate = groupSessionsByDate(filteredSessions);

    return (
        <div>
            <div className="flex items-center space-x-2 my-2">
                <Checkbox id="terms" isChecked={showOnlyBooked} onCheckedChange={handleCheckboxChange} />
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Only show booked sessions
                </label>
            </div>
            <ScrollArea className="h-full">
                {Array.from(sessionsByDate.entries()).map(([date, sessions]) => (
                    <div key={date}>
                        <div className="px-4 py-2 bg-gray-200 text-lg font-semibold">
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
        </div>
    );
}

export default SessionList;
