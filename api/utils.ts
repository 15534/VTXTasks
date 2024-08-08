import { neon } from '@neondatabase/serverless';
import { config } from './config';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { users } from './schema';

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

export const getDb = () => {
  const client = neon(config.DATABASE_URL);
  return drizzle(client, { schema })
}

export const condenseAssignees = async (assignees: string[]): Promise<string[]> => {
  let condensedAssignees = [...assignees];

  const db = getDb();

  const mek = await db.query.users.findMany({
    where: eq(users.subgroup, 'mechanical'),
    columns: {
      id: true
    }
  });

  let hasMek = true;

  for (let i = 0; i < mek.length; i++) {
    if (!condensedAssignees.includes(mek[i].id)) {
      hasMek = false;
      break;
    }
  }

  if (hasMek) {
    condensedAssignees = condensedAssignees.filter((assignee) => {
      return !mek.map((user) => user.id).includes(assignee);
    });

    condensedAssignees.push('&' + MECHANICAL_ID);
  }

  const prog = await db.query.users.findMany({
    where: eq(users.subgroup, 'programming'),
    columns: {
      id: true
    }
  });

  let hasProg = true;

  for (let i = 0; i < prog.length; i++) {
    if (!condensedAssignees.includes(prog[i].id)) {
      hasProg = false;
      break;
    }
  }

  if (hasProg) {
    condensedAssignees = condensedAssignees.filter((assignee) => {
      return !prog.map((user) => user.id).includes(assignee);
    });

    condensedAssignees.push('&' + PROGRAMMING_ID);
  }

  const outreach = await db.query.users.findMany({
    where: eq(users.subgroup, 'outreach'),
    columns: {
      id: true
    }
  });

  let hasOutreach = true;

  for (let i = 0; i < outreach.length; i++) {
    if (!condensedAssignees.includes(outreach[i].id)) {
      hasOutreach = false;
      break;
    }
  }

  if (hasOutreach) {
    condensedAssignees = condensedAssignees.filter((assignee) => {
      return !outreach.map((user) => user.id).includes(assignee);
    });

    condensedAssignees.push('&' + OUTREACH_ID);
  }

  return new Promise(() => condensedAssignees);
}