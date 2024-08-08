import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions';
import { GetDb, MessageComponentTypes, TASK_CHANNEL, TextInputStyles } from '../utils';
import { and, eq } from 'drizzle-orm';
import { assignments, tickets, users } from '../schema';
import { config } from '../config';

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

  type Subgroup = 'mechanical' | 'programming' | 'outreach'

  let role = 'member';
  let subgroup: Subgroup | null = null;

  const db = GetDb();

  assignees.shift();

  for (let i = 0; i < assignees.length; i++) {
    const assignee = assignees[i];

    const user = await db.query.users.findFirst({
      where: eq(users.id, assignee),
      columns: {
        role: true,
        subgroup: true,
      }
    });

    if (!user) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.EPHEMERAL,
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

    if (!subgroup) {
      subgroup = user.subgroup as Subgroup;
    }

    if (subgroup != user.subgroup) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.EPHEMERAL,
          content: 'Assignees must be in the same subgroup!'
        }
      };
    }
  }

  subgroup = subgroup as Subgroup;

  let supervisorId;

  if (role == 'member') {
    supervisorId = (await db.query.users.findFirst({
      where: and(eq(users.role, 'lead'), eq(users.subgroup, subgroup)),
      columns: {
        id: true
      }
    }))?.id;
  } else {
    supervisorId = (await db.query.users.findFirst({
      where: eq(users.role, 'captain'),
      columns: {
        id: true
      }
    }))?.id;
  }

  if (!supervisorId) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.EPHEMERAL,
        content: 'No supervisor found!'
      }
    };
  }

  const assigneeList = assignees.map((id, index) => `${index == assignees.length - 1 ? 'and ' : ''}<@${id}>`).join(', ');

  const response = await fetch(`https://discord.com/api/v9/channels/${TASK_CHANNEL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${config.DISCORD_TOKEN}`
    },
    body: JSON.stringify({
      content: `The following ticket has been assigned to ${assigneeList} and is being supervised by <@${supervisorId}>:`,
      embeds: [
        {
          title,
          description,
          color: "#FF0000",
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: 'Type',
              value: type.split('')[0].toUpperCase() + type.slice(1),
              inline: true,
            },
            {
              name: 'Subgroup',
              value: subgroup.split('')[0].toUpperCase() + subgroup.slice(1),
              inline: true,
            },
            {
              name: 'Priority',
              value: priority.split('')[0].toUpperCase() + priority.slice(1),
              inline: true,
            },
          ],
        }
      ]
    })
  })

  const [ticket] = await db.insert(tickets).values({
    messageId: "fdsafsda",
    type,
    subgroup,
    title,
    description,
    priority,
    status: 'not started',
    supervisorId
  }).returning();

  for (let i = 0; i < assignees.length; i++) {
    const assignee = assignees[i];

    await db.insert(assignments).values({
      ticketId: ticket.id,
      userId: assignee
    });
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
      content: 'Ticket created!'
    }
  };
};
