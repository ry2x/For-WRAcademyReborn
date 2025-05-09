import { integer, pgSchema, text, timestamp } from 'drizzle-orm/pg-core';

// Define schema name for the bot database
const bot = pgSchema('bot');

// Define user table schema with type-safe columns
export const users = bot.table('users', {
  // Discord user ID as primary key
  id: text('id').primaryKey(),

  // User's current level, defaults to 1
  level: integer('level').notNull().default(1),

  // User's current experience points, defaults to 0
  xp: integer('xp').notNull().default(0),

  // Timestamp of last XP gain, defaults to current time
  lastXpAt: timestamp('last_xp_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  // XP required for next level, defaults to 100
  nextLevelXp: integer('next_level_xp').notNull().default(100),

  // Timestamp when user joined the server, defaults to current time
  joinedAT: timestamp('joined_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Export schema types for type safety
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
