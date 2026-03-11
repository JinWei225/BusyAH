import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const dailyLogEntries = sqliteTable('daily_log_entries', {
    id: text('id').primaryKey(),
    date: text('date').notNull(), // Format: YYYY-MM-DD
    type: text('type').notNull(), // 'task', 'idea', 'note'
    content: text('content').notNull(),
    isCompleted: integer('is_completed', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .default(sql`(strftime('%s', 'now'))`)
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .default(sql`(strftime('%s', 'now'))`)
        .notNull(),
});

export const deadlines = sqliteTable('deadlines', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    targetDate: integer('target_date', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .default(sql`(strftime('%s', 'now'))`)
        .notNull(),
});

export const settings = sqliteTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
});

