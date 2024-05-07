import { User } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import { LoadingIcon } from "@/utils/icons";
import { DataTable } from "./attendees/data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface AttendeeListProps {
    maxAttendees: number;
    attendees: User[];
    isLoading: boolean;
}

function AttendeeList({ maxAttendees, attendees, isLoading }: AttendeeListProps) {
    // Split the attendees into attending and waiting lists
    const attendingList = attendees.slice(0, maxAttendees);
    const waitingList = attendees.slice(maxAttendees);

    // Define columns for the DataTable
    const columns = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: info => (
                <div className="flex items-center space-x-3">
                    <img src={info.row.original.imageUrl} alt="Profile" className="w-10 h-10 rounded-full" />
                    <span>{info.row.original.firstName} {info.row.original.lastName}</span>
                </div>
            )
        },
        {
            accessorKey: 'emailAddresses',
            header: 'Email',
            cell: info => info.getValue()[0]?.emailAddress || 'N/A'
        },
        {
            accessorKey: 'phoneNumbers',
            header: 'Phone',
            cell: info => info.getValue()[0]?.phoneNumber || 'N/A'
        }
    ];

    return (
        <ScrollArea className="mx-auto pt-10 w-screen">
            <div className="flex w-max space-x-4">

                {isLoading ? (
                    <LoadingIcon />
                ) : (
                    <div className="">
                        <h4 className="mb-4 text-sm font-medium leading-none">Attending People ({attendingList.length})</h4>
                        <DataTable columns={columns} data={attendingList} />

                        {waitingList.length > 0 && (
                            <>
                                <h4 className="mt-8 mb-4 text-sm font-medium leading-none">Waiting List ({waitingList.length})</h4>
                                <DataTable columns={columns} data={waitingList} />
                            </>
                        )}
                    </div>
                )}
            </div>

            <ScrollBar orientation="horizontal" />
        </ScrollArea>

    );
}

export default AttendeeList;
