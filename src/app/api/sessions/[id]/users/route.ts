import { getSessionById, idsOfAttending } from '@/utils/sessions';
import { clerkClient } from '@clerk/nextjs';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSessionById(params.id);

        if (!session) {
            console.error('Failed to find session', session);
            return new Response(JSON.stringify({ error: "Failed to find session" }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        
        if (!session.attendees || session.attendees.length === 0) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        // Filter out the userIds from the attendees array
        const attendeeIds = idsOfAttending(session)

        // Retrieve user details for each userId in the attendees array
        const usersPromises = attendeeIds.map(userId =>
            clerkClient.users.getUser(userId).catch(() => null) // Catch errors and return null
        );
        const users = await Promise.all(usersPromises);

        // Filter out null values
        const validUsers = users.filter(user => user !== null);

        return new Response(JSON.stringify(validUsers), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error('Failed to fetch session or user data:', error);
        return new Response(JSON.stringify({ error: "Failed to process request" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
