import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingIcon } from "@/utils/icons";


interface AttendeeListProps {
    sessionId: string;
    maxAttendees: number;
}

function AttendeeList({ sessionId, maxAttendees }: AttendeeListProps) {

    const [attendees, setAttendees] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendees = async () => {
            const users: User[] = await (await fetch(`/api/sessions/${sessionId}/users`)).json()
            setAttendees(users);
            setLoading(false);
        };

        fetchAttendees();
    }, [sessionId]);


    const attendingList = attendees.slice(0, maxAttendees);
    const waitingList = attendees.slice(maxAttendees);


    return (
        <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Attending People ({attendingList.length})</h4>
                {loading && <LoadingIcon />}
                {!loading && attendingList.map((attendee, index) => (
                    <div key={index} className="text-sm">
                        {attendee.firstName} {attendee.lastName}
                        <Separator className="my-2" />
                    </div>
                ))}

                {/* Render the waiting list if there are any */}
                {waitingList.length > 0 && (
                    <>
                        <h4 className="mt-4 mb-2 text-sm font-medium leading-none">Waiting List ({waitingList.length})</h4>
                        {waitingList.map((attendee, index) => (
                            <div key={'waiting-' + index} className="text-sm">
                                {attendee.firstName} {attendee.lastName}
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
