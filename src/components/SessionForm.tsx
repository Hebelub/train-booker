"use client"

import { Session } from "@/types/Session"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClockIcon, LocationIcon, UserIcon } from "@/utils/icons"
import { useState } from "react"
import { addSession, updateSession } from "@/utils/sessions"
import { useUser } from "@clerk/clerk-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"


interface SessionFormProps {
    session?: Session
    mode: 'add' | 'update';
    onUpdate?: (updatedSession: Partial<Session>) => void;
}

function SessionForm({ session, mode, onUpdate }: SessionFormProps) {

    const user = useUser();
    const { toast } = useToast()

    const submitButtonText = mode === 'update' ? 'Confirm Edit' : 'Submit Session';

    // Calculate hours and minutes from duration
    const durationInMinutes = session?.duration || 0;
    const initialHours = Math.floor(durationInMinutes / 60); // Get whole hours
    const initialMinutes = durationInMinutes % 60; // Get remaining minutes

    const [name, setName] = useState(session?.name || '');
    const [description, setDescription] = useState(session?.description || '');
    const [startTime, setStartTime] = useState(session?.startTime || new Date());
    const [hours, setHours] = useState(initialHours);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [location, setLocation] = useState(session?.location || '');
    const [instructorName, setInstructorName] = useState(session?.instructorName || '');
    const [maxAttendees, setMaxAttendees] = useState(session?.maxAttendees || 20);
    const [formErrors, setFormErrors] = useState({ name: false });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!name.trim()) {
            setFormErrors({ ...formErrors, name: true });
            toast({
                title: "Validation Error",
                description: "Name is required",
            });
            return; // Stop the form submission if validation fails
        }

        const duration = hours * 60 + minutes;

        const sessionDetails = {
            name,
            description,
            startTime,
            duration,
            location,
            instructorName,
            maxAttendees
        };

        try {
            if (mode === 'add') {
                const sessionId = await addSession(sessionDetails);
                toast({
                    title: "Success",
                    description: `Session created with ID: ${sessionId}`,
                });
                console.log("Session created with ID:", sessionId);
            } else if (mode === 'update' && session?.id) {
                await updateSession(session?.id, sessionDetails);
                if (onUpdate) {
                    onUpdate(sessionDetails)
                }
                toast({
                    title: "Success",
                    description: "Session was successfully edited",
                });
                console.log("Session updated:", session?.id);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: `Error ${mode === 'add' ? 'adding' : 'updating'} session`,
            });
            console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} session:`, error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="">
            <Card className="p-4 items-center max-w-[500px]">
                <CardHeader>
                    <CardTitle>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (formErrors.name && e.target.value.trim()) {
                                    setFormErrors({ ...formErrors, name: false });
                                }
                            }}
                            placeholder="Session Name"
                            className={`${formErrors.name ? 'border-red-500' : ''} input`} // Apply conditional styling directly
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
                    <Button type="submit">{submitButtonText}</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default SessionForm