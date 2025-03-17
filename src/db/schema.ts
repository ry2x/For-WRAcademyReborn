import { integer, pgSchema, text, timestamp } from 'drizzle-orm/pg-core';

const bot = pgSchema('bot');
export const users = bot.table('users', {
  id: text('id').primaryKey(),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  lastXpAt: timestamp('last_xp_at', { withTimezone: true }).defaultNow().notNull(),
  nextLevelXp: integer('next_level_xp').notNull().default(100),
  joinedAT: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
});
