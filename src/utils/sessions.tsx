import app from "./firebase";
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
    arrayRemove
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

export { getSessions, getSessionById, addSession, updateSession, deleteSession };
