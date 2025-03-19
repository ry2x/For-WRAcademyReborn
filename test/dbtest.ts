import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema.js';

const { DATABASE_URL } = process.env;
const sql = postgres(DATABASE_URL || '', {
  prepare: false,
});

const db = drizzle(sql, { schema });
const users = schema.users;
const data = {
  id: 'test3',
};

await db.insert(users).values(data);

console.log('done!');
