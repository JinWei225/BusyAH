import { NextResponse } from 'next/server';
import { updateSubtask, deleteSubtask, toggleSubtask } from '@/app/actions';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        if (body.isCompleted !== undefined) {
            await toggleSubtask(id, body.isCompleted);
        } else {
            const { title } = body;
            await updateSubtask(id, title);
        }

        return NextResponse.json({ message: 'Subtask updated' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await deleteSubtask(id);
        return NextResponse.json({ message: 'Subtask deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 });
    }
}
