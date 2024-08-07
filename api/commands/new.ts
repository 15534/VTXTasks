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
          type: 1,
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
      ],
    },
  };
};
