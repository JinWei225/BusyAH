import DateScroller from '@/components/DateScroller';
import DailyLog from '@/components/DailyLog';
import { getDailyLogEntries } from '@/app/actions';
import { isValid, parseISO } from 'date-fns';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DayPage({ params }: { params: { date: string } }) {
    const p = await params;
    const date = p.date;

    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
        redirect('/');
    }

    try {
        const entries = await getDailyLogEntries(date);
        return (
            <div className="day-page" style={{ padding: '20px' }}>
                <DateScroller currentDate={date} />
                <DailyLog date={date} initialEntries={entries} />
            </div>
        );
    } catch (e) {
        console.error("Database connection error:", e);
        return (
            <div className="day-page" style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
                <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Database Error</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    There was a problem connecting to the Turso database. Please verify your <b>TURSO_DATABASE_URL</b> and <b>TURSO_AUTH_TOKEN</b> environment variables on Vercel.
                    <br/><br/>
                    If the variables are correct, ensure that you have pushed the latest database schema (<b>npm run db:push</b>) to your Vercel database!
                </p>
            </div>
        );
    }
}
