import { neon, neonConfig } from '@neondatabase/serverless';
import { config } from './config';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export enum MessageComponentTypes {
  STRING = 3,
  MENTIONABLE_SELECT = 9,
}

export enum TextInputStyles {
  SHORT = 1,
  PARAGRAPH = 2,
}

export const GetDb = () => {
  neonConfig.fetchConnectionCache = true
  const client = neon(config.DATABASE_URL);

  return drizzle(client, { schema })
}