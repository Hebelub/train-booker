'use client'

import { getSessionById } from '@/utils/sessions';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-screen flex-col items-center justify-center p-24 space-y-4">
      <h1 className="text-2xl font-bold">{session.name}</h1>
      <p><strong>Description:</strong> {session.description}</p>
      <p><strong>Start Time:</strong> {new Date(session.startTime).toLocaleString()}</p>
      <p><strong>Instructor:</strong> {session.instructorName}</p>
      <p><strong>Duration:</strong> {session.duration} hours</p>
      <p><strong>Location:</strong> {session.location}</p>
      <p><strong>Max Attendees:</strong> {session.maxAttendees}</p>

      <Button>Join Session</Button>
    </div>
  );
}

export default SessionPage;
