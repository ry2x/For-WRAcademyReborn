import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    level: integer('level').notNull().default(1),
    xp: integer('xp').notNull().default(0),
    lastXpAt: timestamp('last_xp_at', { withTimezone: true }).defaultNow().notNull(),
    nextLevelXp: integer('next_level_xp').notNull().default(100),
    joinedAT: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    schema: 'bot',
  }),
);
