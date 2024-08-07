import { relations, sql } from 'drizzle-orm';
import { integer, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const subgroups = pgEnum('subgroup', [
  'mechanical',
  'programming',
  'outreach',
]);

export const roles = pgEnum('role', ['captain', 'lead', 'member']);

export const types = pgEnum('ticket_type', [
  'feature',
  'fix',
  'part',
  'documentation',
  'product',
  'media',
  'other',
]);

export const priorities = pgEnum('priority', [
  'extreme',
  'high',
  'medium',
  'low',
  'minimal',
]);

export const statuses = pgEnum('status', [
  'not started',
  'in progress',
  'completed',
]);

export const users = pgTable('user', {
  id: varchar('id').primaryKey(),
  email: varchar('email', { length: 128 }).unique(),
  username: varchar('username', { length: 128 }).unique(),
  role: roles('role').notNull(),
  subgroup: subgroups('subgroup').notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  assignments: many(assignments),
  supervising: many(tickets),
}));

export const tickets = pgTable('ticket', {
  id: uuid('id').default(sql`gen_random_uuid()`),
  type: types('type').notNull(),
  subgroup: subgroups('subgroup').notNull(),
  title: varchar('title', { length: 128 }).notNull(),
  description: varchar('description', { length: 2048 }).notNull(),
  priority: priorities('priority').notNull(),
  status: statuses('status').notNull(),
  supervisorId: uuid('supervisor_id').notNull(),
});

export const ticketRelations = relations(tickets, ({ one, many }) => ({
  supervisor: one(users, {
    fields: [tickets.supervisorId],
    references: [users.id],
  }),
  assignments: many(assignments),
}));

export const assignments = pgTable('assignment', {
  userId: uuid('user_id'),
  ticketId: uuid('ticket_id'),
});

export const assignmentRelations = relations(assignments, ({ one }) => ({
  user: one(users, {
    fields: [assignments.userId],
    references: [users.id],
  }),
  ticket: one(tickets, {
    fields: [assignments.userId],
    references: [tickets.id],
  }),
}));
