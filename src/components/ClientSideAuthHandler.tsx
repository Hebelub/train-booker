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
            const token = await getToken({ template: "integration_firebase" });
            await signInWithCustomToken(auth, token || "");
        };
        authenticateFirebase();
    }, [getToken, auth]);

    return null; // This component doesn't render anything
};

export default ClientSideAuthHandler;
