import * as schema from '@/db/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

let db: ReturnType<typeof drizzle> | null = null;
// Get database URL from environment variables
const { DATABASE_URL } = process.env;

// Function to initialize database connection
export const initializeDatabase = (): void => {
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
  db = drizzle(sql, { schema });
};

if (!db && DATABASE_URL) {
  initializeDatabase();
}
export { db };

// Export database types for type safety
export type Database = typeof db;
