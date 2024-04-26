import { Session } from "@/types/Session";

export function convertToHoursAndMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);  // Calculate total hours
    const minutes = totalMinutes % 60;            // Get the remaining minutes after extracting hours

    let result = "";

    // Append hours to the result string if more than 0
    if (hours > 0) {
        result += `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    // Append minutes to the result string if more than 0, with handling for when hours are also present
    if (minutes > 0) {
        if (result.length > 0) {
            result += " ";
        }
        result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return result || "0 minutes"; // Return "0 minutes" if there are no hours and minutes
}

export function formatDate(date: Date) {
    if (!(date instanceof Date)) {
        return ''; // Return an empty string if the input is not a Date object
    }

    const day = date.getDate(); // Gets the day of the month (from 1 to 31)
    const month = date.toLocaleDateString('en-US', { month: 'long' }); // Gets the month name in long format

    return `${day}. ${month}`; // Formats and returns the string as "5. June"
}

export function formatTime(date: Date): string {
    if (!(date instanceof Date)) {
        return ''; // Return an empty string if the input is not a valid Date object
    }

    const hours = date.getHours(); // Get the hours part of the date
    const minutes = date.getMinutes(); // Get the minutes part of the date

    // Format hours and minutes to ensure they are always two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`; // Returns the time as "16:45"
}

export function isUserIdAdmin(userId: string): boolean {
    const adminUidsString = process.env.NEXT_PUBLIC_ADMIN_UIDS;

    // Check if the environment variable is set
    if (!adminUidsString) {
        console.warn('NEXT_PUBLIC_ADMIN_UIDS is not set in the environment.');
        return false;
    }

    const adminUids = adminUidsString.split(',');
    return adminUids.includes(userId);
}
