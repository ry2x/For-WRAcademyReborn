import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function main() {
  try {
    // Create schema if not exists
    console.log('Creating schema if not exists...');
    await sql`CREATE SCHEMA IF NOT EXISTS bot;`;

    // Set search path to include bot schema
    await sql`SET search_path TO bot, public;`;

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    if (error.code === '42P07') {
      console.warn(
        'Warning: Some tables already exist. This is often normal for subsequent migrations.',
      );
      console.warn('If you need to recreate the tables, please drop them first.');
      process.exit(0);
    } else {
      console.error('Error running migrations:', error);
      process.exit(1);
    }
  }
}

await main();
