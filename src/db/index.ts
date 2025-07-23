import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 10, // Maximum connections in pool
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export type DbType = typeof db;

// Helper to close the database connection
export const closeDb = async () => {
  await client.end();
};
