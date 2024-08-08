import { neon } from '@neondatabase/serverless';
import { config } from './config';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export enum MessageComponentTypes {
  NUMBER = 4,
  STRING = 3,
  MENTIONABLE_SELECT = 9,
}

export enum TextInputStyles {
  SHORT = 1,
  PARAGRAPH = 2,
}

export const TASK_CHANNEL = "1270942559367069777" as const;

export const CAPTAIN_ID = "848036255283281930" as const;
export const LEAD_ID = '737502259281264664' as const;

export const MECHANICAL_ID = '697834833971249202' as const;
export const PROGRAMMING_ID = '697834869442609202' as const;
export const OUTREACH_ID = '697834893492748418' as const;

export const MEDIA_ID = '1271135794433753172' as const;
export const PROGRAMMING_AFFILIATE_ID = '1028870059365515344' as const;
export const MECHANICAL_AFFILIATE_ID = '1028869953354473543' as const;

export const GetDb = () => {
  const client = neon(config.DATABASE_URL);
  return drizzle(client, { schema })
}