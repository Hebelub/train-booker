'use client'

import { bookSession, getSessionById, unbookSession } from '@/utils/sessions';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from '@clerk/nextjs';
import SessionBookingControls from '@/components/SessionBookingControls';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon, LocationIcon, UserIcon, CalendarIcon } from '@/utils/icons';
import { convertToHoursAndMinutes, formatDate, formatTime } from '@/utils/utils';

function SessionPage() {

  const pathname = usePathname();
  const sessionId = pathname.split('/')[2];

  const { userId } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {

    const retrieveSession = async () => {

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
    <div className="flex h-[calc(100vh-75px)] flex-col items-center justify-center space-y-4">
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
