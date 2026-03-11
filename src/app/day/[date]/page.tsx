import DateScroller from '@/components/DateScroller';
import DailyLog from '@/components/DailyLog';
import { getDailyLogEntries } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function DayPage({ params }: { params: { date: string } }) {
    const p = await params;
    const date = p.date;
    const entries = await getDailyLogEntries(date);

    return (
        <div className="day-page" style={{ padding: '20px' }}>
            <DateScroller currentDate={date} />
            <DailyLog date={date} initialEntries={entries} />
        </div>
    );
}
