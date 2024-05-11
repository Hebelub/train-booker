import React, { useState } from 'react';
import { bookSession, unbookSession } from '@/utils/sessions';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SessionBookingControlsProps {
    sessionId: string;
    userId: string | null;
    isBooked: boolean;
    onBookingChange: () => void;
}

const SessionBookingControls = (props: SessionBookingControlsProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    if (!props.userId) {
        return <div>You must be signed in to book a session.</div>
    }

    const handleBook = async () => {

        try {
            setLoading(true);
            props.onBookingChange();
            setLoading(false);
            toast({
                title: "Booking Successful",
                description: `You have successfully booked the session.`,
            });
        } catch (err) {
            console.error(err);
            setError('Failed to book the session.');
            setLoading(false);
            toast({
                title: "Booking Failed",
                description: 'Failed to book the session.',
            });
        }
    };

    const handleUnbook = async () => {

        try {
            setLoading(true);
            props.onBookingChange();
            setLoading(false);
            toast({
                title: "Unbooking Successful",
                description: `You have successfully unbooked the session.`
            });
        } catch (err) {
            console.error(err);
            setError('Failed to unbook the session.');
            setLoading(false);
            toast({
                title: "Unbooking Failed",
                description: 'Failed to unbook the session.'
            });
        }
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {props.isBooked ? (
                <Button onClick={handleUnbook} disabled={loading} className="btn btn-danger">
                    {loading ? 'Processing...' : 'Unbook Session'}
                </Button>
            ) : (
                <Button onClick={handleBook} disabled={loading} className="btn btn-primary">
                    {loading ? 'Processing...' : 'Book Session'}
                </Button>
            )}
        </div>
    );
};

export default SessionBookingControls;
