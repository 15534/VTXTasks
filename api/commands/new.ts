import { InteractionResponseType } from 'discord-interactions';
import { ResponseType } from '../command';

export const data = {
  name: 'new',
  description: "Create a new ticket",
};

export const getResponse = (): ResponseType => {


  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Working!',
    },
  }
};
