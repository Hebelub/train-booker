export interface Session {
    id: string;
    startTime: Date;
    duration: number;
    name: string;
    description: string;
    location: string;
    instructorName: string;
    maxAttendees: number;
    attendeeIds: string[];
}
