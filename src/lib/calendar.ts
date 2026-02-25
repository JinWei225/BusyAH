export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

export async function getUpcomingEvents(maxResults: number = 5): Promise<CalendarEvent[]> {
    const apiKey = process.env.GOOGLE_API_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (apiKey && calendarId) {
        try {
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?maxResults=${maxResults}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}&key=${apiKey}`;
            const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes
            if (res.ok) {
                const data = await res.json();
                return data.items.map((item: any) => ({
                    id: item.id,
                    title: item.summary,
                    start: new Date(item.start.dateTime || item.start.date),
                    end: new Date(item.end.dateTime || item.end.date),
                }));
            }
        } catch (e) {
            console.error("Failed to fetch Google Calendar:", e);
        }
    }

    // Fallback / Mock Data if API is not configured.
    const now = new Date();
    return [
        {
            id: 'm1',
            title: 'Design Review Meeting',
            start: new Date(now.getTime() + 1000 * 60 * 60 * 2),
            end: new Date(now.getTime() + 1000 * 60 * 60 * 3),
        },
        {
            id: 'm2',
            title: 'Weekly Standup',
            start: new Date(now.getTime() + 1000 * 60 * 60 * 24),
            end: new Date(now.getTime() + 1000 * 60 * 60 * 25),
        },
        {
            id: 'm3',
            title: 'Project Deadline',
            start: new Date(now.getTime() + 1000 * 60 * 60 * 48),
            end: new Date(now.getTime() + 1000 * 60 * 60 * 49),
        }
    ].slice(0, maxResults);
}
