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
    deleteDoc 
} from "firebase/firestore";

const db = getFirestore(app);
const sessionsCollection = collection(db, "sessions");

// Get all sessions
const getSessions = async (): Promise<Session[]> => {
    const snapshot = await getDocs(sessionsCollection);
    return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    } as Session));
};

// Get a single session by ID
const getSessionById = async (id: string): Promise<Session | undefined> => {
    const sessionDoc = doc(db, "sessions", id);
    const docSnap = await getDoc(sessionDoc);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Session : undefined;
};

// Add a new session
const addSession = async (session: Omit<Session, 'id'>): Promise<string> => {
    const docRef = await addDoc(sessionsCollection, session);
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

export { getSessions, getSessionById, addSession, updateSession, deleteSession };
