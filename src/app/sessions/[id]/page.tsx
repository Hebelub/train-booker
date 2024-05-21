'use client'

import { bookSession, getSessionById, unbookSession } from '@/utils/sessions';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { Button } from "@/components/ui/button";
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon, LocationIcon, UserIcon, CalendarIcon, CheckIcon, EditIcon, LoadingIcon } from '@/utils/icons';
import { convertToHoursAndMinutes, formatDate, formatTime, isUserIdAdmin } from '@/utils/utils';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SessionForm from '@/components/SessionForm';
import { deleteSession, idsOfAttending } from '@/utils/sessions';
import DeletionDialog from '@/components/DeletionDialog';
import { useToast } from '@/components/ui/use-toast';
import AttendeeList from '@/components/AttendeeList';
import { EventStatus } from '@/components/EventStatus';
import { User } from '@clerk/nextjs/server';
import { Timestamp } from 'firebase/firestore';
import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";


function SessionHasPassed(session: Session) {
  return new Date(session.startTime.getTime() + session.duration * 60000) < new Date();
}

function SessionPage() {

  const pathname = usePathname();
  const sessionId = pathname.split('/')[2];

  const { user } = useUser();

  const { userId } = useAuth();
  const isAdmin = isUserIdAdmin(userId || '');
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  const availableSlots = session ? session.maxAttendees - idsOfAttending(session).length : 0;

  const [attendees, setAttendees] = useState<User[]>([]);
  const [attendeesIsLoading, setAttendeesIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      const users: User[] = await (await fetch(`/api/sessions/${sessionId}/users`)).json()
      setAttendeesIsLoading(false);
      setAttendees(users);
    };

    fetchAttendees();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return; // Guard against undefined sessionId

    setLoading(true); // Start loading when sessionId changes
    getSessionById(sessionId)
      .then((result) => {
        setSession(result || null);
        if (result && userId) {
          // Check if the user is already booked
          const isUserBooked = result.attendees.some(attendee => attendee.userId === userId);
          setIsBooked(isUserBooked);
        }
      })
      .catch((error) => {
        console.error("Failed to load session:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of the result
      });
  }, [sessionId, userId]);


  const handleBookingChange = () => {
    if (isBooked) {
      // Optimistically set isBooked to false and update local UI state
      setIsBooked(false);
      if (session) {
        const filteredAttendees = session.attendees.filter(attendee => attendee.userId !== userId);
        setSession({
          ...session,
          attendees: filteredAttendees
        });
      }
      setAttendees(attendees.filter(user => user.id !== userId));

      // Then try to update on the server
      unbookSession(sessionId, userId ?? '').catch(() => {
        // If the server call fails, revert the changes locally
        setIsBooked(true);
        if (session) {
          setSession(session); // Revert to the original session state
        }
        setAttendees(attendees); // Revert to the original attendees list
      });
    } else {
      // Optimistically set isBooked to true and update local UI state
      setIsBooked(true);
      if (session && user) {
        const newAttendee = { userId: userId || '', bookedAt: Timestamp.fromDate(new Date()) };
        setSession({
          ...session,
          attendees: [...session.attendees, newAttendee]
        });
        setAttendees([...attendees, user as unknown as User]);
      }

      // Then try to update on the server
      bookSession(sessionId, userId ?? '').catch(() => {
        // If the server call fails, revert the changes locally
        setIsBooked(false);
        if (session) {
          setSession(session); // Revert to the original session state
        }
        setAttendees(attendees); // Revert to the original attendees list
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
      const position = idsOfAttending(session).indexOf(userId || "") - session.maxAttendees + 1;
      return position;
    }
    return 0;
  };

  // Handling display of session details or a loading message
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <LoadingIcon className="w-16 h-16" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Session not found.</p>
      </div>
    );
  }

  return (
    <div className="flex pt-20 flex-col items-center justify-center space-y-4">
      <div className="items-center max-w-[500px]">

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

          {!SessionHasPassed(session) && (<CardFooter>
            {userId ? (
              <Button onClick={handleBookingChange}>
                {isBooked ? <span>Unbook Session</span> : <span>Book Session</span>}
              </Button>
            ) : (
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <span className="text-red-500">You must be signed in to book a session.</span>
                  <SignInButton afterSignInUrl={pathname} mode="modal">
                    <Button>Sign In</Button>
                  </SignInButton>
                </div>
              </SignedOut>
            )}
          </CardFooter>)}
        </Card>

        {/* Admin section */}
        {isAdmin && (
          <div className="mt-4 w-full">
            <Separator />
            <div className="w-full">
              <span className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Admin Section</span>
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
              <AttendeeList maxAttendees={session.maxAttendees} attendees={attendees} isLoading={attendeesIsLoading} />
            </div>
          </div>

        )}

      </div>
    </div>
  );
}

export default SessionPage;
