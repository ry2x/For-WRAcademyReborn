import * as schema from '@/db/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Get database URL from environment variables
const { DATABASE_URL } = process.env;

// Validate database URL
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Configure PostgreSQL connection
const sql = postgres(DATABASE_URL, {
  prepare: false,
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

// Create Drizzle ORM instance with schema
export const db = drizzle(sql, { schema });

// Export database types for type safety
export type Database = typeof db;
