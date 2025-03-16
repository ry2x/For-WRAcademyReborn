import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import logger from './dist/logger.js';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function main() {
  try {
    // Create schema if not exists
    logger.info('Creating schema if not exists...');
    await sql`CREATE SCHEMA IF NOT EXISTS bot;`;

    // Set search path to include bot schema
    await sql`SET search_path TO bot, public;`;

    logger.info('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    logger.info('Migrations completed successfully');
  } catch (error) {
    if (error.code === '42P07') {
      logger.warn(
        'Warning: Some tables already exist. This is often normal for subsequent migrations.',
      );
      logger.warn('If you need to recreate the tables, please drop them first.');
      process.exit(0);
    } else {
      logger.error('Error running migrations:', error);
      process.exit(1);
    }
  }
}

await main();
