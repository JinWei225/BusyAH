'use server';

import { db } from '@/lib/db';
import { todos, subtasks, deadlines, settings } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

// Server Actions for Settings
export async function getSetting(key: string) {
    try {
        const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
        return result[0]?.value || null;
    } catch (e) {
        console.error(`Setting fetch failed for ${key}:`, e);
        return null; // Return null if table doesn't exist yet (prevents build crash)
    }
}

export async function updateSetting(key: string, value: string) {
    await db.insert(settings)
        .values({ key, value })
        .onConflictDoUpdate({ target: settings.key, set: { value } });
    revalidatePath('/');
}

// Server Actions for Todos
// ... existing code ...
export async function getTodos() {
    return await db.select().from(todos).orderBy(desc(todos.createdAt));
}

export async function createTodo(title: string, notes: string = '') {
    await db.insert(todos).values({
        id: randomUUID(),
        title,
        notes,
    });
    revalidatePath('/');
}

export async function toggleTodo(id: string, isCompleted: boolean) {
    await db.update(todos).set({ isCompleted }).where(eq(todos.id, id));
    revalidatePath('/');
}

export async function deleteTodo(id: string) {
    await db.delete(todos).where(eq(todos.id, id));
    revalidatePath('/');
}

// Subtasks
export async function getSubtasks(todoId: string) {
    return await db.select().from(subtasks).where(eq(subtasks.todoId, todoId)).orderBy(desc(subtasks.createdAt));
}

export async function createSubtask(todoId: string, title: string) {
    await db.insert(subtasks).values({
        id: randomUUID(),
        todoId,
        title,
    });
    revalidatePath('/');
}

export async function toggleSubtask(id: string, isCompleted: boolean) {
    await db.update(subtasks).set({ isCompleted }).where(eq(subtasks.id, id));
    revalidatePath('/');
}

export async function deleteSubtask(id: string) {
    await db.delete(subtasks).where(eq(subtasks.id, id));
    revalidatePath('/');
}

// Deadlines
export async function getDeadlines() {
    return await db.select().from(deadlines).orderBy(desc(deadlines.targetDate));
}

export async function createDeadline(title: string, description: string | null, targetDate: Date) {
    await db.insert(deadlines).values({
        id: randomUUID(),
        title,
        description,
        targetDate,
    });
    revalidatePath('/');
}

export async function deleteDeadline(id: string) {
    await db.delete(deadlines).where(eq(deadlines.id, id));
    revalidatePath('/');
}
