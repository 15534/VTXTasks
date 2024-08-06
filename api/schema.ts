import { integer, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const subgroups = pgEnum('subgroup', ['mechanical', 'programming', 'outreach']);
export const roles = pgEnum('role', ['captain', 'lead', 'member']);

export const ticketTypes = pgEnum('ticket_type', ['feature', 'fix', 'product', 'part', 'documentation', 'media', 'other']);
export const statuses = pgEnum('status', ['not started', 'in progress', 'completed']);

export const users = pgTable('user', {
  id: uuid('id').default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 128 }).unique(),
  username: varchar('username', { length: 128 }).unique(),
  role: roles('role'),
  subgroup: subgroups('subgroup'),
});

export const userRelations = relations(users, ({ many }) => ({
  assignments: many(assignments),
  supervising: many(tickets),
}));

export const tickets = pgTable('ticket', {
  id: uuid('id').default(sql`gen_random_uuid()`),
  supervisorId: uuid('supervisor_id'),
  type: ticketTypes('type'),
  subgroup: subgroups('subgroup'),
  status: statuses('status'),
  priority: integer('priority'),
  description: varchar('description', { length: 2048 }),
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
})

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

