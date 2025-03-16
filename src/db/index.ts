import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js'; // スキーマをインポート

const { DATABASE_URL } = process.env;
const sql = neon(DATABASE_URL || '');

export const db = drizzle(sql, { schema });
