import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions';
import { GetDb, MessageComponentTypes, TextInputStyles } from '../util';
import { and, eq } from 'drizzle-orm';
import { assignments, tickets, users } from '../schema';

export const data = {
  name: 'new',
  description: 'Create a new ticket',
  options: [
    {
      type: MessageComponentTypes.STRING,
      name: 'type',
      custom_id: 'type',
      description: 'Task category',
      required: true,
      choices: [
        'feature',
        'fix',
        'part',
        'documentation',
        'product',
        'media',
        'other'
      ].map((type) => {
        return {
          name: type,
          value: type
        };
      })
    },
    {
      type: MessageComponentTypes.STRING,
      name: 'assignees',
      description: 'Task assignees',
      label: 'assignees',
      custom_id: 'assignees',
      required: true,
      min_length: 1,
      max_length: 256,
      style: TextInputStyles.SHORT
    },
    {
      type: MessageComponentTypes.STRING,
      name: 'title',
      description: 'Task title',
      label: 'title',
      custom_id: 'title',
      required: true,
      min_length: 1,
      max_length: 128,
      style: TextInputStyles.SHORT
    },
    {
      type: MessageComponentTypes.STRING,
      name: 'description',
      description: 'Task description',
      label: 'description',
      custom_id: 'description',
      min_length: 1,
      max_length: 2048,
      required: true,
      style: TextInputStyles.PARAGRAPH
    },
    {
      type: MessageComponentTypes.STRING,
      name: 'priority',
      custom_id: 'priority',
      description: 'Task priority',
      required: true,
      choices: [
        'extreme',
        'high',
        'medium',
        'low',
        'minimal'
      ].map((priority) => {
        return {
          name: priority,
          value: priority
        };
      })
    }
  ]
};

export const getResponse = async (message) => {
  const input = message.data.options;

  const type = input[0].value;
  const assignees = input[1].value.split('@').map((id) => id.substring(0, id.indexOf('>')));
  const title = input[2].value;
  const description = input[3].value;
  const priority = input[4].value;

  let role = 'member';
  let subgroup = '';

  const db = GetDb();

  for (const assignee in assignees) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, assignee),
      with: {
        id: true,
        role: true,
        subgroup: true,
      }
    });

    if (!user) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Unknown assignee!'
        }
      };
    }

    if (user.role == 'captain') {
      role = 'captain';
    }

    if (user.role == 'lead' && role != 'captain') {
      role = 'lead';
    }

    if (subgroup == '') {
      subgroup = user.subgroup;
    }

    if (subgroup != user.subgroup) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Assignees must be in the same subgroup!'
        }
      };
    }
  }

  let supervisorId;

  if (role == 'member') {
    supervisorId = (await db.query.users.findFirst({
      where: and(eq(users.role, 'lead'), eq(users.subgroup, subgroup)),
      with: {
        id: true
      }
    }))?.id;
  } else {
    supervisorId = (await db.query.users.findFirst({
      where: eq(users.role, 'captain'),
      with: {
        id: true
      }
    }))?.id;
  }

  if (!supervisorId) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'No supervisor found!'
      }
    };
  }

  const ticketId = (await db.insert(tickets).values({
    type,
    subgroup,
    title,
    description,
    priority,
    status: 'not started',
    supervisorId
  }).returning());

  console.log(ticketId);

  // for (const assignee in assignees) {
  //   await db.insert(assignments).values({
  //     userId: assignee,
  //     ticketId: ticketId
  //   }).returning();
  // }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
      content: 'Ticket created!'
    }
  };
};
