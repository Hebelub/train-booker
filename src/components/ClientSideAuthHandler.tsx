"use client"

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import app from '@/utils/firebase';

const ClientSideAuthHandler = () => {
    const { getToken } = useAuth();
    const auth = getAuth(app);

    useEffect(() => {
        const authenticateFirebase = async () => {
            try {
                const token = await getToken({ template: "integration_firebase" });
                if (!token) {
                    throw new Error('Token is undefined or empty');
                }
                await signInWithCustomToken(auth, token);
            } catch (error) {
                console.error('Error during Firebase authentication:', error);
            }
        };
        authenticateFirebase();
    }, [getToken, auth]);

    return null; // This component doesn't render anything
};

export default ClientSideAuthHandler;
