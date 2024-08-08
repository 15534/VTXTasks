import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions';
import { GetDb, MessageComponentTypes, TASK_CHANNEL } from '../utils';
import { and, asc, eq, ne } from 'drizzle-orm';
import { assignments, tickets, users } from '../schema';
import { config } from '../config';

export const data = {
  name: 'status',
  description: 'Update a ticket status',
  options: [
    {
      type: MessageComponentTypes.NUMBER,
      name: 'id',
      custom_id: 'accessId',
      description: 'Task id',
      required: true,
    },
    {
      type: MessageComponentTypes.STRING,
      name: 'status',
      custom_id: 'status',
      description: 'Task status',
      required: true,
      choices: [
        'not started',
        'in progress',
        'in review',
        'completed'
      ].map((status) => {
        return {
          name: status,
          value: status
        };
      })
    }
  ]
};

export const getResponse = async (message) => {
  const input = message.data.options;

  const accessId = input[0].value;
  const status = input[1].value;

  const db = await GetDb();

  const ticket = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.accessId, accessId),
      ne(tickets.status, 'completed')
    ),
    with: {
      assignments: true
    }
  })

  if (!ticket) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.EPHEMERAL,
        content: 'Ticket not found!'
      }
    }
  }

  if (ticket.supervisorId !== message.member.user.id && status === 'completed') {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.EPHEMERAL,
        content: 'You are not the supervisor of this ticket!'
      }
    }
  }

  if (ticket.status === 'completed') {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.EPHEMERAL,
        content: 'Ticket is already completed!'
      }
    }
  }

  // let assigned = false;
  //
  // for (let i = 0; i < ticket.assignments.length; i++) {
  //   if (ticket.assignments[i].userId === message.member.user.id) {
  //     assigned = true;
  //     break;
  //   }
  // }
  //
  // if (!assigned) {
  //   return {
  //     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  //     data: {
  //       flags: InteractionResponseFlags.EPHEMERAL,
  //       content: 'You do not have access to this ticket!'
  //     }
  //   }
  // }

  await fetch(`https://discord.com/api/v9/channels/${TASK_CHANNEL}/messages/${ticket.messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bot ${config.DISCORD_TOKEN}`
    },
  }).catch((e) => console.error(e));

  let embedColor;

  if (status === 'not started') {
    embedColor = 0xFF0000;
  }

  if (status === 'in progress') {
    embedColor = 0x7600BC;
  }

  if (status === 'in review'){
    embedColor = 0x52B2BF;
  }

  if (status === 'completed'){
    embedColor = 0x03C04A;
  }

  let content = `The following ticket status has been updated to **${status}**:`;

  if (status === 'in review') {
    content = `<@${ticket.supervisorId}> please review the following ticket:`;
  }

  if (status === 'completed') {
    content = `The following ticket has been completed:`;
  }

  const messageId = await fetch(`https://discord.com/api/v9/channels/${TASK_CHANNEL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${config.DISCORD_TOKEN}`
    },
    body: JSON.stringify({
      content,
      embeds: [
        {
          title: `**ID ${accessId}** ${ticket.title}`,
          description: ticket.description,
          color: embedColor,
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: 'Type',
              value: ticket.type.split('')[0].toUpperCase() + ticket.type.slice(1),
              inline: true,
            },
            {
              name: 'Subgroup',
              value: ticket.subgroup.split('')[0].toUpperCase() + ticket.subgroup.slice(1),
              inline: true,
            },
            {
              name: 'Priority',
              value: ticket.priority.split('')[0].toUpperCase() + ticket.priority.slice(1),
              inline: true,
            },
          ],
        }
      ]
    })
  }).then((res) => res.json()).then((res: { id: string }) => res.id).catch((e) => console.error(e));

  await db.update(tickets).set({
    status,
    messageId: messageId as string
  }).where(eq(tickets.accessId, accessId));

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
      content: 'Ticket created!'
    }
  };
};
