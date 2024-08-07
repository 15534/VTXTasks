import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions';
import { GetDb, MessageComponentTypes, TextInputStyles } from '../util';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

export const data = {
  name: 'deregister',
  description: 'Remove yourself from the member list',
};

export const getResponse = async (message) => {
  const id = message.member.user.id;

  const db = await GetDb();

  db.delete(users).where(eq(users.id, id));

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
      content: 'You\'re deregistered!'
    }
  };
};
