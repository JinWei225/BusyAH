import { NextResponse } from 'next/server';
import { updateDeadline, deleteDeadline } from '@/app/actions';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { title, description, targetDate } = await request.json();
        await updateDeadline(id, title, description, new Date(targetDate));
        return NextResponse.json({ message: 'Deadline updated' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update deadline' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await deleteDeadline(id);
        return NextResponse.json({ message: 'Deadline deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete deadline' }, { status: 500 });
    }
}
