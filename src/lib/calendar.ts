export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
}

export async function getUpcomingEvents(maxResults: number = 5, customCalendarId?: string): Promise<CalendarEvent[]> {
    const apiKey = process.env.GOOGLE_API_KEY;
    const calendarId = customCalendarId || process.env.GOOGLE_CALENDAR_ID;

    if (apiKey && calendarId) {
        try {
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?maxResults=${maxResults}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}&key=${apiKey}`;
            const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes

            if (res.ok) {
                const data = await res.json();
                if (data.items) {
                    return data.items.map((item: any) => ({
                        id: item.id,
                        title: item.summary,
                        start: new Date(item.start.dateTime || item.start.date).toISOString(),
                        end: new Date(item.end.dateTime || item.end.date).toISOString(),
                    }));
                }
            } else {
                console.error("Google Calendar API Error:", await res.text());
            }
        } catch (e) {
            console.error("Failed to fetch Google Calendar:", e);
        }
    }

    // Fallback / Mock Data if API is not configured or fails.
    const now = new Date();
    return [
        {
            id: 'm1',
            title: 'Design Review Meeting',
            start: new Date(now.getTime() + 1000 * 60 * 60 * 2).toISOString(),
            end: new Date(now.getTime() + 1000 * 60 * 60 * 3).toISOString(),
        },
        {
            id: 'm2',
            title: 'Weekly Standup',
            start: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
            end: new Date(now.getTime() + 1000 * 60 * 60 * 25).toISOString(),
        },
        {
            id: 'm3',
            title: 'Project Deadline',
            start: new Date(now.getTime() + 1000 * 60 * 60 * 48).toISOString(),
            end: new Date(now.getTime() + 1000 * 60 * 60 * 49).toISOString(),
        }
    ].slice(0, maxResults);
}
