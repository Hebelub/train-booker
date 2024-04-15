"use client"

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SessionListItem from './SessionListItem';
import { Session } from '@/types/Session';

interface SessionListProps {
    sessions: Session[];
}

function SessionList({ sessions }: SessionListProps) {
    return (
        <ScrollArea className="h-full">
            {sessions.map((session) => (
                <div key={session.id}>
                    <SessionListItem {...session} />
                    <Separator className="my-2" />
                </div>
            ))}
        </ScrollArea>
    );
}

export default SessionList;
