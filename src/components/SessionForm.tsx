"use client"

import { Session } from "@/types/Session"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClockIcon, LocationIcon, UserIcon, CalendarIcon } from "@/utils/icons"
import { formatDate, formatTime, convertToHoursAndMinutes } from "@/utils/utils"
import { useState } from "react"
import { addSession } from "@/utils/sessions"
import app from "@/utils/firebase"
import { useUser } from "@clerk/clerk-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SessionFormProps {
    session?: Session
}

function SessionForm({ session }: SessionFormProps) {

    const user = useUser();

    const [name, setName] = useState(session?.name || '');
    const [description, setDescription] = useState(session?.description || '');
    const [startTime, setStartTime] = useState(session?.startTime || new Date());
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [location, setLocation] = useState(session?.location || '');
    const [instructorName, setInstructorName] = useState(session?.instructorName || '');
    const [maxAttendees, setMaxAttendees] = useState(session?.maxAttendees || 0);

    // Example of how you might handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const duration = hours * 60 + minutes;

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
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Session Name"
                            className="input"
                        />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="textarea"
                        />
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Input
                            type="datetime-local"
                            value={startTime.toISOString().substring(0, 16)}
                            onChange={(e) => setStartTime(new Date(e.target.value))}
                            className="input"
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <ClockIcon />
                        <div>
                            <Label htmlFor="hoursInput">Hours</Label>
                            <Input
                                id="hoursInput"
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className="input"
                                min="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="minutesInput">Minutes</Label>
                            <Input
                                id="minutesInput"
                                type="number"
                                value={minutes}
                                onChange={(e) => setMinutes(Number(e.target.value))}
                                className="input"
                                min="0"
                                max="59"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <LocationIcon />
                        <Input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location"
                            className="input"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <UserIcon />
                        <Input
                            type="text"
                            value={instructorName}
                            onChange={(e) => setInstructorName(e.target.value)}
                            placeholder="Instructor Name"
                            className="input"
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="maxAttendees">Max Attendees</Label>
                        <Input
                            id="maxAttendees"
                            type="number"
                            value={maxAttendees}
                            onChange={(e) => setMaxAttendees(Number(e.target.value))}
                            className="input"
                        />
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