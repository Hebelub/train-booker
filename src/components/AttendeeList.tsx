import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AttendeeListProps {
    attendees: string[];
    maxAttendees: number;
}

function AttendeeList({ attendees, maxAttendees }: AttendeeListProps) {
    
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
