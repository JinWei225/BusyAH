import { NextResponse } from 'next/server';
import { updateTodo, deleteTodo, toggleTodo } from '@/app/actions';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (body.isCompleted !== undefined) {
            await toggleTodo(id, body.isCompleted);
        } else {
            const { title, notes } = body;
            await updateTodo(id, title, notes);
        }

        return NextResponse.json({ message: 'Todo updated' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteTodo(id);
        return NextResponse.json({ message: 'Todo deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
    }
}
