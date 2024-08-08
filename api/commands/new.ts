import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions';
import {
  GetDb, MECHANICAL_AFFILIATE_ID,
  MECHANICAL_ID, MEDIA_ID,
  MessageComponentTypes,
  OUTREACH_ID, PROGRAMMING_AFFILIATE_ID,
  PROGRAMMING_ID,
  TASK_CHANNEL,
  TextInputStyles
} from '../utils';
import { and, desc, eq } from 'drizzle-orm';
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
        'product',
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
  let assignees = input[1].value.split('@').map((id) => id.substring(0, id.indexOf('>')));
  const title = input[2].value;
  const description = input[3].value;
  const priority = input[4].value;

  type Subgroup = 'mechanical' | 'programming' | 'outreach'

  let role = 'member';
  let subgroup: Subgroup | 'general' | null = null;

  const db = await GetDb();

  assignees.shift();

  for (let i = 0; i < assignees.length; i++) {
    const assignee = assignees[i];

    if (assignee === MEDIA_ID) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.EPHEMERAL,
          content: 'Media cannot be assigned a task.'
        }
      }
    }

    if (assignee === PROGRAMMING_AFFILIATE_ID) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.EPHEMERAL,
          content: 'The programming affiliate role cannot be assigned tasks.'
        }
      }
    }

    if (assignee === MECHANICAL_AFFILIATE_ID) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.EPHEMERAL,
          content: 'The mechanical affiliate r cannot be assigned tasks.'
        }
      }
    }

    if (assignee === MECHANICAL_ID) {
      assignees.push(
        (await db.query.users.findMany({
          where: eq(users.subgroup, 'mechanical'),
          columns: {
            id: true
          }
        })).map((user) => user.id)
      )

      continue;
    }

    if (assignee === PROGRAMMING_ID) {
      assignees.push(
        (await db.query.users.findMany({
          where: eq(users.subgroup, 'programming'),
          columns: {
            id: true
          }
        })).map((user) => user.id)
      )

      continue;
    }

    if (assignee === OUTREACH_ID) {
      assignees.push(
        (await db.query.users.findMany({
          where: eq(users.subgroup, 'outreach'),
          columns: {
            id: true
          }
        })).map((user) => user.id)
      )

      continue;
    }

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

    if (user.role === 'captain') {
      role = 'captain';
    }

    if (user.role === 'lead' && role !== 'captain') {
      role = 'lead';
    }

    if (!subgroup) {
      subgroup = user.subgroup as Subgroup;
    }

    if (subgroup !== user.subgroup) {
      subgroup = 'general';
    }
  }

  assignees = assignees.filter((assignee) => {
    return assignee !== MECHANICAL_ID && assignee !== PROGRAMMING_ID && assignee !== OUTREACH_ID;
  })

  subgroup = subgroup as Subgroup | 'general';

  let supervisorId;

  if (role == 'member' && subgroup !== 'general') {
    supervisorId = (await db.query.users.findFirst({
      where: and(eq(users.role, 'lead'), eq(users.subgroup, subgroup as Subgroup)),
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

  const ticketAccessIds = await db.query.tickets.findMany({
    columns: {
      accessId: true
    },
    orderBy: desc(tickets.accessId)
  });

  let accessId: number;

  if (ticketAccessIds.length === 0) {
    accessId = 1;
  } else {
    accessId = ticketAccessIds[0].accessId + 1;
  }

  const assigneeList = assignees.map((id, index) => `${index == assignees.length - 1 && assignees.length > 1 ? 'and ' : ''}<@${id}>`).join(', ');

  const messageId = await fetch(`https://discord.com/api/v9/channels/${TASK_CHANNEL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${config.DISCORD_TOKEN}`
    },
    body: JSON.stringify({
      content: `The following ticket has been assigned to ${assigneeList} and is being supervised by <@${supervisorId}>:`,
      embeds: [
        {
          title: `**ID ${accessId}** ${title}`,
          description,
          color: 0xFF0000,
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
  }).then((res) => res.json()).then((res: { id: string }) => res.id).catch((e) => console.error(e));

  const [ticket] = await db.insert(tickets).values({
    accessId,
    messageId: messageId as string,
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
