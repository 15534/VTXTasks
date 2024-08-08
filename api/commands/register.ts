import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions';
import {
  CAPTAIN_ID,
  getDb,
  LEAD_ID,
  MECHANICAL_ID,
  MessageComponentTypes, OUTREACH_ID,
  PROGRAMMING_ID,
  TextInputStyles
} from '../utils';
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

  if (!email.match(/.*@exeter\.edu$/)) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.EPHEMERAL,
        content: 'Use your Exeter email!'
      }
    }
  }

  type Subgroup = 'mechanical' | 'programming' | 'outreach';
  type Role = 'member' | 'lead' | 'captain';

  let subgroup: Subgroup | null = null;

  if (message.member.roles.includes(MECHANICAL_ID)) {
    subgroup = 'mechanical'
  }

  if (message.member.roles.includes(PROGRAMMING_ID)) {
    subgroup = 'programming'
  }

  if (message.member.roles.includes(OUTREACH_ID)) {
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

  if (message.member.roles.includes(LEAD_ID)) {
    role = 'lead';
  }

  if (message.member.roles.includes(CAPTAIN_ID)) {
    role = 'captain';
  }

  const db = getDb();

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
