import { InteractionResponseType } from 'discord-interactions';

export const data = {
  name: 'test',
  description: "Test the discord bot's API functionality",
};

export const response = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: 'Working!',
  },
};
