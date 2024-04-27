import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { clerkClient } from '@clerk/nextjs/server';


interface AttendeeListProps {
    attendeeIds: string[];
    maxAttendees: number;
}

function AttendeeList({ attendeeIds, maxAttendees }: AttendeeListProps) {

    const [attendees, setAttendees] = useState(attendeeIds);

    useEffect(() => {
        setAttendees(attendeeIds);

        async function fetchAttendeesData() {
            try {
                if (!attendeeIds || attendeeIds.length === 0) {
                    console.log("No attendees to fetch.");
                    return;
                }

                // Assuming there's a method to fetch multiple users if not handle it as per your API
                const responses = await Promise.all(
                    attendeeIds.map(id => clerkClient.users.getUser(id))
                );

                console.log("Attendee details:", responses);

                const attendeeNames = responses.map(response => "DEBUG");
                setAttendees(attendeeNames);
            } catch (error) {
                console.error('Failed to fetch attendee data:', error);
            }
        }

        fetchAttendeesData();
    }, [attendeeIds]);


    const attendingList = attendees.slice(0, maxAttendees);
    const waitingList = attendees.slice(maxAttendees);


    return (
        <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Attending People ({attendingList.length})</h4>
                {attendingList.map((attendee, index) => (
                    <div key={index} className="text-sm">
                        {attendee}
                        <Separator className="my-2" />
                    </div>
                ))}

                {/* Render the waiting list if there are any */}
                {waitingList.length > 0 && (
                    <>
                        <h4 className="mt-4 mb-2 text-sm font-medium leading-none">Waiting List ({waitingList.length})</h4>
                        {waitingList.map((attendee, index) => (
                            <div key={'waiting-' + index} className="text-sm">
                                {attendee}
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
