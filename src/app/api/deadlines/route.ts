import { NextResponse } from 'next/server';
import { getDeadlines, createDeadline } from '@/app/actions';

export async function GET() {
    try {
        const deadlines = await getDeadlines();
        return NextResponse.json(deadlines);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch deadlines' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, targetDate } = await request.json();
        if (!title || !targetDate) {
            return NextResponse.json({ error: 'Title and Target Date are required' }, { status: 400 });
        }
        await createDeadline(title, description, new Date(targetDate));
        return NextResponse.json({ message: 'Deadline created' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create deadline' }, { status: 500 });
    }
}
