import { NextResponse } from 'next/server';
import { getUpcomingEvents } from '@/lib/calendar';
import { getSetting } from '@/app/actions';

export async function GET() {
    try {
        const calendarId = await getSetting('selected_calendar_id') || undefined;
        // Fetch 20 events but the Android app will display 5 as requested.
        const events = await getUpcomingEvents(20, calendarId);
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
    }
}
