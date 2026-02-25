import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const todos = sqliteTable('todos', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    notes: text('notes'),
    isCompleted: integer('is_completed', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .default(sql`(strftime('%s', 'now'))`)
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .default(sql`(strftime('%s', 'now'))`)
        .notNull(),
});

export const subtasks = sqliteTable('subtasks', {
    id: text('id').primaryKey(),
    todoId: text('todo_id')
        .notNull()
        .references(() => todos.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    isCompleted: integer('is_completed', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
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
