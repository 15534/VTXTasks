import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions';
import { GetDb, MessageComponentTypes, TextInputStyles } from '../util';
import { users } from '../schema';

export const data = {
  name: 'register',
  description: 'Add yourself to the member list',
  options: [
    {
      type: MessageComponentTypes.STRING,
      name: 'email',
      description: 'Your Exeter email',
      label: 'email',
      custom_id: 'email',
      required: true,
      min_length: 1,
      max_length: 128,
      style: TextInputStyles.SHORT
    },
  ]
};

export const getResponse = async (message) => {
  const input = message.data.options;

  const id = message.member.user.id;
  const email = input[0].value;
  const username = message.member.user.username;

  type Subgroup = 'mechanical' | 'programming' | 'outreach';
  type Role = 'member' | 'lead' | 'captain';

  let subgroup: Subgroup | null = null;

  if (message.member.roles.includes('697834833971249202')) {
    subgroup = 'mechanical'
  }

  if (message.member.roles.includes('697834869442609202')) {
    subgroup = 'programming'
  }

  if (message.member.roles.includes('697834893492748418')) {
    subgroup = 'outreach'
  }

  if (!subgroup) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.EPHEMERAL,
        content: 'You are not in any subgroups!'
      }
    }
  }

  subgroup = subgroup as Subgroup;

  let role: Role = 'member';

  if (message.member.roles.includes('737502259281264664')) {
    role = 'lead';
  }

  if (message.member.roles.includes('848036255283281930')) {
    role = 'captain';
  }

  const db = GetDb();

  await db.insert(users).values({
    id,
    email,
    username,
    subgroup,
    role,
  });

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
      content: 'You\'re registered!'
    }
  };
};
