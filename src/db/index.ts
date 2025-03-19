import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const { DATABASE_URL } = process.env;
const sql = postgres(DATABASE_URL || '', {
  prepare: false,
});

export const db = drizzle(sql, { schema });
