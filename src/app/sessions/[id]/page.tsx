'use client'

import { getSessionById } from '@/utils/sessions';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';

function SessionPage() {
  const pathname = usePathname();
  const id = pathname.split('/')[2];

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch session by ID, then check the result before setting state
      getSessionById(id).then(result => {
        // Only set the state if result is not undefined
        setSession(result ?? null); // Use null if result is undefined
      });
    }
  }, [id]);

  // Handling display of session details or a loading message
  if (!session) {
    return <div className="flex min-h-screen flex-col items-center justify-center p-24">Loading session details...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      We are now in a session with ID: {id}
      {/* Example of displaying a session detail */}
      <p>Session Name: {session.name}</p>
    </div>
  );
}

export default SessionPage;
