import { User } from "@clerk/nextjs/server";
import { LoadingIcon } from "@/utils/icons";
import { DataTable } from "./attendees/data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ColumnDef, Row } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AttendeeListProps {
    maxAttendees: number;
    attendees: User[];
    isLoading: boolean;
}

interface CellInfo {
    row: Row<User>;
    getValue: () => any;  // Adjust based on actual method signature
}

function AttendeeList({ maxAttendees, attendees, isLoading }: AttendeeListProps) {

    // Split the attendees into attending and waiting lists
    const attendingList = attendees.slice(0, maxAttendees);
    const waitingList = attendees.slice(maxAttendees);

    // Define columns for the DataTable
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info: CellInfo) => (
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={info.row.original.imageUrl} alt="Profile" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{info.row.original.firstName} {info.row.original.lastName}</span>
                </div>
            )
        },
        {
            accessorKey: 'emailAddresses',
            header: 'Email',
            cell: (info: CellInfo) => info.getValue()[0]?.emailAddress || 'N/A'
        },
        {
            accessorKey: 'phoneNumbers',
            header: 'Phone',
            cell: (info: CellInfo) => info.getValue()[0]?.phoneNumber || 'N/A'
        }
    ];

    return (
        <ScrollArea className="mx-auto pt-10 w-screen mb-10">
            <div className="w-max">

                {isLoading ? (
                    <LoadingIcon />
                ) : (
                    <>
                        <h4 className="mb-4 text-sm font-medium leading-none">Attending People ({attendingList.length})</h4>
                        <DataTable columns={columns} data={attendingList} />

                        {waitingList.length > 0 && (
                            <>
                                <h4 className="mt-8 mb-4 text-sm font-medium leading-none">Waiting List ({waitingList.length})</h4>
                                <DataTable columns={columns} data={waitingList} />
                            </>
                        )}
                    </>
                )}
            </div>

            <ScrollBar orientation="horizontal" />
        </ScrollArea>

    );
}

export default AttendeeList;
