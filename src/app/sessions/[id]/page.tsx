'use client'

import { bookSession, getSessionById, unbookSession } from '@/utils/sessions';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from '@clerk/nextjs';
import SessionBookingControls from '@/components/SessionBookingControls';
import firebase from '@/utils/firebase';
import app from '@/utils/firebase';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon, LocationIcon, UserIcon, CalendarIcon } from '@/utils/icons';
import { convertToHoursAndMinutes, formatDate, formatTime } from '@/utils/utils';


const auth = getAuth(app);

function SessionPage() {

  const pathname = usePathname();
  const sessionId = pathname.split('/')[2];

  const { userId, getToken } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {

    const retrieveSession = async () => {

      const token = await getToken({ template: "integration_firebase" });
      await signInWithCustomToken(auth, token || "");

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
    }

    retrieveSession();
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
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <Card className="p-4 items-center max-w-[400px]">

        <CardHeader>
          <CardTitle>{session.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>{session.description}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2">
            <ClockIcon />
            <span>{formatDate(session.startTime) + ", " + formatTime(session.startTime)}</span>
          </div>
          <span><strong>Duration: </strong>{convertToHoursAndMinutes(session.duration)}</span>
          <div className="flex items-center gap-2">
            <LocationIcon />
            <span>{session.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon />
            <span>{session.instructorName}</span>
          </div>
          <p><strong>Max Attendees:</strong> {session.maxAttendees}</p>
        </CardContent>

        <CardFooter>
          <SessionBookingControls
            sessionId={sessionId}
            userId={userId || null}
            isBooked={isBooked}
            onBookingChange={handleBookingChange}
          />
        </CardFooter>
      </Card>
    </div>
  );
} 

export default SessionPage;
