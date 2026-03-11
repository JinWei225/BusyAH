'use server';

import { db } from '@/lib/db';
import { dailyLogEntries, deadlines, settings } from '@/lib/db/schema';
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
    revalidatePath('/', 'layout');
}

// Server Actions for Daily Log Entries
export async function getDailyLogEntries(date: string) {
    return await db.select().from(dailyLogEntries).where(eq(dailyLogEntries.date, date)).orderBy(desc(dailyLogEntries.createdAt));
}

export async function createDailyLogEntry(date: string, type: 'task' | 'idea' | 'note', content: string) {
    const id = randomUUID();
    await db.insert(dailyLogEntries).values({
        id,
        date,
        type,
        content,
    });
    revalidatePath(`/day/${date}`);
    return id; // Optionally return the new ID
}

export async function toggleDailyLogEntry(id: string, isCompleted: boolean, date: string) {
    await db.update(dailyLogEntries).set({ isCompleted }).where(eq(dailyLogEntries.id, id));
    revalidatePath(`/day/${date}`);
}

export async function deleteDailyLogEntry(id: string, date: string) {
    await db.delete(dailyLogEntries).where(eq(dailyLogEntries.id, id));
    revalidatePath(`/day/${date}`);
}

export async function updateDailyLogEntry(id: string, content: string, date: string) {
    await db.update(dailyLogEntries).set({ content }).where(eq(dailyLogEntries.id, id));
    revalidatePath(`/day/${date}`);
}

// Deadlines
export async function getDeadlines() {
    return await db.select().from(deadlines).orderBy(desc(deadlines.targetDate));
}

export async function createDeadline(title: string, description: string | null, targetDate: Date) {
    const id = randomUUID();
    await db.insert(deadlines).values({
        id,
        title,
        description,
        targetDate,
    });
    revalidatePath('/deadlines');
    revalidatePath('/');
    const result = await db.select().from(deadlines).where(eq(deadlines.id, id)).limit(1);
    return result[0] ?? null;
}

export async function deleteDeadline(id: string) {
    await db.delete(deadlines).where(eq(deadlines.id, id));
    revalidatePath('/deadlines');
    revalidatePath('/');
}

export async function updateDeadline(id: string, title: string, description: string | null, targetDate: Date) {
    await db.update(deadlines).set({ title, description, targetDate }).where(eq(deadlines.id, id));
    revalidatePath('/deadlines');
    revalidatePath('/');
}
