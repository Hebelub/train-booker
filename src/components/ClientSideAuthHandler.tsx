"use client"

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

const ClientSideAuthHandler = () => {
    const { getToken } = useAuth();
    const auth = getAuth();

    useEffect(() => {
        const authenticateFirebase = async () => {
            const token = await getToken({ template: "integration_firebase" });
            await signInWithCustomToken(auth, token || "");
        };
        authenticateFirebase();
    }, [getToken]);

    return null; // This component doesn't render anything
};

export default ClientSideAuthHandler;
