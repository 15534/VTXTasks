import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config({ path: '.env' });

export default {
  schema: './src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
