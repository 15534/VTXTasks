import {
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
  TextStyleTypes
} from 'discord-interactions';
import { ticketTypes } from '../schema';

export const data = {
  name: 'new',
  description: "Create a new ticket",
};

export const getResponse = () => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              custom_id: 'ticket-type',
              placeholder: 'Ticket Type',
              options: [
                'Feature',
                'Fix',
                'Product',
                'Part',
                'Documentation',
                'Media',
                'Other',
              ].map((type) => {
                return {
                  label: type,
                  value: type.toLowerCase(),
                };
              })
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.MENTIONABLE_SELECT,
              max_values: 25,
              custom_id: 'assignees',
              placeholder: 'Assignee(s)',
            },
          ],
        },
        // {
        //   type: MessageComponentTypes.ACTION_ROW,
        //   components: [
        //     {
        //       type: MessageComponentTypes.INPUT_TEXT,
        //       style: TextStyleTypes.SHORT,
        //       label: 'Title',
        //       custom_id: 'title',
        //       placeholder: 'Title',
        //       min_length: 1,
        //       max_length: 128,
        //     },
        //   ],
        // },
        // {
        //   type: MessageComponentTypes.ACTION_ROW,
        //   components: [
        //     {
        //       type: MessageComponentTypes.INPUT_TEXT,
        //       style: TextStyleTypes.PARAGRAPH,
        //       label: 'Description',
        //       custom_id: 'description',
        //       placeholder: 'Description',
        //       min_length: 1,
        //       max_length: 2048,
        //     },
        //   ],
        // },
      ],
    },
  };
};
