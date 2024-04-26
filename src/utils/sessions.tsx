import app from '@/utils/firebase';
import { Session } from '../types/Session';
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
    return convertedSession as Session;
};

// Get all sessions
const getSessions = async (): Promise<Session[]> => {
    const snapshot = await getDocs(sessionsCollection);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...convertTimestamps(data),  // Convert timestamps to Date objects
            id: doc.id
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
const addSession = async (session: Omit<Session, 'id' | 'attendeeIds'>): Promise<string> => {
    const sessionWithAttendees = {
        ...session,
        attendeeIds: [] // Ensuring attendeeIds is always initialized as an empty array
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
    await updateDoc(sessionDocRef, {
        attendeeIds: arrayUnion(userId) // Adds userId to the attendeeIds array
    });
};

// Function to unbook a session
export const unbookSession = async (sessionId: string, userId: string): Promise<void> => {
    const sessionDocRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionDocRef, {
        attendeeIds: arrayRemove(userId) // Removes userId from the attendeeIds array
    });
};

// Checks if a session is upcoming or today
export function isUpcomingOrToday(session: Session) {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to 00:00:00 for today's date
    return session.startTime >= now;
}

// Update the start times of sessions based on their day of the week
export function updateSessionStartTimes(sessions: Session[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Today's date at the start of the day

    return sessions.map(session => {
        if (isUpcomingOrToday(session)) {
            // If the session is today or in the future, return it unchanged
            return session;
        }
        if (session.repeatMode === 'weekly') {
            // Calculate the day of the week for both the session and today
            const sessionDate = new Date(session.startTime);
            const sessionDayOfWeek = sessionDate.getDay();
            const todayDayOfWeek = today.getDay();

            // Calculate the difference in days to the next occurrence of the session's day
            let dayDifference = sessionDayOfWeek - todayDayOfWeek;
            if (dayDifference < 0) {
                dayDifference += 7; // Ensure it's always a future date or today
            }

            // Create a new date object for the updated session time
            const updatedSession = { ...session };
            updatedSession.startTime = new Date(today); // Start with today at midnight
            updatedSession.startTime.setDate(today.getDate() + dayDifference); // Set to the correct future date
            updatedSession.startTime.setHours(session.startTime.getHours(), session.startTime.getMinutes(), 0, 0); // Set the original session time

            return updatedSession;
        }
        return session; // Return the session unchanged if it doesn't repeat weekly
    });
}

export { getSessions, getSessionById, addSession, updateSession, deleteSession };
