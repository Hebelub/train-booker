import app from '@/utils/firebase';
import { Attendee, Session } from '../types/Session';
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    arrayUnion,
    arrayRemove,
    where,
} from "firebase/firestore";

const db = getFirestore(app);
const sessionsCollection = collection(db, "sessions");

const convertTimestamps = (session: any): Session => {
    const convertedSession = { ...session };
    // Convert all Timestamp fields to Date
    if (convertedSession.startTime && convertedSession.startTime instanceof Timestamp) {
        convertedSession.startTime = convertedSession.startTime.toDate();
    }
    const convertedSessionRepeated = updateSessionBasedOnRepeatMode(convertedSession); // Update the start time based on the day of the week
    return convertedSessionRepeated as Session;
};

// Get all sessions
const getSessions = async (): Promise<Session[]> => {
    const snapshot = await getDocs(sessionsCollection);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...convertTimestamps(data),  // Convert timestamps to Date objects
            id: doc.id,
            attendees: data.attendees ? data.attendees : []  // Ensure attendees is always an array
        } as Session;
    });
};

// Get a single session by ID
const getSessionById = async (id: string): Promise<Session | undefined> => {
    const sessionDoc = doc(db, "sessions", id);
    const docSnap = await getDoc(sessionDoc);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            ...convertTimestamps(data),  // Convert timestamps to Date objects
            id: docSnap.id
        } as Session;
    }
    return undefined;
};

// Add a new session
const addSession = async (session: Omit<Session, 'id' | 'attendees'>): Promise<string> => {
    const sessionWithAttendees = {
        ...session,
        attendees: [] // Ensuring attendees is always initialized as an empty array
    };

    const docRef = await addDoc(sessionsCollection, sessionWithAttendees);
    return docRef.id; // Return the new session ID
};

// Update an existing session
const updateSession = async (id: string, session: Partial<Session>): Promise<void> => {
    const sessionDoc = doc(db, "sessions", id);
    await updateDoc(sessionDoc, session);
};

// Delete a session
const deleteSession = async (id: string): Promise<void> => {
    const sessionDoc = doc(db, "sessions", id);
    await deleteDoc(sessionDoc);
};

// Function to book a session
export const bookSession = async (sessionId: string, userId: string): Promise<void> => {
    const sessionDocRef = doc(db, "sessions", sessionId);
    const timestamp = new Date(); // Captures the current date and time
    await updateDoc(sessionDocRef, {
        attendees: arrayUnion({
            userId: userId,
            bookedAt: timestamp
        })
    });
};

// Function to unbook a session
export const unbookSession = async (sessionId: string, userId: string): Promise<void> => {
    const sessionDocRef = doc(db, "sessions", sessionId);
    const docSnap = await getDoc(sessionDocRef);

    if (docSnap.exists()) {
        const sessionData = docSnap.data();
        const newAttendees = sessionData.attendees.filter((attendee: Attendee) => attendee.userId !== userId);

        await updateDoc(sessionDocRef, {
            attendees: newAttendees
        });
    } else {
        console.log("No such session!");
    }
};

// Checks if a session is upcoming or today
export function isUpcomingOrToday(session: Session) {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to 00:00:00 for today's date
    return session.startTime >= now;
}

// Update the start time of a single session based on the day of the week
function updateSessionBasedOnRepeatMode(session: Session): Session {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Today's date at the start of the day

    if (isUpcomingOrToday(session)) {
        return session; // If the session is today or in the future, return it unchanged
    }

    if (session.repeatMode === 'weekly') {
        const sessionDate = new Date(session.startTime);
        const sessionDayOfWeek = sessionDate.getDay();
        const todayDayOfWeek = today.getDay();

        let dayDifference = sessionDayOfWeek - todayDayOfWeek;
        if (dayDifference < 0) {
            dayDifference += 7; // Ensure it's always a future date or today
        }

        const updatedSession = { ...session };
        updatedSession.startTime = new Date(today); // Start with today at midnight
        updatedSession.startTime.setDate(today.getDate() + dayDifference); // Set to the correct future date
        updatedSession.startTime.setHours(session.startTime.getHours(), session.startTime.getMinutes(), 0, 0); // Set the original session time

        return updatedSession;
    }
    return session; // Return the session unchanged if it doesn't repeat weekly
}

export function idsOfAttending(session: Session): string[] {
    if (!session.attendees) {
        return [];
    }

    session = updateSessionBasedOnRepeatMode(session);

    if (session.repeatMode === 'weekly') {
        // Calculate the date one week prior to the session's startTime
        const oneWeekBeforeSession = new Date(session.startTime);
        oneWeekBeforeSession.setDate(oneWeekBeforeSession.getDate() - 7);

        // Filter attendees whose bookedAt date is at least one week after the session startTime
        return session.attendees.filter((attendee: Attendee) => {
            const bookedDate = attendee.bookedAt.toDate(); // Convert Timestamp to Date
            return bookedDate > oneWeekBeforeSession;
        }).map((attendee: Attendee) => attendee.userId); // Return the user IDs of filtered attendees
    } else {
        // If the session is not weekly, simply return all attendee IDs
        return session.attendees.map((attendee: Attendee) => attendee.userId);
    }
}


export { getSessions, getSessionById, addSession, updateSession, deleteSession };
