'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DateScroller.css';
import { addDays, format, parseISO } from 'date-fns';

export default function DateScroller({ currentDate }: { currentDate: string }) {
    const dateObj = parseISO(currentDate);
    const prevDate = format(addDays(dateObj, -1), 'yyyy-MM-dd');
    const nextDate = format(addDays(dateObj, 1), 'yyyy-MM-dd');
    
    const isToday = currentDate === format(new Date(), 'yyyy-MM-dd');
    const displayDate = isToday ? 'Today' : format(dateObj, 'MMM d, yyyy');

    return (
        <div className="date-scroller">
            <Link href={`/day/${prevDate}`} className="scroller-btn">
                <ChevronLeft size={24} />
            </Link>
            <h2 className="scroller-date">{displayDate}</h2>
            <Link href={`/day/${nextDate}`} className="scroller-btn">
                <ChevronRight size={24} />
            </Link>
        </div>
    );
}
