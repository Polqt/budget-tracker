import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './db/schema';

const client = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
  prepare: false,
});

const db = drizzle(client, { schema });

async function main() {
  const result = await db.query.transactions.findMany();
  console.log(result);
}

main();
