"use client"

import { Session } from "@/types/Session"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClockIcon, LocationIcon, UserIcon } from "@/utils/icons"
import { formatDate, formatTime, convertToHoursAndMinutes } from "@/utils/utils"
import { useState } from "react"
import { addSession } from "@/utils/sessions"
import app from "@/utils/firebase"
import { useUser } from "@clerk/clerk-react"

interface SessionFormProps {
    session?: Session
}

function SessionForm({ session }: SessionFormProps) {

    const user = useUser();

    const [name, setName] = useState(session?.name || '');
    const [description, setDescription] = useState(session?.description || '');
    const [startTime, setStartTime] = useState(session?.startTime || new Date());
    const [duration, setDuration] = useState(session?.duration || 0);
    const [location, setLocation] = useState(session?.location || '');
    const [instructorName, setInstructorName] = useState(session?.instructorName || '');
    const [maxAttendees, setMaxAttendees] = useState(session?.maxAttendees || 0);

    // Example of how you might handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newSession = {
            name,
            description,
            startTime,
            duration,
            location,
            instructorName,
            maxAttendees
        };

        console.log("app.name", user.isSignedIn); // This will show the current user details if logged in


        try {
            const sessionId = await addSession(newSession);
            console.log("Session created with ID:", sessionId);
        } catch (error) {
            console.error("Error adding session:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-[calc(100vh-75px)] flex-col items-center justify-center space-y-4">
            <Card className="p-4 items-center max-w-[400px]">
                <CardHeader>
                    <CardTitle>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Session Name"
                            className="input"
                        />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="textarea"
                        />
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center gap-2">
                        <ClockIcon />
                        <input
                            type="datetime-local"
                            value={startTime.toISOString().substring(0, 16)}
                            onChange={(e) => setStartTime(new Date(e.target.value))}
                            className="input"
                        />
                    </div>
                    <div>
                        <label><strong>Duration: </strong>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="input"
                            />
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <LocationIcon />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location"
                            className="input"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <UserIcon />
                        <input
                            type="text"
                            value={instructorName}
                            onChange={(e) => setInstructorName(e.target.value)}
                            placeholder="Instructor Name"
                            className="input"
                        />
                    </div>
                    <div>
                        <label><strong>Max Attendees:</strong>
                            <input
                                type="number"
                                value={maxAttendees}
                                onChange={(e) => setMaxAttendees(Number(e.target.value))}
                                className="input"
                            />
                        </label>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button type="submit">Submit Session</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default SessionForm