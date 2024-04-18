'use client'

import { bookSession, getSessionById, unbookSession } from '@/utils/sessions';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { Button } from "@/components/ui/button";
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import SessionBookingControls from '@/components/SessionBookingControls';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon, LocationIcon, UserIcon, CalendarIcon, CheckIcon, EditIcon } from '@/utils/icons';
import { convertToHoursAndMinutes, formatDate, formatTime, isUserIdAdmin } from '@/utils/utils';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SessionForm from '@/components/SessionForm';
import { deleteSession } from '@/utils/sessions';
import DeletionDialog from '@/components/DeletionDialog';
import { useToast } from '@/components/ui/use-toast';
import AttendeeList from '@/components/AttendeeList';
import { clerkClient } from '@clerk/nextjs';
import { EventStatus } from '@/components/EventStatus';

function SessionPage() {

  const pathname = usePathname();
  const sessionId = pathname.split('/')[2];

  const { userId } = useAuth();
  const isAdmin = isUserIdAdmin(userId || '');
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  const availableSlots = session ? session.maxAttendees - session.attendeeIds.length : 0;

  const [userNames, setUserNames] = useState<string[]>([]);

  useEffect(() => {
    const retrieveSession = async () => {
      if (sessionId) {
        try {
          const result = await getSessionById(sessionId);
          if (result) {
            setSession(result);
            setIsBooked(result.attendeeIds.includes(userId ?? ''));
            console.log("Session loaded:", result);
          } else {
            setSession(null);
          }
        } catch (error) {
          console.error("Failed to load session:", error);
          setSession(null);
        }
      }
    };

    retrieveSession();
  }, [sessionId, userId]);

  useEffect(() => {
    console.log("Session State Update:", session);

    const fetchUserNames = async () => {
      if (session && session.attendeeIds && session.attendeeIds.length > 0) {
        try {
          const usernames = await Promise.all(
            session.attendeeIds.map(async (userId) => {
              console.log("Fetching username for userId:", userId);
              const user = await clerkClient.users.getUser(userId);
              return user.username || "fallback"; // Fallback to userId if username isn't available
            })
          );
          setUserNames(usernames);
          console.log("Usernames fetched:", usernames);
        } catch (error) {
          console.error('Failed to fetch usernames:', error);
        }
      }
    };

    if (session) {
      fetchUserNames();
    }
  }, [session]);


  const handleBookingChange = () => {
    if (isBooked) {
      unbookSession(sessionId, userId ?? '').then(() => {
        setIsBooked(false);
        // Remove the userId from the attendeeIds array locally after successful server update
        if (session) {
          setSession({
            ...session,
            attendeeIds: session.attendeeIds.filter(id => id !== userId)
          });
        }
      });
    } else {
      bookSession(sessionId, userId ?? '').then(() => {
        setIsBooked(true);
        // Add the userId to the attendeeIds array locally after successful server update
        if (session) {
          setSession({
            ...session,
            attendeeIds: [...session.attendeeIds, userId || '']
          });
        }
      });
    }
  };

  const handleUpdateSession = (updatedSession: Partial<Session>) => {
    setIsEditDialogOpen(false);

    if (session) {
      // Safely combine the existing session with updated fields
      const newSession: Session = { ...session, ...updatedSession };
      setSession(newSession);
    } else {
      // Handle the case where there is no existing session to update
      // Options: set to null, use defaults, or skip
      console.log("No existing session to update.");
    }
  };

  const handleDeleteSession = async () => {
    try {
      await deleteSession(session?.id || "");
      toast({
        title: "Success",
        description: "Session deleted successfully.",
      });
      router.push('/sessions'); // Navigate back to the sessions listing
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "Failed to delete the session.",
      });
    }
  };

  const waitingListPosition = () => {
    if (session) {
      const position = session.attendeeIds.indexOf(userId || "") - session.maxAttendees + 1;
      return position;
    }
    return 0;
  };

  // Handling display of session details or a loading message
  if (!session) {
    return <div className="flex min-h-screen flex-col items-center justify-center p-24">Loading session details...</div>;
  }

  return (
    <div className="flex pt-20 flex-col items-center justify-center space-y-4">
      <div className="items-center">

        <Card className="p-4 items-center">
          <CardHeader>
            <CardTitle>{session.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>{session.description}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span>{formatDate(session.startTime) + ", " + formatTime(session.startTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon />{convertToHoursAndMinutes(session.duration)}
            </div>
            <div className="flex items-center gap-2">
              <LocationIcon />
              <span>{session.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon />
              <span>{session.instructorName}</span>
            </div>
            <div className="text-sm">
              {/* Display available slots or waiting list status */}
              {availableSlots > 0 ? (
                <p><strong>Available:</strong> {availableSlots}</p>
              ) : (
                <p className="text-red-500"><strong>Session Full</strong></p>
              )}
            </div>
            {waitingListPosition() > 0 && (
              <div className="text-sm">
                <p className="text-red-500"><strong>You are number {waitingListPosition()} on the waiting list.</strong></p>
              </div>
            )}
            {isBooked && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckIcon />
                <span>Booked</span>
              </div>
            )}

            <EventStatus startTime={session.startTime} duration={session.duration} />

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

        {/* Admin section */}
        {isAdmin && (
          <div className="mt-4 w-full">
            <Separator />
            <div className="w-full">
              <span className="text-center text-sm text-gray-500 mt-4">Admin Section</span>
            </div>

            <div className="flex">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild className="mr-2">
                  <Button className="flex items-center gap-2"><EditIcon />Edit Session</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Session</DialogTitle>
                    <DialogDescription>
                      Modify the session details below.
                    </DialogDescription>
                  </DialogHeader>
                  <SessionForm session={session} mode="update" onUpdate={handleUpdateSession} />
                </DialogContent>
              </Dialog>

              <DeletionDialog
                onDeleteConfirmed={handleDeleteSession}
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              />
            </div>

            <div className='mt-4'>
              <AttendeeList attendees={userNames.length ? userNames : session.attendeeIds} maxAttendees={session.maxAttendees} />
            </div>
          </div>

        )}

      </div>
    </div>
  );
}

export default SessionPage;
