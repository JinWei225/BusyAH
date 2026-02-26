import { NextResponse } from 'next/server';
import { getSubtasks, createSubtask } from '@/app/actions';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: todoId } = await params;
        const subtasks = await getSubtasks(todoId);
        return NextResponse.json(subtasks);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subtasks' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: todoId } = await params;
        const { title } = await request.json();
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }
        await createSubtask(todoId, title);
        return NextResponse.json({ message: 'Subtask created' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create subtask' }, { status: 500 });
    }
}
