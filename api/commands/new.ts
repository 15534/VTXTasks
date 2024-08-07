import {
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';

export const data = {
  name: 'new',
  description: "Create a new ticket",
  options: [
    {
      type: MessageComponentTypes.STRING_SELECT,
      name: "type",
      description: "Task type",
      required: true,
      choices: [
        'feature',
        'fix',
        'product',
        'part',
        'documentation',
        'media',
        'other',
      ].map((type) => {
        return {
          name: type,
          value: type,
        };
      })
    },
  ]
};

export const getResponse = () => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Ticket created',
    },
  };
};
