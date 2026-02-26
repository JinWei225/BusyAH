import { NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/app/actions';

export async function GET() {
    try {
        const todos = await getTodos();
        return NextResponse.json(todos);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, notes } = await request.json();
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }
        await createTodo(title, notes || '');
        return NextResponse.json({ message: 'Todo created' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }
}
