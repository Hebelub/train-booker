import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AttendeeListProps {
    attendees: string[];
}

function AttendeeList(props: AttendeeListProps) {
    const numAttending = props.attendees.length;

    return (
        <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Attending People ({numAttending})</h4>
                {props.attendees.map((attendee) => (
                    <>
                        <div key={attendee} className="text-sm">
                            {attendee}
                        </div>
                        <Separator className="my-2" />
                    </>
                ))}
            </div>
        </ScrollArea>
    )
}

export default AttendeeList