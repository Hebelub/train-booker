import { Timestamp } from "firebase/firestore";

export interface Attendee {
    userId: string;
    bookedAt: Timestamp;
}

export interface Session {
    id: string;
    startTime: Date;
    duration: number;
    name: string;
    description: string;
    location: string;
    instructorName: string;
    maxAttendees: number;
    repeatMode: string;
    attendees: Attendee[];
}
