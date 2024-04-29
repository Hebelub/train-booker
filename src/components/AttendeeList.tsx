import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingIcon } from "@/utils/icons";


interface AttendeeListProps {
    maxAttendees: number;
    attendees: User[];
    isLoading: boolean;
}

function AttendeeList({ maxAttendees, attendees, isLoading }: AttendeeListProps) {

    const attendingList = attendees.slice(0, maxAttendees);
    const waitingList = attendees.slice(maxAttendees);

    return (
        <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Attending People ({attendingList.length})</h4>

                {isLoading && <LoadingIcon />}
                {!isLoading && attendingList.map((attendee) => (
                    <div key={attendee.id}>
                        <div className="grid grid-cols-3 gap-4 py-2">
                            <div className="text-sm">
                                <img src={attendee.imageUrl} className="w-6 h-6 rounded-full inline-block mr-2" /> 
                                {attendee.firstName} {attendee.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{attendee.emailAddresses[0].emailAddress || 'N/A'}</div>
                            <div className="text-sm text-gray-600">{attendee.phoneNumbers[0].phoneNumber || 'N/A'}</div>
                        </div>
                        <Separator className="my-2" />
                    </div>
                ))}

                {/* Render the waiting list if there are any */}
                {!isLoading && waitingList.length > 0 && (
                    <>
                        <h4 className="mt-4 mb-2 text-sm font-medium leading-none">Waiting List ({waitingList.length})</h4>
                        {waitingList.map((attendee) => (
                            <div key={attendee.id}>
                                <div className="grid grid-cols-3 gap-4 py-2">
                                    <div className="text-sm">{<img src={attendee.imageUrl} className="w-6 h-6 rounded-full inline-block mr-2" />} {attendee.firstName} {attendee.lastName}</div>
                                    <div className="text-sm text-gray-600">{attendee.emailAddresses[0].emailAddress || 'N/A'}</div>
                                    <div className="text-sm text-gray-600">{attendee.phoneNumbers[0].phoneNumber || 'N/A'}</div>
                                </div>
                                <Separator className="my-2" />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </ScrollArea>
    );
}

export default AttendeeList;
