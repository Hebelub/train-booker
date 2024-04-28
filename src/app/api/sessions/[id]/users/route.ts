
import { getSessionById } from '@/utils/sessions';
import { clerkClient } from '@clerk/nextjs';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSessionById(params.id);

        console.error('Failed to find session', session);

        if (!session) {
            return new Response(JSON.stringify({ error: "Failed to find session" }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        // Retrieve user details for each attendeeId
        const usersPromises = session.attendeeIds.map(attendeeId =>
            clerkClient.users.getUser(attendeeId)
        );
        const users = await Promise.all(usersPromises);

        // Compile a list of usernames from the user details
        // const usernames = users.map(user => user.username); // Assuming the username field exists

        return new Response(JSON.stringify(users), {
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