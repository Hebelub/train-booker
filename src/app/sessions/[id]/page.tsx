'use client'

import { bookSession, getSessionById, unbookSession } from '@/utils/sessions';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { Button } from "@/components/ui/button";
import { useAuth } from '@clerk/nextjs';
import SessionBookingControls from '@/components/SessionBookingControls';

function SessionPage() {
  const pathname = usePathname();
  const sessionId = pathname.split('/')[2];

  const { userId } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    if (sessionId) {
      getSessionById(sessionId).then(result => {
        if (result) {
          setSession(result);
          setIsBooked(result.attendeeIds.includes(userId ?? ''));
        } else {
          setSession(null);
        }
      });
    }
  }, [sessionId, userId]);

  const handleBookingChange = () => {
    if (isBooked) {
      unbookSession(sessionId, userId ?? '').then(() => {
        setIsBooked(false);
      });
    } else {
      bookSession(sessionId, userId ?? '').then(() => {
        setIsBooked(true);
      });
    }
  };

  useEffect(() => {
    if (sessionId) {
      // Fetch session by ID, then check the result before setting state
      getSessionById(sessionId).then(result => {
        // Only set the state if result is not undefined
        setSession(result ?? null); // Use null if result is undefined
      });
    }
  }, [sessionId]);

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

      <SessionBookingControls
        sessionId={sessionId}
        userId={userId || null}
        isBooked={isBooked}
        onBookingChange={handleBookingChange}
      />
    </div>
  );
}

export default SessionPage;
