import { neon } from '@neondatabase/serverless';
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

export const TASK_CHANNEL = "1270942559367069777" as const;

export const GetDb = () => {
  const client = neon(config.DATABASE_URL);
  return drizzle(client, { schema })
}